"use client";

import { useState, useRef } from "react";
import { useKnowledgeBases, useCreateKnowledgeBase, useDeleteKnowledgeBase, useUpdateKnowledgeBase, useUploadKBFiles } from "@/hooks/use-knowledge-bases";
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
  const updateKB = useUpdateKnowledgeBase();
  const uploadFiles = useUploadKBFiles();
  const { toast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [newKB, setNewKB] = useState({ name: "", mode: "full_context" as string });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newKB.name.trim() || !workspaceId) return;
    try {
      await createKB.mutateAsync({ workspaceId, name: newKB.name, mode: newKB.mode });
      toast("Base de connaissances créée");
      setShowModal(false);
      setNewKB({ name: "", mode: "full_context" });
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteKB.mutateAsync(id);
      toast("Base supprimée");
      if (editingId === id) setEditingId(null);
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const handleSaveContent = async (id: string) => {
    setSaving(true);
    try {
      await updateKB.mutateAsync({ id, content: editContent });
      toast("Contenu sauvegardé");
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
    setSaving(false);
  };

  const handleFileUpload = async (kbId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingId(kbId);
    try {
      await uploadFiles.mutateAsync({ kbId, files: Array.from(files) });
      toast(`${files.length} fichier(s) ajouté(s)`);
    } catch (e: any) {
      toast(e.message || "Erreur d'upload", "error");
    }
    setUploadingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = async (kbId: string, fileIndex: number, currentFiles: any[]) => {
    const updated = currentFiles.filter((_: any, i: number) => i !== fileIndex);
    try {
      await updateKB.mutateAsync({ id: kbId, files: updated });
      toast("Fichier supprimé");
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const openEditor = (kb: any) => {
    setEditingId(kb.id);
    setEditContent(kb.content || "");
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les bases" onRetry={() => refetch()} />;
  const kbList = kbs ?? [];

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const fileTypeIcon = (type: string) => {
    if (type.includes("pdf")) return "picture_as_pdf";
    if (type.includes("word") || type.includes("document")) return "description";
    if (type.includes("zip")) return "folder_zip";
    return "text_snippet";
  };

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
        <EmptyState icon="menu_book" title="Aucune base de connaissances" description="Créez une base pour enrichir vos agents avec du contexte." actionLabel="Nouvelle base" onAction={() => setShowModal(true)} />
      ) : (
        <div className="space-y-5">
          {kbList.map((kb: any) => {
            const isEditing = editingId === kb.id;
            const files = kb.files || [];

            return (
              <div key={kb.id} className="rounded-2xl border border-white/5 bg-card">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-0">
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
                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <button onClick={() => openEditor(kb)} className="flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface">
                        <span className="material-symbols-outlined text-sm">edit</span>
                        {kb.mode === "full_context" ? "Modifier le texte" : "Gérer les fichiers"}
                      </button>
                    )}
                    <button onClick={() => handleDelete(kb.id)} className="text-on-surface-variant hover:text-error">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                {/* Content area */}
                <div className="p-6">
                  {kb.mode === "full_context" ? (
                    /* Full Context: text editor */
                    isEditing ? (
                      <div className="space-y-3">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Contenu texte — collez votre base de connaissances ici
                        </label>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={12}
                          placeholder="Collez ici le texte qui servira de contexte à votre agent IA...&#10;&#10;Exemple : FAQ, procédures, informations produits, scripts d'appel..."
                          className="w-full rounded-lg bg-surface-container-lowest p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                          style={{ fontFamily: "JetBrains Mono, monospace", lineHeight: "1.6" }}
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-on-surface-variant">{editContent.length} caractères</p>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingId(null)} className="rounded-lg px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface">Fermer</button>
                            <button
                              onClick={() => handleSaveContent(kb.id)}
                              disabled={saving}
                              className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
                            >
                              {saving ? "Sauvegarde..." : "Sauvegarder"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {kb.content ? (
                          <p className="line-clamp-3 text-sm text-on-surface-variant">{kb.content}</p>
                        ) : (
                          <p className="text-sm italic text-on-surface-variant/50">Aucun contenu — cliquez sur &quot;Modifier le texte&quot; pour ajouter du contexte</p>
                        )}
                      </div>
                    )
                  ) : (
                    /* RAG: file upload */
                    <div className="space-y-4">
                      {/* File list */}
                      {files.length > 0 && (
                        <div className="space-y-2">
                          {files.map((f: any, i: number) => (
                            <div key={i} className="flex items-center justify-between rounded-lg bg-surface-container-lowest px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg text-secondary">{fileTypeIcon(f.type)}</span>
                                <div>
                                  <p className="text-sm font-medium text-on-surface">{f.name}</p>
                                  <p className="text-[10px] text-on-surface-variant">{formatSize(f.size)}</p>
                                </div>
                              </div>
                              {isEditing && (
                                <button onClick={() => handleRemoveFile(kb.id, i, files)} className="text-on-surface-variant hover:text-error">
                                  <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {isEditing ? (
                        <div className="space-y-3">
                          {/* Drop zone */}
                          <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-white/10 bg-surface-container-lowest p-8 transition-all hover:border-primary/30 hover:bg-primary/5">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant">cloud_upload</span>
                            <div className="text-center">
                              <p className="text-sm font-bold text-on-surface">Glissez vos fichiers ici ou cliquez pour parcourir</p>
                              <p className="mt-1 text-xs text-on-surface-variant">PDF, Word (.doc, .docx), Texte (.txt), ZIP — max 20 Mo par fichier</p>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.txt,.zip"
                              className="hidden"
                              onChange={(e) => handleFileUpload(kb.id, e.target.files)}
                            />
                            {uploadingId === kb.id && (
                              <div className="flex items-center gap-2 text-primary">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <span className="text-xs font-bold">Upload en cours...</span>
                              </div>
                            )}
                          </label>
                          <div className="flex justify-end">
                            <button onClick={() => setEditingId(null)} className="rounded-lg px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface">Fermer</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-on-surface-variant">
                          {files.length} fichier(s) — <button onClick={() => openEditor(kb)} className="text-primary hover:underline">gérer les fichiers</button>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-8">
            <h2 className="mb-6 text-xl font-bold text-on-surface">Nouvelle base</h2>
            <div className="space-y-4">
              <input value={newKB.name} onChange={(e) => setNewKB({ ...newKB, name: e.target.value })} placeholder="Nom de la base" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Mode</label>
                <div className="flex gap-3">
                  {[
                    { id: "full_context", label: "Full Context", desc: "Collez du texte comme base de connaissances", icon: "text_snippet" },
                    { id: "rag", label: "RAG", desc: "Uploadez des documents (PDF, Word, TXT, ZIP)", icon: "cloud_upload" },
                  ].map((m) => (
                    <button key={m.id} onClick={() => setNewKB({ ...newKB, mode: m.id })} className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${newKB.mode === m.id ? "border-primary bg-primary/5 text-primary" : "border-white/5 text-on-surface-variant"}`}>
                      <span className="material-symbols-outlined text-2xl">{m.icon}</span>
                      <span className="text-sm font-bold">{m.label}</span>
                      <span className="text-[10px] leading-tight opacity-60">{m.desc}</span>
                    </button>
                  ))}
                </div>
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
