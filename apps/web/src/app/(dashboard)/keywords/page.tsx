"use client";

import { useState } from "react";
import { useConversations } from "@/hooks/use-conversations";
import { useWorkspace } from "@/providers/workspace-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";

// Extract keywords from real conversation transcripts
function extractKeywords(conversations: any[]): { word: string; count: number; trend: number }[] {
  const wordMap = new Map<string, number>();
  const stopWords = new Set(["de", "le", "la", "les", "un", "une", "des", "et", "en", "du", "au", "aux", "je", "tu", "il", "elle", "nous", "vous", "ils", "elles", "ce", "est", "a", "ai", "ont", "son", "sa", "ses", "mon", "ma", "mes", "que", "qui", "ne", "pas", "pour", "par", "sur", "avec", "dans", "plus", "se", "si", "ou", "mais", "car", "oui", "non", "très", "bien", "aussi", "fait", "être", "avoir", "tout", "tous", "cette"]);

  for (const conv of conversations) {
    if (!conv.transcript) continue;
    const transcriptArr = Array.isArray(conv.transcript) ? conv.transcript : [];
    for (const msg of transcriptArr) {
      if (!msg.content) continue;
      const words = msg.content.toLowerCase().replace(/[^a-zàâäéèêëïîôùûüç\s-]/g, "").split(/\s+/);
      for (const word of words) {
        if (word.length < 4 || stopWords.has(word)) continue;
        wordMap.set(word, (wordMap.get(word) || 0) + 1);
      }
    }
  }

  return Array.from(wordMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([word, count]) => ({ word, count, trend: 0 }));
}

export default function KeywordsPage() {
  const { workspaceId } = useWorkspace();
  const { data: conversations, isLoading } = useConversations(workspaceId, { limit: 200 });
  const [view, setView] = useState<"cloud" | "table">("cloud");

  if (isLoading) return <PageSkeleton />;

  const keywords = extractKeywords(conversations ?? []);
  const maxCount = keywords.length > 0 ? Math.max(...keywords.map((k) => k.count)) : 1;
  const totalMentions = keywords.reduce((a, k) => a + k.count, 0);

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Mots-clés fréquents</h1>
          <p className="mt-2 text-on-surface-variant">{keywords.length} mots-clés extraits · {totalMentions} mentions</p>
        </div>
        <div className="flex rounded-lg border border-white/5">
          <button onClick={() => setView("cloud")} className={`px-4 py-2 text-xs font-bold ${view === "cloud" ? "bg-primary/10 text-primary" : "text-on-surface-variant"}`}>Nuage</button>
          <button onClick={() => setView("table")} className={`px-4 py-2 text-xs font-bold ${view === "table" ? "bg-primary/10 text-primary" : "text-on-surface-variant"}`}>Tableau</button>
        </div>
      </div>

      {keywords.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-card p-16 text-center">
          <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant/30">text_fields</span>
          <p className="text-on-surface-variant">Aucun mot-clé détecté.</p>
          <p className="mt-1 text-xs text-on-surface-variant/60">Les mots-clés sont extraits automatiquement des transcripts de vos conversations.</p>
        </div>
      ) : view === "cloud" ? (
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/5 bg-card p-10">
          {keywords.map((kw, i) => {
            const size = 0.75 + (kw.count / maxCount) * 1.5;
            const opacity = 0.5 + (kw.count / maxCount) * 0.5;
            const colors = ["text-primary", "text-secondary", "text-tertiary", "text-orange-400", "text-on-surface"];
            return (
              <span key={kw.word} className={`cursor-default font-bold transition-all hover:scale-110 hover:opacity-100 ${colors[i % colors.length]}`} style={{ fontSize: `${size}rem`, opacity }} title={`${kw.count} mentions`}>
                {kw.word}
              </span>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
          <table className="w-full">
            <thead><tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <th className="px-6 py-3">#</th><th className="px-6 py-3">Mot-clé</th><th className="px-6 py-3">Mentions</th><th className="px-6 py-3">Fréquence</th><th className="px-6 py-3">Tendance</th>
            </tr></thead>
            <tbody>{keywords.map((kw, i) => (
              <tr key={kw.word} className="border-b border-white/5 last:border-0">
                <td className="px-6 py-3 text-sm text-on-surface-variant">{i + 1}</td>
                <td className="px-6 py-3 text-sm font-bold text-on-surface">{kw.word}</td>
                <td className="px-6 py-3 text-sm text-on-surface">{kw.count}</td>
                <td className="px-6 py-3"><div className="flex items-center gap-2"><div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${(kw.count / maxCount) * 100}%` }} /></div></div></td>
                <td className="px-6 py-3"><span className={`flex items-center gap-1 text-xs font-bold ${kw.trend > 0 ? "text-tertiary" : kw.trend < 0 ? "text-error" : "text-on-surface-variant"}`}><span className="material-symbols-outlined text-xs">{kw.trend > 0 ? "trending_up" : kw.trend < 0 ? "trending_down" : "trending_flat"}</span>{kw.trend > 0 ? "+" : ""}{kw.trend}%</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
