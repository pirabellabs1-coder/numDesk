"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/hooks/api-client";
import { useWorkspace } from "@/providers/workspace-provider";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function ChatPage() {
  const { workspaceId } = useWorkspace();
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");

  const { data: channels, isLoading } = useQuery({
    queryKey: ["chat-channels", workspaceId],
    queryFn: () => apiFetch<any[]>(`/chat/channels?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });

  useEffect(() => {
    if (channels && channels.length > 0 && !activeChannel) setActiveChannel(channels[0].id);
  }, [channels, activeChannel]);

  const { data: msgList } = useQuery({
    queryKey: ["chat-messages", activeChannel],
    queryFn: () => apiFetch<any[]>(`/chat/messages?channel_id=${activeChannel}`),
    enabled: !!activeChannel,
    refetchInterval: 5000,
  });

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgList]);

  const createChannel = useMutation({
    mutationFn: (name: string) => apiFetch<any>("/chat/channels", { method: "POST", body: JSON.stringify({ workspaceId, name, icon: "tag" }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["chat-channels"] }); setShowCreateChannel(false); setNewChannelName(""); toast("Channel créé"); },
  });

  const sendMessage = useMutation({
    mutationFn: (content: string) => apiFetch<any>("/chat/messages", { method: "POST", body: JSON.stringify({ channelId: activeChannel, content }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["chat-messages"] }); setMessage(""); },
  });

  const handleSend = () => { if (!message.trim() || !activeChannel) return; sendMessage.mutate(message.trim()); };

  const currentChannel = channels?.find((c: any) => c.id === activeChannel);
  if (isLoading) return <PageSkeleton />;

  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex h-[calc(100vh-8rem)] flex-col sm:flex-row gap-0 overflow-hidden rounded-2xl border border-white/5 bg-card">
        {/* Channels */}
        <div className="w-full sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-white/5 bg-surface/50 max-h-48 sm:max-h-none overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/5 p-4">
            <h2 className="text-sm font-bold text-on-surface">Messages</h2>
            <button onClick={() => setShowCreateChannel(true)} className="text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
          {showCreateChannel && (
            <div className="border-b border-white/5 p-3">
              <input value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} placeholder="Nom du channel" className="mb-2 w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" onKeyDown={(e) => e.key === "Enter" && newChannelName.trim() && createChannel.mutate(newChannelName.trim())} />
              <button onClick={() => newChannelName.trim() && createChannel.mutate(newChannelName.trim())} className="w-full rounded-lg bg-primary py-1.5 text-[10px] font-bold text-white">Créer</button>
            </div>
          )}
          <div className="p-2 space-y-[2px]">
            {(!channels || channels.length === 0) ? (
              <p className="px-3 py-4 text-xs text-on-surface-variant">Aucun channel.</p>
            ) : channels.map((ch: any) => (
              <button key={ch.id} onClick={() => setActiveChannel(ch.id)} className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all ${activeChannel === ch.id ? "bg-surface-container-low text-on-surface" : "text-on-surface-variant hover:bg-surface-container-lowest"}`}>
                <span className="material-symbols-outlined text-[18px]">{ch.icon || "tag"}</span>
                <p className="flex-1 text-[13px] font-bold">{ch.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex flex-1 flex-col">
          {!activeChannel ? (
            <div className="flex flex-1 items-center justify-center"><EmptyState icon="chat" title="Sélectionnez un channel" /></div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-white/5 px-3 py-2 sm:px-4 sm:py-3 md:px-6">
                <span className="material-symbols-outlined text-primary">{currentChannel?.icon || "tag"}</span>
                <h3 className="text-sm font-bold text-on-surface">{currentChannel?.name}</h3>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {(!msgList || msgList.length === 0) ? (
                  <p className="text-center text-xs text-on-surface-variant">Aucun message. Soyez le premier !</p>
                ) : [...msgList].reverse().map((msg: any) => {
                  const isMe = msg.authorId === user?.id;
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${isMe ? "bg-gradient-to-br from-primary to-secondary" : "bg-surface-container-high text-on-surface-variant"}`}>{msg.authorAvatar || "U"}</div>
                      <div className={`max-w-md ${isMe ? "text-right" : ""}`}>
                        {!isMe && <span className="mb-1 block text-xs font-bold text-on-surface">{msg.authorName}</span>}
                        <div className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${isMe ? "bg-gradient-to-r from-primary to-secondary text-white" : "bg-surface-container-low text-on-surface"}`}>{msg.content}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t border-white/5 p-4">
                <div className="flex items-center gap-3">
                  <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Écrire un message..." className="flex-1 rounded-xl bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                  <button onClick={handleSend} disabled={sendMessage.isPending || !message.trim()} className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white transition-all hover:bg-primary/80 disabled:opacity-50">
                    <span className="material-symbols-outlined text-lg">send</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
