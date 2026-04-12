"use client";

import { useState } from "react";
import { useKnowledgeBases, useCreateKnowledgeBase, useDeleteKnowledgeBase } from "@/hooks/use-knowledge-bases";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function KnowledgePage() {
  const { workspaceId } = useWorkspace();
  const { data: kbs, isLoading, error, refetch } = useKnowledgeBases(workspaceId);
  const createKB = useCreateKnowledgeBase();
  const deleteKB = useDeleteKnowledgeBase();
  const { toast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [newKB, setNewKB] = useState({ name: "", mode: "full_context" as string });

  const handleCreate = async () => {
    if (!newKB.name.trim() || !workspaceId) return;
    try {
      await createKB.mutateAsync({ workspaceId, name: newKB.name, mode: newKB.mode });
      toast("Base de connaissances créée");
      setShowModal(false);
      setNewKB({ name: "", mode: "full_context" });
    } catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteKB.mutateAsync(id); toast("Base supprimée"); }
    catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les bases" onRetry={() => refetch()} />;
  const kbList = kbs ?? [];

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Base de connaissances</h1>
          <p className="mt-2 text-on-surface-variant">{kbList.length} base(s) configurée(s)</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add</span>Nouvelle base
        </button>
      </div>

      {kbList.length === 0 ? (
        <EmptyState icon="menu_book" title="Aucune base de connaissances" description="Créez une base pour enrichir vos agents." actionLabel="Nouvelle base" onAction={() => setShowModal(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {kbList.map((kb: any) => (
            <div key={kb.id} className="rounded-2xl border border-white/5 bg-card p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <span className="material-symbols-outlined text-primary">menu_book</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">{kb.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${kb.mode === "full_context" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                      {kb.mode === "full_context" ? "Full Context" : "RAG"}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(kb.id)} className="text-on-surface-variant hover:text-error">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
              <p className="text-xs text-on-surface-variant">{(kb.files || []).length} fichier(s)</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-8">
            <h2 className="mb-6 text-xl font-bold text-on-surface">Nouvelle base</h2>
            <div className="space-y-4">
              <input value={newKB.name} onChange={(e) => setNewKB({ ...newKB, name: e.target.value })} placeholder="Nom de la base" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              <div className="flex gap-3">
                {[{ id: "full_context", label: "Full Context" }, { id: "rag", label: "RAG" }].map((m) => (
                  <button key={m.id} onClick={() => setNewKB({ ...newKB, mode: m.id })} className={`flex-1 rounded-lg border p-3 text-center text-sm font-bold transition-all ${newKB.mode === m.id ? "border-primary bg-primary/5 text-primary" : "border-white/5 text-on-surface-variant"}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant">Annuler</button>
              <button onClick={handleCreate} disabled={createKB.isPending || !newKB.name.trim()} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {createKB.isPending ? "..." : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
