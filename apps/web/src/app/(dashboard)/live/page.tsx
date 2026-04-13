"use client";

import { useState, useEffect } from "react";
import { useConversations } from "@/hooks/use-conversations";
import { useWorkspace } from "@/providers/workspace-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const sentimentIcons: Record<string, string> = {
  positive: "sentiment_satisfied",
  neutral: "sentiment_neutral",
  negative: "sentiment_dissatisfied",
};

const sentimentColors: Record<string, string> = {
  positive: "text-tertiary",
  neutral: "text-on-surface-variant",
  negative: "text-error",
};

export default function LiveCallMonitorPage() {
  const { workspaceId } = useWorkspace();
  const { data: conversations, isLoading } = useConversations(workspaceId, { limit: 20 });
  const [elapsed, setElapsed] = useState<Record<string, number>>({});

  // Live calls = conversations with status in_progress or ringing
  const convList = conversations ?? [];
  const liveCalls = convList.filter((c: any) => c.status === "in_progress" || c.status === "ringing");
  const recentEnded = convList.filter((c: any) => c.status !== "in_progress" && c.status !== "ringing").slice(0, 5);

  useEffect(() => {
    const initial: Record<string, number> = {};
    liveCalls.forEach((call: any) => {
      initial[call.id] = Math.floor((Date.now() - new Date(call.startedAt || call.createdAt).getTime()) / 1000);
    });
    setElapsed(initial);

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => (next[k]! += 1));
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const activeCount = liveCalls.filter((c) => c.status === "in_progress").length;
  const ringingCount = liveCalls.filter((c) => c.status === "ringing").length;

  return (
    <section className="mx-auto max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
            Appels en direct
          </h1>
          <p className="mt-2 text-on-surface-variant">Suivi en temps réel de tous les appels actifs</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-tertiary/20 bg-tertiary/5 px-4 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary" />
            </span>
            <span className="text-sm font-bold text-tertiary">{activeCount} en cours</span>
          </div>
          {ringingCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
              <span className="material-symbols-outlined text-sm text-primary">ring_volume</span>
              <span className="text-sm font-bold text-primary">{ringingCount} en attente</span>
            </div>
          )}
        </div>
      </div>

      {/* Active calls */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {liveCalls.map((call) => (
          <div key={call.id} className="relative overflow-hidden rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
            {/* Live pulse */}
            {call.status === "in_progress" && (
              <div className="absolute right-4 top-4">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-tertiary" />
                </span>
              </div>
            )}
            {call.status === "ringing" && (
              <div className="absolute right-4 top-4">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                </span>
              </div>
            )}

            {/* Agent */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">{call.agentName || call.agentId?.slice(0, 8) || "Agent"}</p>
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                  {call.direction === "inbound" ? "Entrant" : "Sortant"}
                </p>
              </div>
            </div>

            {/* Caller */}
            <div className="mb-4 flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">call</span>
              <span className="text-sm">{call.callerNumber}</span>
            </div>

            {/* Timer + Sentiment */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-on-surface-variant">timer</span>
                <span className="font-mono text-2xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
                  {formatTime(elapsed[call.id] ?? 0)}
                </span>
              </div>
              <span className={`material-symbols-outlined text-2xl ${sentimentColors[call.sentiment]}`}>
                {sentimentIcons[call.sentiment]}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs font-bold text-on-surface-variant transition-all hover:border-primary/30 hover:text-primary">
                <span className="material-symbols-outlined text-sm">headphones</span>
                Écouter
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-error/20 py-2 text-xs font-bold text-error/70 transition-all hover:border-error hover:text-error">
                <span className="material-symbols-outlined text-sm">call_end</span>
                Raccrocher
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent ended calls */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
          Derniers appels terminés
        </h2>
        <div className="overflow-x-auto overflow-hidden rounded-2xl border border-white/5 bg-card">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6">Agent</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6">Appelant</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6">Durée</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6">Statut</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6">Terminé</th>
              </tr>
            </thead>
            <tbody>
              {recentEnded.map((call) => (
                <tr key={call.id} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 text-sm text-on-surface">{call.agentName || call.agentId?.slice(0, 8) || "Agent"}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 text-sm text-on-surface-variant">{call.callerNumber || "—"}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 font-mono text-sm text-on-surface">{call.duration || (call.durationSeconds ? `${Math.floor(call.durationSeconds / 60)}:${String(call.durationSeconds % 60).padStart(2, "0")}` : "—")}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      call.status === "success" ? "bg-tertiary/10 text-tertiary" :
                      call.status === "missed" ? "bg-white/5 text-on-surface-variant" :
                      "bg-secondary/10 text-secondary"
                    }`}>
                      {call.status === "success" ? "Succès" : call.status === "missed" ? "Manqué" : "Messagerie"}
                    </span>
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 text-sm text-on-surface-variant">{call.endedAt ? new Date(call.endedAt).toLocaleString("fr-FR") : call.createdAt ? new Date(call.createdAt).toLocaleString("fr-FR") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
