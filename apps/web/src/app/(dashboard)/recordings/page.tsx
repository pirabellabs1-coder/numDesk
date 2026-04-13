"use client";

import { useState, useRef } from "react";
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
  const [filterAgent, setFilterAgent] = useState<string | null>(null);
  const [filterSentiment, setFilterSentiment] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (isLoading) return <PageSkeleton />;
  const recordings = recordingsData ?? [];

  const agents = [...new Set(recordings.map((r: any) => r.agentName).filter(Boolean))];
  const totalDuration = recordings.reduce((acc: number, r: any) => acc + (r.durationSeconds || 0), 0);
  const avgDuration = recordings.length > 0 ? Math.round(totalDuration / recordings.length) : 0;

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}min`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const filtered = recordings.filter((r: any) => {
    const matchAgent = !filterAgent || r.agentName === filterAgent;
    const matchSentiment = !filterSentiment || r.sentiment === filterSentiment;
    return matchAgent && matchSentiment;
  });

  const handlePlay = (rec: any) => {
    if (playingId === rec.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (!rec.audioUrl) {
      toast("Enregistrement audio non disponible", "info");
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(rec.audioUrl);
    audio.play().catch(() => toast("Impossible de lire l'audio", "error"));
    audio.onended = () => setPlayingId(null);
    audioRef.current = audio;
    setPlayingId(rec.id);
  };

  return (
    <section className="mx-auto max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
          Enregistrements
        </h1>
        <p className="mt-2 text-on-surface-variant">Bibliothèque audio de vos appels enregistrés</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <div className="mb-2 text-primary">
            <span className="material-symbols-outlined">graphic_eq</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total enregistrements</p>
          <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{recordings.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <div className="mb-2 text-secondary">
            <span className="material-symbols-outlined">timer</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Durée totale</p>
          <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{formatDuration(totalDuration)}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <div className="mb-2 text-tertiary">
            <span className="material-symbols-outlined">avg_pace</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Durée moyenne</p>
          <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{formatDuration(avgDuration)}</p>
        </div>
      </div>

      {recordings.length === 0 ? (
        <EmptyState
          icon="graphic_eq"
          title="Aucun enregistrement"
          description="Les enregistrements apparaîtront ici quand vos agents auront passé des appels avec l'option d'enregistrement activée."
        />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <select
              value={filterAgent ?? ""}
              onChange={(e) => setFilterAgent(e.target.value || null)}
              className="rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Tous les agents</option>
              {agents.map((a: any) => (
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
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-on-surface-variant">Aucun enregistrement ne correspond aux filtres sélectionnés</p>
            ) : (
              filtered.map((rec: any) => (
                <div key={rec.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-white/5 bg-card p-4 sm:p-5 transition-all hover:border-white/10">
                  {/* Play button */}
                  <button
                    onClick={() => handlePlay(rec)}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${
                      rec.audioUrl ? "bg-primary/10 text-primary hover:bg-primary/20" : "bg-white/5 text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {playingId === rec.id ? "pause" : "play_arrow"}
                    </span>
                  </button>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-on-surface">{rec.agentName}</p>
                      <span className="text-xs text-on-surface-variant">{rec.direction === "outbound" ? "→" : "←"}</span>
                      <p className="text-sm text-on-surface-variant">{rec.callerNumber}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono text-xs text-on-surface-variant">{rec.duration}</span>
                      {!rec.audioUrl && <span className="text-[9px] text-on-surface-variant/50">(audio non disponible)</span>}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2">
                    {(rec.tags || []).map((tag: string) => (
                      <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-on-surface-variant">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Sentiment */}
                  <span className={`material-symbols-outlined ${sentimentColors[rec.sentiment] || "text-on-surface-variant"}`}>
                    {sentimentIcons[rec.sentiment] || "sentiment_neutral"}
                  </span>

                  {/* Date */}
                  <span className="shrink-0 text-xs text-on-surface-variant">
                    {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString("fr-FR") : "—"}
                  </span>

                  {/* Download */}
                  <button
                    onClick={() => {
                      if (rec.audioUrl) window.open(rec.audioUrl, "_blank");
                      else toast("Audio non disponible", "info");
                    }}
                    className="shrink-0 text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}
