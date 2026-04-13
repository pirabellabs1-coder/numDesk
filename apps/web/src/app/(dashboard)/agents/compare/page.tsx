"use client";

import { useState } from "react";
import Link from "next/link";
import { useAgents } from "@/hooks/use-agents";
import { useQuality } from "@/hooks/use-quality";
import { useWorkspace } from "@/providers/workspace-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const metricLabels = [
  { key: "totalCalls", label: "Total appels", suffix: "" },
  { key: "completionRate", label: "Taux de complétion", suffix: "%" },
  { key: "sentimentPositive", label: "Sentiment positif", suffix: "%" },
  { key: "responseTime", label: "Temps de réponse", suffix: "s" },
  { key: "score", label: "Score qualité", suffix: "/100" },
];

export default function AgentComparePage() {
  const { workspaceId } = useWorkspace();
  const { data: agents, isLoading: loadingAgents } = useAgents(workspaceId);
  const { data: quality, isLoading: loadingQuality } = useQuality(workspaceId);

  const [agentA, setAgentA] = useState<string>("");
  const [agentB, setAgentB] = useState<string>("");

  if (loadingAgents || loadingQuality) return <PageSkeleton />;

  const agentList = agents ?? [];
  const qualityScores = quality ?? [];

  if (agentList.length < 2) {
    return (
      <section className="mx-auto max-w-5xl">
        <EmptyState icon="compare_arrows" title="Pas assez d'agents" description="Créez au moins 2 agents pour les comparer." actionLabel="Créer un agent" actionHref="/agents" />
      </section>
    );
  }

  // Auto-select first two agents
  if (!agentA && agentList.length > 0) setAgentA(agentList[0]!.id);
  if (!agentB && agentList.length > 1) setAgentB(agentList[1]!.id);

  const getMetrics = (agentId: string) => {
    const agent = agentList.find((a: any) => a.id === agentId);
    const score = qualityScores.find((s: any) => s.agentId === agentId);
    return {
      totalCalls: agent?.totalCalls ?? 0,
      completionRate: score?.completionRate ?? 0,
      sentimentPositive: score?.sentimentPositive ?? 0,
      responseTime: score?.responseTime ?? 0,
      score: score?.score ?? 0,
    };
  };

  const metricsA = getMetrics(agentA);
  const metricsB = getMetrics(agentB);
  const nameA = agentList.find((a: any) => a.id === agentA)?.name ?? "Agent A";
  const nameB = agentList.find((a: any) => a.id === agentB)?.name ?? "Agent B";

  const getWinner = (a: number, b: number) => a > b ? "a" : b > a ? "b" : "tie";

  let winsA = 0, winsB = 0;
  metricLabels.forEach(({ key }) => {
    const w = getWinner((metricsA as any)[key] ?? 0, (metricsB as any)[key] ?? 0);
    if (w === "a") winsA++;
    if (w === "b") winsB++;
  });

  return (
    <section className="mx-auto max-w-5xl space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/agents" className="text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Comparer les agents</h1>
          <p className="mt-1 text-on-surface-variant">Performances côte à côte basées sur les données réelles</p>
        </div>
      </div>

      {/* Agent selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Agent A</label>
          <select value={agentA} onChange={(e) => setAgentA(e.target.value)} className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
            {agentList.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          {winsA > winsB && <span className="inline-flex items-center gap-1 rounded-full bg-tertiary/10 px-2.5 py-1 text-[10px] font-bold text-tertiary"><span className="material-symbols-outlined text-xs">emoji_events</span>Meilleur</span>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Agent B</label>
          <select value={agentB} onChange={(e) => setAgentB(e.target.value)} className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
            {agentList.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          {winsB > winsA && <span className="inline-flex items-center gap-1 rounded-full bg-tertiary/10 px-2.5 py-1 text-[10px] font-bold text-tertiary"><span className="material-symbols-outlined text-xs">emoji_events</span>Meilleur</span>}
        </div>
      </div>

      {/* Comparison */}
      <div className="space-y-4">
        {metricLabels.map(({ key, label, suffix }) => {
          const valA = (metricsA as any)[key] ?? 0;
          const valB = (metricsB as any)[key] ?? 0;
          const max = Math.max(valA, valB) || 1;
          const winner = getWinner(valA, valB);

          return (
            <div key={key} className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
              <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</p>
              <div className="flex items-center gap-3 sm:gap-6">
                <div className="w-14 sm:w-20 text-right">
                  <span className={`text-2xl font-bold ${winner === "a" ? "text-tertiary" : "text-on-surface"}`} style={{ fontFamily: "Inter, sans-serif" }}>{valA}{suffix}</span>
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex h-3 justify-end overflow-hidden rounded-full bg-white/5">
                    <div className={`h-full rounded-full transition-all ${winner === "a" ? "bg-tertiary" : "bg-primary/40"}`} style={{ width: `${(valA / max) * 100}%` }} />
                  </div>
                  <div className="flex h-3 overflow-hidden rounded-full bg-white/5">
                    <div className={`h-full rounded-full transition-all ${winner === "b" ? "bg-tertiary" : "bg-secondary/40"}`} style={{ width: `${(valB / max) * 100}%` }} />
                  </div>
                </div>
                <div className="w-14 sm:w-20">
                  <span className={`text-2xl font-bold ${winner === "b" ? "text-tertiary" : "text-on-surface"}`} style={{ fontFamily: "Inter, sans-serif" }}>{valB}{suffix}</span>
                </div>
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-on-surface-variant">
                <span>{nameA}</span>
                <span>{nameB}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
