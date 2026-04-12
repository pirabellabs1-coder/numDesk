"use client";

import { useState } from "react";
import { useTeams, useCreateTeam, useDeleteTeam } from "@/hooks/use-teams";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function TeamsPage() {
  const { workspaceId } = useWorkspace();
  const { data: teams, isLoading, error, refetch } = useTeams(workspaceId);
  const createTeam = useCreateTeam();
  const deleteTeam = useDeleteTeam();
  const { toast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", color: "#4F7FFF" });

  const handleCreate = async () => {
    if (!newTeam.name.trim() || !workspaceId) return;
    try {
      await createTeam.mutateAsync({ workspaceId, name: newTeam.name, color: newTeam.color });
      toast("Équipe créée avec succès");
      setShowCreate(false);
      setNewTeam({ name: "", color: "#4F7FFF" });
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeam.mutateAsync(id);
      toast("Équipe supprimée");
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les équipes" onRetry={() => refetch()} />;

  const teamList = teams ?? [];

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Équipes</h1>
          <p className="mt-2 text-on-surface-variant">{teamList.length} équipes configurées</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add</span>
          Nouvelle équipe
        </button>
      </div>

      {teamList.length === 0 ? (
        <EmptyState icon="groups" title="Aucune équipe" description="Organisez vos membres en équipes." actionLabel="Nouvelle équipe" onAction={() => setShowCreate(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {teamList.map((team: any) => (
            <div key={team.id} className="rounded-2xl border border-white/5 bg-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${team.color}20` }}>
                    <span className="material-symbols-outlined" style={{ color: team.color }}>groups</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-on-surface">{team.name}</p>
                    <p className="text-xs text-on-surface-variant">{(team.members || []).length} membres</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(team.id)} className="text-on-surface-variant hover:text-error">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
              {(team.members || []).length > 0 && (
                <div className="space-y-2">
                  {team.members.map((m: any) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: team.color }}>
                        {(m.role || "M")[0]}
                      </div>
                      <span className="flex-1 text-sm text-on-surface">{m.userId}</span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-on-surface-variant">{m.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-8">
            <h2 className="mb-6 text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Nouvelle équipe</h2>
            <div className="space-y-4">
              <input value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} placeholder="Nom de l'équipe" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Couleur</label>
                <div className="flex gap-2">
                  {["#4F7FFF", "#7B5CFA", "#00D4AA", "#FF7F3F", "#FFB4AB", "#FFC107"].map((c) => (
                    <button key={c} onClick={() => setNewTeam({ ...newTeam, color: c })} className={`h-8 w-8 rounded-lg ${newTeam.color === c ? "ring-2 ring-white ring-offset-2 ring-offset-surface" : ""}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={handleCreate} disabled={createTeam.isPending || !newTeam.name.trim()} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {createTeam.isPending ? "..." : "Créer l'équipe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
