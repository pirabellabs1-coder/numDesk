"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { useTemplates } from "@/hooks/use-templates";
import { useCreateAgent } from "@/hooks/use-agents";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";

const categoryColors: Record<string, string> = {
  Support: "bg-tertiary/10 text-tertiary",
  Sales: "bg-primary/10 text-primary",
  Admin: "bg-secondary/10 text-secondary",
};

export default function TemplatesPage() {
  const { workspaceId } = useWorkspace();
  const { data: templatesData } = useTemplates();
  const createAgent = useCreateAgent();
  const { toast } = useToast();
  const router = useRouter();

  const [filter, setFilter] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  if (!templatesData) return <PageSkeleton />;
  const templates = templatesData ?? [];
  const categories = [...new Set(templates.map((t: any) => t.category))];
  const filtered = filter ? templates.filter((t: any) => t.category === filter) : templates;

  const handleUseTemplate = async (tpl: any) => {
    if (!workspaceId) { toast("Sélectionnez un workspace d'abord", "error"); return; }
    try {
      const created = await createAgent.mutateAsync({
        workspaceId,
        name: tpl.name,
        prompt: tpl.prompt,
        voiceId: tpl.voice,
        llmModel: tpl.llm === "GPT-4o" ? "gpt-4o" : "gemini-2.5-flash",
      });
      toast(`Agent "${tpl.name}" créé depuis le template`);
      setSelectedTemplate(null);
      router.push(`/agents/${created.id}`);
    } catch (e: any) {
      toast(e.message || "Erreur lors de la création", "error");
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
          Templates d&apos;agents
        </h1>
        <p className="mt-2 text-on-surface-variant">
          Démarrez rapidement avec des agents pré-configurés pour vos cas d&apos;usage
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`rounded-lg px-3 py-2 text-xs sm:px-4 sm:text-sm font-bold transition-all ${
            !filter ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Tous ({templates.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(filter === cat ? null : cat)}
            className={`rounded-lg px-3 py-2 text-xs sm:px-4 sm:text-sm font-bold transition-all ${
              filter === cat ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {cat} ({templates.filter((t: any) => t.category === cat).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            className="group flex flex-col rounded-2xl border border-white/5 bg-card p-4 sm:p-6 transition-all hover:border-primary/20"
          >
            {/* Icon + Category */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <span className="material-symbols-outlined text-2xl text-primary">{tpl.icon}</span>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${categoryColors[tpl.category]}`}>
                {tpl.category}
              </span>
            </div>

            {/* Name + Description */}
            <h3 className="mb-2 text-lg font-bold text-on-surface">{tpl.name}</h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-on-surface-variant">{tpl.description}</p>

            {/* Meta */}
            <div className="mb-5 flex items-center gap-4 text-[11px] text-on-surface-variant">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">record_voice_over</span>
                {tpl.voice}
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">psychology</span>
                {tpl.llm}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTemplate(tpl)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-xs font-bold text-on-surface-variant transition-all hover:border-white/20 hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                Aperçu
              </button>
              <button
                onClick={() => handleUseTemplate(tpl)}
                disabled={createAgent.isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary py-2.5 text-xs font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                {createAgent.isPending ? "..." : "Utiliser"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-surface p-4 sm:p-6 md:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                  <span className="material-symbols-outlined text-3xl text-primary">{selectedTemplate.icon}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
                    {selectedTemplate.name}
                  </h2>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryColors[selectedTemplate.category]}`}>
                    {selectedTemplate.category}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="mb-6 text-sm text-on-surface-variant">{selectedTemplate.description}</p>

            <div className="mb-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Prompt système</p>
              <div className="rounded-lg bg-surface-container-lowest p-4 text-sm leading-relaxed text-on-surface">
                {selectedTemplate.prompt}
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-white/5 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Voix</p>
                <p className="mt-1 text-sm font-bold text-on-surface">{selectedTemplate.voice}</p>
              </div>
              <div className="rounded-lg border border-white/5 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Modèle LLM</p>
                <p className="mt-1 text-sm font-bold text-on-surface">{selectedTemplate.llm}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setSelectedTemplate(null)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">
                Fermer
              </button>
              <button
                onClick={() => handleUseTemplate(selectedTemplate)}
                disabled={createAgent.isPending}
                className="rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white disabled:opacity-50"
              >
                {createAgent.isPending ? "Création..." : "Créer un agent avec ce template"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
