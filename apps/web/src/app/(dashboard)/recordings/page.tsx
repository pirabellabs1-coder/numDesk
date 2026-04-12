"use client";

import { useState } from "react";
import { useRecordings } from "@/hooks/use-recordings";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const sentimentColors: Record<string, string> = {
  positive: "text-tertiary",
  neutral: "text-on-surface-variant",
  negative: "text-error",
};

const sentimentIcons: Record<string, string> = {
  positive: "sentiment_satisfied",
  neutral: "sentiment_neutral",
  negative: "sentiment_dissatisfied",
};

export default function RecordingsPage() {
  const { workspaceId } = useWorkspace();
  const { data: recordingsData, isLoading } = useRecordings(workspaceId);
  const { toast } = useToast();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [filterAgent, setFilterAgent] = useState<string | null>(null);
  const [filterSentiment, setFilterSentiment] = useState<string | null>(null);

  if (isLoading) return <PageSkeleton />;
  const recordings = recordingsData ?? [];

  const agents = [...new Set(recordings.map((r: any) => r.agentName).filter(Boolean))];
  const totalDuration = recordings.reduce((acc: number, r: any) => acc + (r.durationSeconds || 0), 0);
  const avgDuration = recordings.length > 0 ? Math.round(totalDuration / recordings.length) : 0;

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}min`;
    return `${m}min`;
  };

  const filtered = recordings.filter((r) => {
    const matchAgent = !filterAgent || r.agentName === filterAgent;
    const matchSentiment = !filterSentiment || r.sentiment === filterSentiment;
    return matchAgent && matchSentiment;
  });

  const handlePlay = (id: string, durationSeconds: number) => {
    if (playingId === id) {
      setPlayingId(null);
      return;
    }
    setPlayingId(id);
    setProgress((prev) => ({ ...prev, [id]: 0 }));
    const interval = setInterval(() => {
      setProgress((prev) => {
        const current = (prev[id] ?? 0) + 2;
        if (current >= 100) {
          clearInterval(interval);
          setPlayingId(null);
          return { ...prev, [id]: 100 };
        }
        return { ...prev, [id]: current };
      });
    }, durationSeconds * 10);
  };

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
          Enregistrements
        </h1>
        <p className="mt-2 text-on-surface-variant">Bibliothèque audio de tous vos appels enregistrés</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-2 text-primary">
            <span className="material-symbols-outlined">graphic_eq</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total enregistrements</p>
          <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{recordings.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-2 text-secondary">
            <span className="material-symbols-outlined">timer</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Durée totale</p>
          <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{formatDuration(totalDuration)}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-2 text-tertiary">
            <span className="material-symbols-outlined">avg_pace</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Durée moyenne</p>
          <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{formatDuration(avgDuration)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={filterAgent ?? ""}
          onChange={(e) => setFilterAgent(e.target.value || null)}
          className="rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Tous les agents</option>
          {agents.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {(["positive", "neutral", "negative"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterSentiment(filterSentiment === s ? null : s)}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                filterSentiment === s ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className={`material-symbols-outlined text-sm ${sentimentColors[s]}`}>{sentimentIcons[s]}</span>
              {s === "positive" ? "Positif" : s === "neutral" ? "Neutre" : "Négatif"}
            </button>
          ))}
        </div>
      </div>

      {/* Recordings list */}
      <div className="space-y-3">
        {filtered.map((rec) => (
          <div key={rec.id} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-card p-5 transition-all hover:border-white/10">
            {/* Play button */}
            <button
              onClick={() => handlePlay(rec.id, rec.durationSeconds)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all hover:bg-primary/20"
            >
              <span className="material-symbols-outlined text-2xl">
                {playingId === rec.id ? "pause" : "play_arrow"}
              </span>
            </button>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-on-surface">{rec.agentName}</p>
                <span className="text-xs text-on-surface-variant">→</span>
                <p className="text-sm text-on-surface-variant">{rec.callerNumber}</p>
              </div>

              {/* Waveform / Progress */}
              <div className="mt-2 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${progress[rec.id] ?? 0}%` }}
                  />
                </div>
                <span className="shrink-0 font-mono text-xs text-on-surface-variant">{rec.duration}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2">
              {rec.tags.map((tag: string) => (
                <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-on-surface-variant">
                  {tag}
                </span>
              ))}
            </div>

            {/* Sentiment */}
            <span className={`material-symbols-outlined ${sentimentColors[rec.sentiment]}`}>
              {sentimentIcons[rec.sentiment]}
            </span>

            {/* Date */}
            <span className="shrink-0 text-xs text-on-surface-variant">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString("fr-FR") : rec.date || "—"}</span>

            {/* Download */}
            <button onClick={() => { if (rec.audioUrl) { window.open(rec.audioUrl, "_blank"); } else { toast("Enregistrement audio non disponible", "info"); } }} className="shrink-0 text-on-surface-variant transition-colors hover:text-on-surface">
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
