"use client";

import { useState } from "react";
import { useConversations } from "@/hooks/use-conversations";
import { useWorkspace } from "@/providers/workspace-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";

const statusStyles: Record<string, string> = {
  success: "bg-tertiary/10 text-tertiary",
  missed: "bg-white/5 text-on-surface-variant",
  interrupted: "bg-error/10 text-error",
  voicemail: "bg-secondary/10 text-secondary",
};

const sentimentIcons: Record<string, { icon: string; color: string }> = {
  positive: { icon: "sentiment_satisfied", color: "text-tertiary" },
  neutral: { icon: "sentiment_neutral", color: "text-on-surface-variant" },
  negative: { icon: "sentiment_dissatisfied", color: "text-error" },
};

export default function ConversationsPage() {
  const { workspaceId } = useWorkspace();
  const [filter, setFilter] = useState("all");
  const { data: convData } = useConversations(workspaceId, filter !== "all" ? { status: filter } : undefined);

  const conversations = convData ?? [];
  const [selected, setSelected] = useState<any>(conversations[0]);

  const filtered = filter === "all"
    ? conversations
    : conversations.filter((c: any) => c.status === filter);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1
          className="text-4xl font-bold tracking-tight text-on-surface"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Conversations
        </h1>
        <p className="mt-2 text-on-surface-variant">
          {conversations.length} conversation(s)
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { id: "all", label: "Toutes" },
          { id: "success", label: "Succès" },
          { id: "missed", label: "Manqués" },
          { id: "interrupted", label: "Interrompus" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              filter === f.id
                ? "bg-primary/10 text-primary"
                : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-card lg:col-span-3">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                {["Appelant", "Agent", "Durée", "Statut", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((conv) => (
                <tr
                  key={conv.id}
                  onClick={() => setSelected(conv)}
                  className={`cursor-pointer transition-colors hover:bg-white/[0.02] ${
                    selected?.id === conv.id ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high">
                        <span className="material-symbols-outlined text-xs text-on-surface-variant">person</span>
                      </div>
                      <span className="text-xs font-medium text-on-surface">{conv.callerNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${conv.agentColor}`} />
                      <span className="text-xs text-on-surface">{conv.agentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-on-surface-variant">{conv.duration}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusStyles[conv.status]}`}>
                      {conv.statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-on-surface-variant">{conv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="rounded-2xl border border-white/5 bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-on-surface">{selected.callerNumber}</p>
                    <p className="text-xs text-on-surface-variant">{selected.agentName}</p>
                  </div>
                  <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[selected.status]}`}>
                    {selected.statusLabel}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Durée", value: selected.duration },
                    { label: "Direction", value: selected.typeLabel },
                    { label: "Facturé", value: selected.isBilled ? "Oui" : "Non" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg bg-surface-container-low p-2">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">{m.label}</p>
                      <p className="text-sm font-bold text-on-surface">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {selected.summary && (
                <div className="rounded-2xl border border-white/5 bg-card p-5">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm text-secondary">auto_awesome</span>
                    Résumé IA
                  </p>
                  <p className="text-sm leading-relaxed text-on-surface">{selected.summary}</p>
                </div>
              )}

              {/* Transcript */}
              <div className="rounded-2xl border border-white/5 bg-card p-5">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Transcript
                </p>
                {selected.transcript.length === 0 ? (
                  <p className="text-xs text-on-surface-variant/50">Aucun transcript disponible.</p>
                ) : (
                  <div className="space-y-3">
                    {selected.transcript.map((msg: any, i: number) => (
                      <div
                        key={i}
                        className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          msg.role === "agent"
                            ? "bg-surface-container-low text-on-surface"
                            : "bg-primary/10 text-on-surface"
                        }`}>
                          {msg.content}
                          <p className="mt-1 text-[9px] text-on-surface-variant/40">{msg.ts}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-white/5 bg-card text-sm text-on-surface-variant">
              Sélectionnez une conversation
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
