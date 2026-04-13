"use client";

import { useState } from "react";
import { useNotes, useCreateNote, useDeleteNote } from "@/hooks/use-notes";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

const actionConfig: Record<string, { label: string; icon: string; color: string }> = {
  rappel: { label: "Rappel", icon: "call", color: "text-primary bg-primary/10" },
  email: { label: "Email", icon: "mail", color: "text-secondary bg-secondary/10" },
  transfert: { label: "Transfert", icon: "swap_horiz", color: "text-orange-400 bg-orange-400/10" },
  none: { label: "Aucune", icon: "check", color: "text-on-surface-variant bg-white/5" },
};

export default function NotesPage() {
  const { workspaceId } = useWorkspace();
  const { data: notes, isLoading, error, refetch } = useNotes(workspaceId);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const { toast } = useToast();

  const [showAdd, setShowAdd] = useState(false);
  const [newNote, setNewNote] = useState({ content: "", action: "none" as string, conversationId: "" });

  const handleCreate = async () => {
    if (!newNote.content.trim() || !workspaceId) return;
    try {
      await createNote.mutateAsync({
        workspaceId,
        content: newNote.content,
        action: newNote.action as any,
        conversationId: newNote.conversationId || undefined,
      });
      toast("Note créée avec succès");
      setShowAdd(false);
      setNewNote({ content: "", action: "none", conversationId: "" });
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote.mutateAsync(id);
      toast("Note supprimée");
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les notes" onRetry={() => refetch()} />;

  const noteList = notes ?? [];

  return (
    <section className="mx-auto max-w-4xl space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Notes d&apos;appels</h1>
          <p className="mt-2 text-on-surface-variant">{noteList.length} notes enregistrées</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add</span>
          Nouvelle note
        </button>
      </div>

      {showAdd && (
        <div className="rounded-2xl border border-primary/20 bg-card p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-bold text-on-surface">Ajouter une note</h3>
          <div className="space-y-4">
            <textarea value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} placeholder="Votre note..." rows={3} className="w-full rounded-lg bg-surface-container-lowest px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xs text-on-surface-variant">Action :</span>
              {Object.entries(actionConfig).map(([key, cfg]) => (
                <button key={key} onClick={() => setNewNote({ ...newNote, action: key })} className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] sm:px-3 sm:text-xs font-bold transition-all ${newNote.action === key ? cfg.color + " ring-1 ring-white/20" : "text-on-surface-variant"}`}>
                  <span className="material-symbols-outlined text-xs">{cfg.icon}</span>
                  {cfg.label}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAdd(false)} className="text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={handleCreate} disabled={createNote.isPending || !newNote.content.trim()} className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
                {createNote.isPending ? "..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {noteList.length === 0 ? (
        <EmptyState icon="sticky_note_2" title="Aucune note" description="Ajoutez des notes sur vos appels." actionLabel="Nouvelle note" onAction={() => setShowAdd(true)} />
      ) : (
        <div className="space-y-3">
          {noteList.map((note: any) => {
            const action = actionConfig[note.action as string] ?? actionConfig["none"]!;
            return (
              <div key={note.id} className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-[10px] font-bold text-on-surface-variant">
                      {(note.author || "U").split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-on-surface">{note.author}</p>
                      <p className="text-[10px] text-on-surface-variant">{new Date(note.createdAt).toLocaleString("fr-FR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-9 sm:ml-0">
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] font-bold ${action.color}`}>
                      <span className="material-symbols-outlined text-xs">{action.icon}</span>
                      {action.label}
                    </span>
                    <button onClick={() => handleDelete(note.id)} className="text-on-surface-variant hover:text-error">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-on-surface-variant">{note.content}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
