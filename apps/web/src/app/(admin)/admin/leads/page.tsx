"use client";

import { useAdminLeads } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";

const stageLabels: Record<string, string> = { new: "Nouveau", contacted: "Contacté", qualified: "Qualifié", converted: "Converti" };

export default function AdminLeadsPage() {
  const { data: leads, isLoading } = useAdminLeads();
  if (isLoading) return <PageSkeleton />;
  const list = leads ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Pipeline global</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{list.length} leads</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {["new", "contacted", "qualified", "converted"].map((s) => (
          <div key={s} className="rounded-2xl border border-white/5 bg-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{stageLabels[s]}</p>
            <p className="mt-1 text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{list.filter((l: any) => l.stage === s).length}</p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
        <table className="w-full">
          <thead><tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <th className="px-6 py-3">Lead</th><th className="px-6 py-3">Entreprise</th><th className="px-6 py-3">Étape</th><th className="px-6 py-3">Valeur</th>
          </tr></thead>
          <tbody>{list.map((l: any) => (
            <tr key={l.id} className="border-b border-white/5 last:border-0">
              <td className="px-6 py-3 text-sm font-bold text-on-surface">{l.name}</td>
              <td className="px-6 py-3 text-sm text-on-surface-variant">{l.company}</td>
              <td className="px-6 py-3"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{stageLabels[l.stage] || l.stage}</span></td>
              <td className="px-6 py-3 text-sm font-bold text-tertiary">{l.value}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
