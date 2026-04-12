"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";

const statusConfig: Record<string, { label: string; style: string }> = {
  live: { label: "LIVE", style: "bg-tertiary/10 text-tertiary" },
  archived: { label: "Archivée", style: "bg-white/5 text-on-surface-variant" },
};

export function TabVersions({ agentId }: { agentId?: string } = {}) {
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  // Versions will be loaded when agent versions API is called
  const versions: any[] = [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
          Historique des versions
        </h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Suivez les modifications apportées à cet agent au fil du temps
        </p>
      </div>

      {/* Timeline */}
      {versions.length === 0 ? (
        <EmptyState icon="history" title="Aucune version" description="L'historique des versions apparaîtra quand vous publierez l'agent." />
      ) : (
      <div className="relative space-y-0">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />

        {versions.map((version, i) => {
          const status = statusConfig[version.status]!;
          const isLive = version.status === "live";

          return (
            <div key={version.id} className="relative flex gap-5 py-4">
              {/* Timeline dot */}
              <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isLive ? "bg-tertiary/10" : "bg-surface-container-high"
              }`}>
                {isLive ? (
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-tertiary" />
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">history</span>
                )}
              </div>

              {/* Content */}
              <div className={`min-w-0 flex-1 rounded-xl border p-5 ${
                isLive ? "border-tertiary/20 bg-tertiary/[0.03]" : "border-white/5 bg-card"
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-on-surface">v{version.version}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${status.style}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-on-surface-variant">{version.changes}</p>
                  </div>
                  <div className="shrink-0 text-right text-[11px] text-on-surface-variant">
                    <p>{version.date}</p>
                    <p>{version.author}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelectedVersion(version)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-bold text-on-surface-variant transition-all hover:border-white/20 hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-xs">difference</span>
                    Voir le prompt
                  </button>
                  {!isLive && (
                    <button className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-bold text-on-surface-variant transition-all hover:border-primary/30 hover:text-primary">
                      <span className="material-symbols-outlined text-xs">restore</span>
                      Restaurer
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Prompt preview modal */}
      {selectedVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-surface p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
                Prompt — v{selectedVersion.version}
              </h2>
              <button onClick={() => setSelectedVersion(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="rounded-lg bg-surface-container-lowest p-6 text-sm leading-relaxed text-on-surface">
              {selectedVersion.promptPreview}
            </div>
            <div className="mt-4 flex items-center gap-3 text-[11px] text-on-surface-variant">
              <span>{selectedVersion.date}</span>
              <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
              <span>{selectedVersion.author}</span>
              <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
              <span>{selectedVersion.changes}</span>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedVersion(null)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
