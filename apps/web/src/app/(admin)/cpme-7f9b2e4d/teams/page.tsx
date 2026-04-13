"use client";

import { useAdminTeams } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function AdminTeamsPage() {
  const { data: teams, isLoading } = useAdminTeams();
  if (isLoading) return <PageSkeleton />;
  const teamList = teams ?? [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Gestion des équipes</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{teamList.length} équipes</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead><tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <th className="px-6 py-3">Équipe</th><th className="px-6 py-3">Membres</th><th className="px-6 py-3">Actions</th>
          </tr></thead>
          <tbody>{teamList.map((t: any) => (
            <tr key={t.id} className="border-b border-white/5 last:border-0">
              <td className="px-6 py-3"><div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} /><span className="text-sm font-bold text-on-surface">{t.name}</span></div></td>
              <td className="px-6 py-3 text-sm text-on-surface">{t.memberCount ?? 0}</td>
              <td className="px-6 py-3"><button className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined text-sm">edit</span></button></td>
            </tr>
          ))}</tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
