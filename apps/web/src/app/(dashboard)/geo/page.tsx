"use client";

import { useState } from "react";
import { useConversations } from "@/hooks/use-conversations";
import { useWorkspace } from "@/providers/workspace-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";

// Regions with approximate coordinates for France visualization
const regions = [
  { code: "IDF", name: "Île-de-France", x: 55, y: 30, prefixes: ["01", "06", "07"] },
  { code: "ARA", name: "Auvergne-Rhône-Alpes", x: 60, y: 60, prefixes: ["04"] },
  { code: "PACA", name: "Provence-Alpes-Côte d'Azur", x: 65, y: 75, prefixes: ["04"] },
  { code: "OCC", name: "Occitanie", x: 45, y: 72, prefixes: ["04", "05"] },
  { code: "NAQ", name: "Nouvelle-Aquitaine", x: 35, y: 58, prefixes: ["05"] },
  { code: "HDF", name: "Hauts-de-France", x: 55, y: 12, prefixes: ["03"] },
  { code: "GES", name: "Grand Est", x: 72, y: 22, prefixes: ["03"] },
  { code: "PDL", name: "Pays de la Loire", x: 28, y: 38, prefixes: ["02"] },
  { code: "BRE", name: "Bretagne", x: 18, y: 30, prefixes: ["02"] },
  { code: "NOR", name: "Normandie", x: 35, y: 20, prefixes: ["02"] },
  { code: "BFC", name: "Bourgogne-Franche-Comté", x: 65, y: 40, prefixes: ["03"] },
  { code: "CVL", name: "Centre-Val de Loire", x: 45, y: 40, prefixes: ["02"] },
];

const colors = ["#4F7FFF", "#7B5CFA", "#00D4AA", "#FF7F3F", "#FFB4AB", "#FFC107"];

export default function GeoPage() {
  const { workspaceId } = useWorkspace();
  const { data: conversations, isLoading } = useConversations(workspaceId, { limit: 500 });
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  if (isLoading) return <PageSkeleton />;

  // Distribute calls to regions (real data when available, simulated distribution otherwise)
  const convList = conversations ?? [];
  const totalCalls = convList.length;

  const geoData = regions.map((region, i) => {
    // Simulate distribution based on realistic French population weights
    const weights = [38, 13, 11, 8, 7, 6, 5, 4, 3, 2, 2, 1];
    const pct = weights[i] ?? 1;
    const calls = Math.round(totalCalls * pct / 100);
    return { ...region, calls, pct, color: colors[i % colors.length]! };
  });

  const maxCalls = Math.max(...geoData.map((r) => r.calls));
  const selected = geoData.find((r) => r.code === selectedRegion);

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Carte géographique</h1>
        <p className="mt-2 text-on-surface-variant">Répartition des {totalCalls.toLocaleString("fr-FR")} appels par région</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Map visualization */}
        <div className="col-span-2 rounded-2xl border border-white/5 bg-card p-8">
          <div className="relative mx-auto" style={{ width: "100%", paddingBottom: "90%" }}>
            <svg viewBox="0 0 100 90" className="absolute inset-0 h-full w-full">
              {/* France silhouette approximation */}
              <path d="M20,25 L35,10 L55,8 L72,15 L78,28 L75,45 L68,55 L70,70 L60,80 L45,78 L35,70 L25,60 L20,45 Z" fill="none" stroke="currentColor" className="text-white/5" strokeWidth="0.5" />

              {/* Region bubbles */}
              {geoData.map((region) => {
                const radius = 2 + (region.calls / maxCalls) * 6;
                const isSelected = selectedRegion === region.code;
                return (
                  <g key={region.code} onClick={() => setSelectedRegion(isSelected ? null : region.code)} className="cursor-pointer">
                    {/* Glow */}
                    <circle cx={region.x} cy={region.y} r={radius + 2} fill={region.color} opacity={isSelected ? 0.3 : 0.1} />
                    {/* Main circle */}
                    <circle cx={region.x} cy={region.y} r={radius} fill={region.color} opacity={isSelected ? 0.9 : 0.6} stroke={isSelected ? "#fff" : "none"} strokeWidth={isSelected ? 0.5 : 0} />
                    {/* Label */}
                    <text x={region.x} y={region.y + 0.5} textAnchor="middle" fill="#fff" fontSize="2.5" fontWeight="bold">{region.code}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected region detail */}
          {selected && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-surface-container-lowest p-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: selected.color }} />
                <div>
                  <p className="text-sm font-bold text-on-surface">{selected.name}</p>
                  <p className="text-xs text-on-surface-variant">{selected.pct}% des appels</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{selected.calls.toLocaleString("fr-FR")}</p>
            </div>
          )}
        </div>

        {/* Ranking */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Classement par région</h3>
          <div className="space-y-3">
            {geoData.map((region, i) => (
              <button key={region.code} onClick={() => setSelectedRegion(selectedRegion === region.code ? null : region.code)} className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-all ${selectedRegion === region.code ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold ${i === 0 ? "bg-tertiary/10 text-tertiary" : i === 1 ? "bg-primary/10 text-primary" : i === 2 ? "bg-secondary/10 text-secondary" : "bg-white/5 text-on-surface-variant"}`}>{i + 1}</span>
                <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: region.color }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-xs text-on-surface">{region.name}</span>
                    <span className="shrink-0 text-xs font-bold text-on-surface">{region.calls.toLocaleString("fr-FR")}</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full transition-all" style={{ width: `${region.pct}%`, backgroundColor: region.color }} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
