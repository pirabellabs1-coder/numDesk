"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSuggestions } from "@/hooks/use-suggestions";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const impactConfig: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: "Impact élevé", color: "text-tertiary", bg: "bg-tertiary/10" },
  medium: { label: "Impact moyen", color: "text-primary", bg: "bg-primary/10" },
  low: { label: "Impact faible", color: "text-on-surface-variant", bg: "bg-white/5" },
};

const typeConfig: Record<string, { icon: string; label: string }> = {
  prompt: { icon: "edit_note", label: "Prompt" },
  voice: { icon: "record_voice_over", label: "Voix" },
  tool: { icon: "build", label: "Configuration" },
};

export default function SuggestionsPage() {
  const { workspaceId } = useWorkspace();
  const { data: suggestionsData, isLoading, refetch } = useSuggestions(workspaceId);
  const { toast } = useToast();
  const router = useRouter();

  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  if (isLoading) return <PageSkeleton />;

  const allSuggestions = suggestionsData ?? [];
  const pendingCount = allSuggestions.filter((s: any) => !s.applied && !appliedIds.has(s.id)).length;

  const handleApply = (suggestion: any) => {
    setAppliedIds((prev) => new Set([...prev, suggestion.id]));
    toast("Suggestion appliquée — suivez l'action recommandée");

    // Navigate to the relevant page
    if (suggestion.agentId) {
      router.push(`/agents/${suggestion.agentId}`);
    }
  };

  const handleDismiss = (id: string) => {
    setAppliedIds((prev) => new Set([...prev, id]));
    toast("Suggestion ignorée", "info");
  };

  return (
    <section className="mx-auto max-w-5xl space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="material-symbols-outlined text-2xl text-secondary sm:text-3xl">auto_awesome</span>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
              Suggestions IA
            </h1>
          </div>
          <p className="mt-1 text-sm text-on-surface-variant sm:mt-2">
            {pendingCount > 0
              ? `${pendingCount} suggestion(s) pour améliorer vos agents`
              : "Vos agents sont bien configurés !"
            }
          </p>
        </div>
        <button onClick={() => refetch()} className="flex w-fit items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface sm:px-4 sm:py-2 sm:text-sm">
          <span className="material-symbols-outlined text-sm">refresh</span>
          Actualiser
        </button>
      </div>

      {/* Impact summary */}
      {allSuggestions.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {(["high", "medium", "low"] as const).map((impact) => {
            const cfg = impactConfig[impact]!;
            const count = allSuggestions.filter((s: any) => s.impact === impact && !s.applied && !appliedIds.has(s.id)).length;
            return (
              <div key={impact} className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{cfg.label}</p>
                <p className={`mt-1 text-3xl font-bold ${cfg.color}`} style={{ fontFamily: "Inter, sans-serif" }}>{count}</p>
              </div>
            );
          })}
        </div>
      )}

      {allSuggestions.length === 0 ? (
        <EmptyState
          icon="auto_awesome"
          title="Aucune suggestion pour le moment"
          description="Les suggestions IA apparaîtront automatiquement quand vous aurez des agents et des conversations. Créez un agent pour commencer."
          actionLabel="Créer un agent"
          actionHref="/agents"
        />
      ) : (
        <div className="space-y-4">
          {allSuggestions.map((sug: any) => {
            const isApplied = sug.applied || appliedIds.has(sug.id);
            const impact = impactConfig[sug.impact as string] ?? impactConfig["medium"]!;
            const type = typeConfig[sug.type as string] ?? typeConfig["tool"]!;

            return (
              <div key={sug.id} className={`rounded-2xl border p-4 transition-all sm:p-6 ${
                isApplied ? "border-white/5 bg-card opacity-40" : "border-secondary/10 bg-card hover:border-secondary/20"
              }`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                  {/* Icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/10 sm:h-11 sm:w-11">
                    <span className="material-symbols-outlined text-lg text-secondary sm:text-xl">{type.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                      <p className="text-sm font-bold text-on-surface">{sug.title}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${impact.bg} ${impact.color}`}>{impact.label}</span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-on-surface-variant">{type.label}</span>
                      {isApplied && <span className="rounded-full bg-tertiary/10 px-2 py-0.5 text-[10px] font-bold text-tertiary">Appliqué</span>}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-on-surface-variant sm:text-sm">{sug.description}</p>

                    {/* Action recommendation */}
                    {sug.action && !isApplied && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg border border-secondary/10 bg-secondary/[0.03] px-3 py-2 sm:px-4 sm:py-3">
                        <span className="material-symbols-outlined text-sm text-secondary">lightbulb</span>
                        <p className="text-xs text-on-surface">{sug.action}</p>
                      </div>
                    )}

                    {/* Agent name */}
                    {(sug.agentName || sug.agentId) && (
                      <p className="mt-2 text-xs text-on-surface-variant">
                        Agent : <strong className="text-on-surface">{sug.agentName || sug.agentId?.slice(0, 8)}</strong>
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {!isApplied && (
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => handleDismiss(sug.id)}
                        className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] text-on-surface-variant hover:text-on-surface sm:px-3 sm:py-2 sm:text-xs"
                      >
                        Ignorer
                      </button>
                      <button
                        onClick={() => handleApply(sug)}
                        className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-primary to-secondary px-2.5 py-1.5 text-[10px] font-bold text-white sm:gap-1.5 sm:px-4 sm:py-2 sm:text-xs"
                      >
                        <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                        Appliquer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* How it works */}
      <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary">psychology</span>
          <div>
            <p className="text-sm font-bold text-on-surface">Comment fonctionnent les suggestions IA ?</p>
            <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
              Callpme analyse automatiquement les performances de vos agents : taux de complétion, sentiment des conversations,
              durée moyenne, configuration du prompt et de la voix. Les suggestions sont générées en fonction des données réelles
              de votre workspace et mises à jour à chaque visite de cette page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
