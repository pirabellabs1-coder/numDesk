"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePhoneNumbers } from "@/hooks/use-phone-numbers";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";

type TestMode = "vocal" | "chatbot" | "custom";

interface Message {
  role: "agent" | "user";
  content: string;
  timestamp?: string;
}

interface TestModalProps {
  agent: {
    id: string;
    name: string;
    vapiAgentId?: string;
    prompt?: string;
    firstMessage?: string;
    language?: string;
    voiceProvider?: string;
    voiceId?: string;
  };
  onClose: () => void;
}

export function TestModal({ agent, onClose }: TestModalProps) {
  const [mode, setMode] = useState<TestMode>("vocal");
  const { toast } = useToast();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col rounded-2xl border border-white/10 bg-surface shadow-2xl" style={{ maxHeight: "85vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
            Tester l&apos;agent
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-white/5 hover:text-on-surface">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex border-b border-white/5">
          {([
            { id: "vocal" as const, label: "VOCAL", icon: "mic" },
            { id: "chatbot" as const, label: "CHATBOT", icon: "chat" },
            { id: "custom" as const, label: "CUSTOM", icon: "call" },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              className={`flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold tracking-wider transition-all ${
                mode === t.id
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {mode === "vocal" && <VocalMode agent={agent} />}
          {mode === "chatbot" && <ChatbotMode agent={agent} />}
          {mode === "custom" && <CustomMode agent={agent} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}

/* ─── VOCAL MODE ─── */
function VocalMode({ agent }: { agent: TestModalProps["agent"] }) {
  const [status, setStatus] = useState<"idle" | "connecting" | "active" | "ended">("idle");
  const [transcript, setTranscript] = useState<Message[]>([]);
  const vapiRef = useRef<any>(null);
  const { toast } = useToast();

  const startCall = useCallback(async () => {
    setStatus("connecting");
    setTranscript([]);

    try {
      const { default: Vapi } = await import("@vapi-ai/web");
      const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
      if (!publicKey) {
        toast("Clé publique Vapi non configurée", "error");
        setStatus("idle");
        return;
      }

      const vapi = new Vapi(publicKey);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setStatus("active");
      });

      vapi.on("message", (msg: any) => {
        if (msg.type === "transcript" && msg.transcriptType === "final") {
          setTranscript((prev) => [...prev, {
            role: msg.role === "assistant" ? "agent" : "user",
            content: msg.transcript,
            timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          }]);
        }
      });

      vapi.on("call-end", () => {
        setStatus("ended");
        vapiRef.current = null;
      });

      vapi.on("error", (err: any) => {
        toast(err?.message || "Erreur lors de l'appel vocal", "error");
        setStatus("idle");
        vapiRef.current = null;
      });

      // Build voice from current editor selection
      const voiceProvider = agent.voiceProvider || "cartesia";
      const voiceId = agent.voiceId || "a8a1eb38-5f15-4c1d-8722-7ac0f329727d";
      const vapiVoiceProvider = voiceProvider === "elevenlabs" ? "11labs" : voiceProvider;

      // Determine transcriber language from agent language
      const lang = agent.language || "fr-FR";
      const transcriberLang = lang.startsWith("fr") ? "fr" : lang.split("-")[0] || "fr";

      // Build voice config with proper model, speed and chunking settings
      const voiceConfig: Record<string, unknown> = {
        provider: vapiVoiceProvider,
        voiceId: voiceId,
        // Chunk plan: wait for full sentences before sending to TTS
        // This prevents the voice from cutting words/fragments mid-sentence
        chunkPlan: {
          enabled: true,
          minCharacters: 80,
          punctuationBoundaries: [".", "!", "?", ";"],
        },
      };
      if (voiceProvider === "cartesia") {
        voiceConfig.model = "sonic-2";
        voiceConfig.language = transcriberLang;
        voiceConfig.experimentalControls = { speed: "normal" };
      }
      if (voiceProvider === "elevenlabs") {
        voiceConfig.model = "eleven_multilingual_v2";
      }

      // Use inline assistant config so the test ALWAYS matches the editor selection
      await vapi.start({
        model: {
          provider: "google",
          model: "gemini-2.5-flash",
          messages: [{ role: "system", content: agent.prompt || "Tu es un assistant téléphonique professionnel. Réponds toujours en français avec des phrases complètes et naturelles." }],
          temperature: 0.4,
        },
        voice: voiceConfig,
        transcriber: {
          provider: "deepgram",
          language: transcriberLang,
        },
        firstMessage: agent.firstMessage || "Bonjour, comment puis-je vous aider ?",
      } as any);
    } catch (e: any) {
      toast(e.message || "Impossible de démarrer l'appel vocal", "error");
      setStatus("idle");
    }
  }, [agent.vapiAgentId, toast]);

  const endCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      vapiRef.current = null;
    }
    setStatus("ended");
  }, []);

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col p-6">
      {/* Status indicator */}
      <div className="mb-6 flex flex-col items-center gap-4">
        <div className={`flex h-20 w-20 items-center justify-center rounded-full ${
          status === "active" ? "bg-tertiary/10 animate-pulse" : status === "connecting" ? "bg-primary/10" : "bg-surface-container-high"
        }`}>
          <span className={`material-symbols-outlined text-3xl ${
            status === "active" ? "text-tertiary" : status === "connecting" ? "text-primary" : "text-on-surface-variant"
          }`}>
            {status === "active" ? "graphic_eq" : status === "connecting" ? "sync" : "mic"}
          </span>
        </div>
        <p className="text-sm font-medium text-on-surface-variant">
          {status === "idle" && "Cliquez pour démarrer un test vocal"}
          {status === "connecting" && "Connexion en cours..."}
          {status === "active" && "Conversation en cours — parlez !"}
          {status === "ended" && "Conversation terminée"}
        </p>
      </div>

      {/* Transcript */}
      {transcript.length > 0 && (
        <div className="mb-6 max-h-48 space-y-2 overflow-y-auto rounded-xl bg-surface-container-lowest p-4">
          {transcript.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                msg.role === "agent" ? "bg-primary/10 text-on-surface" : "bg-surface-container-high text-on-surface"
              }`}>
                <p className="mb-0.5 text-[9px] font-bold text-on-surface-variant">{msg.role === "agent" ? agent.name : "Vous"}</p>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col gap-3">
        {(status === "idle" || status === "ended") && (
          <button
            onClick={startCall}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">mic</span>
            {status === "ended" ? "Relancer" : "Démarrer le test vocal"}
          </button>
        )}
        {status === "active" && (
          <button
            onClick={endCall}
            className="flex items-center justify-center gap-2 rounded-xl bg-error py-3 text-sm font-bold text-white transition-all"
          >
            <span className="material-symbols-outlined text-sm">call_end</span>
            Terminer
          </button>
        )}
        {status === "connecting" && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-surface-container-high py-3 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-sm">sync</span>
            Connexion...
          </div>
        )}
        <p className="text-center text-xs text-on-surface-variant">
          Le test vocal utilise la voix et le prompt actuels de l&apos;éditeur.
        </p>
      </div>
    </div>
  );
}

/* ─── CHATBOT MODE ─── */
function ChatbotMode({ agent }: { agent: TestModalProps["agent"] }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (agent.firstMessage) {
      return [{ role: "agent", content: agent.firstMessage, timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }];
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");

    const newMessages: Message[] = [...messages, {
      role: "user",
      content: userMsg,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/agents/chat-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          messages: newMessages.map((m) => ({
            role: m.role === "agent" ? "assistant" : "user",
            content: m.content,
          })),
          systemPrompt: agent.prompt,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Erreur");

      setMessages((prev) => [...prev, {
        role: "agent",
        content: data.data?.reply || "...",
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch (e: any) {
      setMessages((prev) => [...prev, {
        role: "agent",
        content: `Erreur : ${e.message}`,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col" style={{ height: "400px" }}>
      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "agent" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <span className="material-symbols-outlined text-xs text-primary">smart_toy</span>
              </div>
            )}
            <div className={`max-w-[75%] rounded-xl px-3 py-2.5 text-sm ${
              msg.role === "agent"
                ? "bg-surface-container-low text-on-surface"
                : "bg-primary text-white"
            }`}>
              {msg.content}
              <p className={`mt-1 text-[9px] ${msg.role === "agent" ? "text-on-surface-variant" : "text-white/60"}`}>{msg.timestamp}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <span className="material-symbols-outlined text-xs text-primary">smart_toy</span>
            </div>
            <div className="rounded-xl bg-surface-container-low px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant/50" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant/50" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant/50" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white transition-all hover:brightness-110 disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── CUSTOM MODE (call real phone) ─── */
function CustomMode({ agent, onClose }: { agent: TestModalProps["agent"]; onClose: () => void }) {
  const { workspaceId } = useWorkspace();
  const { data: phoneNumbers } = usePhoneNumbers(workspaceId);
  const [testPhone, setTestPhone] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const { toast } = useToast();

  const numList = phoneNumbers ?? [];

  const handleLaunchCall = async () => {
    if (!testPhone.trim()) return;
    setTestLoading(true);
    try {
      // Normalize to E.164 format: ensure + prefix
      let normalizedPhone = testPhone.trim().replace(/\s+/g, "");
      if (!normalizedPhone.startsWith("+")) {
        normalizedPhone = "+" + normalizedPhone;
      }
      const res = await fetch("/api/vapi/call-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id, phoneNumber: normalizedPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Erreur");
      toast(`Appel test lancé vers ${testPhone}`);
      onClose();
    } catch (e: any) {
      toast(e.message || "Erreur lors du lancement", "error");
    }
    setTestLoading(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start gap-3 rounded-xl bg-primary/5 p-4">
        <span className="material-symbols-outlined text-primary">info</span>
        <div>
          <p className="text-sm font-medium text-on-surface">Appel téléphonique réel</p>
          <p className="mt-0.5 text-xs text-on-surface-variant">
            L&apos;agent appellera le numéro ci-dessous. Les minutes seront décomptées de votre solde.
          </p>
        </div>
      </div>

      {!agent.vapiAgentId ? (
        <div className="rounded-xl border border-white/5 bg-surface-container-low p-6 text-center">
          <span className="material-symbols-outlined mb-2 text-3xl text-on-surface-variant">rocket_launch</span>
          <p className="text-sm font-medium text-on-surface">Agent non publié</p>
          <p className="mt-1 text-xs text-on-surface-variant">Publiez d&apos;abord l&apos;agent pour pouvoir passer un appel test.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick select from existing numbers */}
          {numList.length > 0 && (
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Numéros disponibles
              </label>
              <div className="space-y-2">
                {numList.map((num: any) => (
                  <button
                    key={num.id}
                    onClick={() => setTestPhone(num.number)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${
                      testPhone === num.number
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-white/5 text-on-surface hover:border-white/10"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span className="font-mono">{num.number}</span>
                    {num.friendlyName && <span className="text-xs text-on-surface-variant">— {num.friendlyName}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Ou saisir un numéro
            </label>
            <input
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="+22901234567"
              className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="mt-1 text-[10px] text-on-surface-variant">Format E.164 avec indicatif pays (ex: +229, +33, +1)</p>
          </div>

          <button
            onClick={handleLaunchCall}
            disabled={testLoading || !testPhone.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            {testLoading ? "Lancement..." : "Lancer l'appel test"}
          </button>
        </div>
      )}
    </div>
  );
}
