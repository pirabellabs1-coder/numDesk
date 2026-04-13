"use client";

import { useAdminQuality } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function AdminQualityPage() {
  const { data: scores, isLoading } = useAdminQuality();
  if (isLoading) return <PageSkeleton />;
  const list = scores ?? [];
  const avg = list.length > 0 ? Math.round(list.reduce((a: number, s: any) => a + s.score, 0) / list.length) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Qualité des agents</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Score moyen : {avg}/100</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead><tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <th className="px-6 py-3">Agent</th><th className="px-6 py-3">Score</th><th className="px-6 py-3">Complétion</th><th className="px-6 py-3">Sentiment +</th><th className="px-6 py-3">Tendance</th>
          </tr></thead>
          <tbody>{list.map((a: any) => (
            <tr key={a.agentId} className="border-b border-white/5 last:border-0">
              <td className="px-6 py-3 text-sm font-bold text-on-surface">{a.name}</td>
              <td className="px-6 py-3"><span className={`text-lg font-bold ${a.score >= 90 ? "text-tertiary" : a.score >= 80 ? "text-primary" : "text-orange-400"}`}>{a.score}</span></td>
              <td className="px-6 py-3 text-sm text-on-surface">{a.completionRate}%</td>
              <td className="px-6 py-3 text-sm text-on-surface">{a.sentimentPositive}%</td>
              <td className="px-6 py-3"><span className={`flex items-center gap-1 text-xs font-bold ${a.trend > 0 ? "text-tertiary" : "text-error"}`}><span className="material-symbols-outlined text-xs">{a.trend > 0 ? "trending_up" : "trending_down"}</span>{a.trend > 0 ? "+" : ""}{a.trend}</span></td>
            </tr>
          ))}</tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
