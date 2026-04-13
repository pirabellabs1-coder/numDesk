"use client";

import { useAdminTags } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function AdminTagsPage() {
  const { data: tags, isLoading } = useAdminTags();
  if (isLoading) return <PageSkeleton />;
  const list = tags ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Gestion des tags</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{list.length} tags</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
        <table className="w-full">
          <thead><tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <th className="px-6 py-3">Tag</th><th className="px-6 py-3">Aperçu</th><th className="px-6 py-3">Conversations</th>
          </tr></thead>
          <tbody>{list.map((t: any) => (
            <tr key={t.id} className="border-b border-white/5 last:border-0">
              <td className="px-6 py-3"><div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} /><span className="text-sm font-bold text-on-surface">{t.name}</span></div></td>
              <td className="px-6 py-3"><span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundColor: `${t.color}15`, color: t.color }}>{t.name}</span></td>
              <td className="px-6 py-3 text-sm text-on-surface">{t.conversationCount ?? 0}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
