"use client";

import { useQuality } from "@/hooks/use-quality";
import { useWorkspace } from "@/providers/workspace-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const getScoreColor = (score: number) => {
  if (score >= 90) return { text: "text-tertiary", bg: "bg-tertiary", ring: "ring-tertiary" };
  if (score >= 80) return { text: "text-primary", bg: "bg-primary", ring: "ring-primary" };
  if (score >= 70) return { text: "text-orange-400", bg: "bg-orange-400", ring: "ring-orange-400" };
  return { text: "text-error", bg: "bg-error", ring: "ring-error" };
};

function getRecommendations(agent: any): Array<{ icon: string; text: string; priority: "high" | "medium" | "low" }> {
  const recs: Array<{ icon: string; text: string; priority: "high" | "medium" | "low" }> = [];

  if (agent.completionRate < 80) {
    recs.push({ icon: "call_end", text: "Trop d'appels interrompus — vérifiez que le prompt gère bien les objections et les silences", priority: "high" });
  }
  if (agent.sentimentPositive < 65) {
    recs.push({ icon: "sentiment_dissatisfied", text: "Sentiment négatif fréquent — reformulez le ton du prompt pour être plus empathique et rassurant", priority: "high" });
  }
  if (agent.responseTime > 2.0) {
    recs.push({ icon: "speed", text: "Temps de réponse élevé — envisagez un modèle LLM plus rapide (Gemini Flash) ou réduisez la longueur du prompt", priority: "high" });
  }
  if (agent.avgDuration < 30) {
    recs.push({ icon: "timer", text: "Appels très courts — l'agent raccroche peut-être trop vite. Augmentez le timeout de silence et ajoutez des relances", priority: "medium" });
  }
  if (agent.avgDuration > 300) {
    recs.push({ icon: "hourglass_top", text: "Appels trop longs — ajoutez des instructions de synthèse pour que l'agent conclue plus rapidement", priority: "medium" });
  }
  if (agent.completionRate >= 80 && agent.completionRate < 90) {
    recs.push({ icon: "trending_up", text: "Bon taux de complétion — pour atteindre 90%+, ajoutez des phrases de relance après silence", priority: "low" });
  }
  if (agent.sentimentPositive >= 65 && agent.sentimentPositive < 80) {
    recs.push({ icon: "mood", text: "Sentiment correct — activez les hésitations naturelles (euh, alors...) pour un ton plus humain", priority: "low" });
  }
  if (agent.responseTime >= 1.5 && agent.responseTime <= 2.0) {
    recs.push({ icon: "bolt", text: "Temps de réponse acceptable — réduisez la température du LLM pour des réponses plus directes", priority: "low" });
  }

  if (recs.length === 0) {
    recs.push({ icon: "verified", text: "Excellent ! Cet agent performe très bien. Continuez à monitorer les métriques.", priority: "low" });
  }

  return recs;
}

const priorityColors = {
  high: "border-error/20 bg-error/5",
  medium: "border-orange-400/20 bg-orange-400/5",
  low: "border-white/5 bg-white/[0.02]",
};

const priorityIconColors = {
  high: "text-error",
  medium: "text-orange-400",
  low: "text-on-surface-variant",
};

export default function QualityPage() {
  const { workspaceId } = useWorkspace();
  const { data: scores, isLoading } = useQuality(workspaceId);

  if (isLoading) return <PageSkeleton />;
  const agentScores = scores ?? [];
  if (agentScores.length === 0) return <section className="mx-auto max-w-6xl"><EmptyState icon="speed" title="Aucun score de qualité" description="Les scores apparaîtront quand vos agents auront traité des appels." /></section>;

  const avgScore = Math.round(agentScores.reduce((a: number, s: any) => a + s.score, 0) / agentScores.length);

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
          Score de qualité
        </h1>
        <p className="mt-2 text-on-surface-variant">Évaluation automatique et recommandations d&apos;amélioration</p>
      </div>

      {/* Global score */}
      <div className="flex items-center gap-8 rounded-2xl border border-white/5 bg-card p-6">
        <div className="relative h-28 w-28 shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#1F1F24" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke={avgScore >= 85 ? "#00D4AA" : "#4F7FFF"} strokeWidth="8" strokeDasharray={`${264 * avgScore / 100} 264`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{avgScore}</p>
              <p className="text-[9px] text-on-surface-variant">/100</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Score moyen plateforme</p>
          <p className="mt-1 text-2xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
            {avgScore >= 85 ? "Excellent" : avgScore >= 75 ? "Bon" : "À améliorer"}
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">Basé sur {agentScores.length} agent(s) actif(s)</p>
        </div>
      </div>

      {/* Agent scores + recommendations */}
      <div className="space-y-6">
        {agentScores.map((agent: any) => {
          const sc = getScoreColor(agent.score);
          const recs = getRecommendations(agent);
          return (
            <div key={agent.agentId} className="rounded-2xl border border-white/5 bg-card p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold text-on-surface">{agent.name}</p>
                  <div className={`mt-1 flex items-center gap-1 text-xs font-bold ${agent.trend > 0 ? "text-tertiary" : "text-error"}`}>
                    <span className="material-symbols-outlined text-xs">{agent.trend > 0 ? "trending_up" : "trending_down"}</span>
                    {agent.trend > 0 ? "+" : ""}{agent.trend} pts cette semaine
                  </div>
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${sc.bg}/10`}>
                  <span className={`text-2xl font-bold ${sc.text}`} style={{ fontFamily: "Inter, sans-serif" }}>{agent.score}</span>
                </div>
              </div>

              {/* Mini sparkline */}
              <div className="mb-4 flex h-10 items-end gap-1">
                {(agent.history || []).map((v: number, i: number) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm ${sc.bg} transition-all ${i === (agent.history || []).length - 1 ? "opacity-100" : "opacity-30"}`}
                    style={{ height: `${Math.max(5, ((v - 60) / 40) * 100)}%` }}
                  />
                ))}
              </div>

              {/* Metrics */}
              <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { label: "Complétion", value: `${agent.completionRate}%` },
                  { label: "Sentiment +", value: `${agent.sentimentPositive}%` },
                  { label: "Durée moy.", value: `${Math.floor(agent.avgDuration / 60)}:${(agent.avgDuration % 60).toString().padStart(2, "0")}` },
                  { label: "Temps rép.", value: `${agent.responseTime}s` },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-surface-container-lowest px-3 py-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">{m.label}</p>
                    <p className="text-sm font-bold text-on-surface">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  <span className="material-symbols-outlined mr-1 align-middle text-xs">lightbulb</span>
                  Recommandations
                </p>
                {recs.map((rec, i) => (
                  <div key={i} className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${priorityColors[rec.priority]}`}>
                    <span className={`material-symbols-outlined mt-0.5 text-base ${priorityIconColors[rec.priority]}`}>{rec.icon}</span>
                    <p className="text-sm text-on-surface">{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
