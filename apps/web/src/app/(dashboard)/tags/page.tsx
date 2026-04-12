"use client";

import { useState } from "react";
import { useTags, useCreateTag, useDeleteTag } from "@/hooks/use-tags";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";

const presetColors = [
  { name: "Bleu", hex: "#4F7FFF" },
  { name: "Violet", hex: "#7B5CFA" },
  { name: "Émeraude", hex: "#00D4AA" },
  { name: "Orange", hex: "#FF7F3F" },
  { name: "Rose", hex: "#FFB4AB" },
  { name: "Jaune", hex: "#FFC107" },
  { name: "Cyan", hex: "#00BCD4" },
  { name: "Gris", hex: "#C3C6D7" },
];

export default function TagsPage() {
  const { workspaceId } = useWorkspace();
  const { data: tags, isLoading, error, refetch } = useTags(workspaceId);
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();
  const { toast } = useToast();

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(presetColors[0]!.hex);

  const handleAdd = async () => {
    if (!newName.trim() || !workspaceId) return;
    try {
      await createTag.mutateAsync({ workspaceId, name: newName.trim(), color: newColor });
      toast("Tag créé avec succès");
      setNewName("");
      setShowAdd(false);
    } catch (e: any) {
      toast(e.message || "Erreur lors de la création", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTag.mutateAsync(id);
      toast("Tag supprimé");
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les tags" onRetry={() => refetch()} />;

  const tagList = tags ?? [];
  const totalConversations = tagList.reduce((acc: number, t: any) => acc + (t.conversationCount ?? 0), 0);

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Tags</h1>
          <p className="mt-2 text-on-surface-variant">{tagList.length} tags · {totalConversations} conversations taguées</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add</span>
          Nouveau tag
        </button>
      </div>

      {showAdd && (
        <div className="rounded-2xl border border-primary/20 bg-card p-6">
          <h3 className="mb-4 text-sm font-bold text-on-surface">Créer un nouveau tag</h3>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nom du tag</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Prospect chaud" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Couleur</label>
              <div className="flex gap-1.5">
                {presetColors.map((c) => (
                  <button key={c.hex} onClick={() => setNewColor(c.hex)} className={`h-8 w-8 rounded-lg transition-all ${newColor === c.hex ? "ring-2 ring-white ring-offset-2 ring-offset-surface" : "hover:scale-110"}`} style={{ backgroundColor: c.hex }} title={c.name} />
                ))}
              </div>
            </div>
            <button onClick={handleAdd} disabled={createTag.isPending || !newName.trim()} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
              {createTag.isPending ? "..." : "Créer"}
            </button>
            <button onClick={() => setShowAdd(false)} className="rounded-lg px-4 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
          </div>
          {newName && (
            <div className="mt-4">
              <p className="mb-1 text-[10px] text-on-surface-variant">Aperçu :</p>
              <span className="inline-flex rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: `${newColor}15`, color: newColor }}>{newName}</span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {tagList.map((tag: any) => (
          <div key={tag.id} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-card px-6 py-4 transition-all hover:border-white/10">
            <div className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: tag.color }} />
            <span className="min-w-0 flex-1 text-sm font-bold text-on-surface">{tag.name}</span>
            <span className="rounded-full px-3 py-1 text-[10px] font-bold" style={{ backgroundColor: `${tag.color}15`, color: tag.color }}>{tag.name}</span>
            <span className="text-sm text-on-surface-variant">{tag.conversationCount ?? 0} conv.</span>
            <button onClick={() => handleDelete(tag.id)} className="rounded-lg p-2 text-on-surface-variant transition-colors hover:text-error">
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
