"use client";

import { useAdminKeywords } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function AdminKeywordsPage() {
  const { data: keywords, isLoading } = useAdminKeywords();
  if (isLoading) return <PageSkeleton />;
  const list = keywords ?? [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Mots-clés plateforme</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{list.length} mots-clés suivis</p>
      </div>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-card p-8 text-center">
          <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant/30">text_fields</span>
          <p className="text-on-surface-variant">Les mots-clés seront extraits automatiquement des conversations.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead><tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <th className="px-6 py-3">#</th><th className="px-6 py-3">Mot-clé</th><th className="px-6 py-3">Mentions</th>
            </tr></thead>
            <tbody>{list.map((k: any, i: number) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                <td className="px-6 py-3 text-sm text-on-surface-variant">{i + 1}</td>
                <td className="px-6 py-3 text-sm font-bold text-on-surface">{k.word}</td>
                <td className="px-6 py-3 text-sm text-on-surface">{k.count}</td>
              </tr>
            ))}</tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
