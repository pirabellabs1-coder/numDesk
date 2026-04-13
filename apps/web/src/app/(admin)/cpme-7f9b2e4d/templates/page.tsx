"use client";

import { useTemplates } from "@/hooks/use-templates";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function AdminTemplatesPage() {
  const { data: templates, isLoading } = useTemplates();
  if (isLoading) return <PageSkeleton />;
  const list = templates ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Gestion des templates</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{list.length} templates disponibles</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add</span>Nouveau template
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
        <table className="w-full">
          <thead><tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <th className="px-6 py-3">Nom</th><th className="px-6 py-3">Catégorie</th><th className="px-6 py-3">Voix</th><th className="px-6 py-3">LLM</th>
          </tr></thead>
          <tbody>{list.map((t: any) => (
            <tr key={t.id} className="border-b border-white/5 last:border-0">
              <td className="px-6 py-3"><div className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">{t.icon}</span><span className="text-sm font-bold text-on-surface">{t.name}</span></div></td>
              <td className="px-6 py-3"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{t.category}</span></td>
              <td className="px-6 py-3 text-sm text-on-surface-variant">{t.voice}</td>
              <td className="px-6 py-3 text-sm text-on-surface-variant">{t.llm}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
