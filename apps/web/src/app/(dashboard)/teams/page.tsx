"use client";

import { useState } from "react";
import { useTeams, useCreateTeam, useDeleteTeam, useAddTeamMember, useRemoveTeamMember } from "@/hooks/use-teams";
import { useWorkspaceMembers } from "@/hooks/use-workspace-members";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function TeamsPage() {
  const { workspaceId } = useWorkspace();
  const { data: teams, isLoading, error, refetch } = useTeams(workspaceId);
  const { data: membersData } = useWorkspaceMembers(workspaceId);
  const createTeam = useCreateTeam();
  const deleteTeam = useDeleteTeam();
  const addMember = useAddTeamMember();
  const removeMember = useRemoveTeamMember();
  const { toast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", color: "#4F7FFF" });
  const [addingToTeam, setAddingToTeam] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("");

  const allMembers = membersData?.members ?? [];

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

  const handleAddMember = async (teamId: string) => {
    if (!selectedUserId) return;
    try {
      await addMember.mutateAsync({ teamId, userId: selectedUserId });
      toast("Membre ajouté à l'équipe");
      setAddingToTeam(null);
      setSelectedUserId("");
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const handleRemoveMember = async (teamId: string, memberId: string) => {
    try {
      await removeMember.mutateAsync({ teamId, memberId });
      toast("Membre retiré de l'équipe");
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les équipes" onRetry={() => refetch()} />;

  const teamList = teams ?? [];

  const getMemberName = (userId: string) => {
    const m = allMembers.find((m: any) => m.userId === userId);
    if (m) {
      const name = `${m.firstName || ""} ${m.lastName || ""}`.trim();
      return name || m.email || userId.slice(0, 8);
    }
    return userId.slice(0, 8);
  };

  const getMemberEmail = (userId: string) => {
    const m = allMembers.find((m: any) => m.userId === userId);
    return m?.email || "";
  };

  const getMemberInitials = (userId: string) => {
    const m = allMembers.find((m: any) => m.userId === userId);
    if (m) {
      const first = (m.firstName || "")[0] || "";
      const last = (m.lastName || "")[0] || "";
      if (first || last) return `${first}${last}`.toUpperCase();
      return (m.email || "?")[0].toUpperCase();
    }
    return "?";
  };

  // Members available to add (not already in team)
  const getAvailableMembers = (team: any) => {
    const teamMemberIds = (team.members || []).map((m: any) => m.userId);
    return allMembers.filter((m: any) => !teamMemberIds.includes(m.userId));
  };

  return (
    <section className="mx-auto max-w-5xl space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Équipes</h1>
          <p className="mt-2 text-on-surface-variant">{teamList.length} équipe(s) — {allMembers.length} membre(s) dans le workspace</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add</span>
          Nouvelle équipe
        </button>
      </div>

      {teamList.length === 0 ? (
        <EmptyState icon="groups" title="Aucune équipe" description="Organisez vos membres en équipes pour mieux gérer les accès." actionLabel="Nouvelle équipe" onAction={() => setShowCreate(true)} />
      ) : (
        <div className="space-y-5">
          {teamList.map((team: any) => {
            const available = getAvailableMembers(team);
            return (
              <div key={team.id} className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
                <div className="mb-4 sm:mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${team.color}20` }}>
                      <span className="material-symbols-outlined" style={{ color: team.color }}>groups</span>
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-bold text-on-surface">{team.name}</p>
                      <p className="text-xs text-on-surface-variant">{(team.members || []).length} membre(s)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setAddingToTeam(addingToTeam === team.id ? null : team.id); setSelectedUserId(""); }}
                      className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-[10px] sm:px-3 sm:text-xs font-bold text-on-surface-variant hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-sm">person_add</span>
                      <span className="hidden sm:inline">Ajouter un membre</span>
                      <span className="sm:hidden">Ajouter</span>
                    </button>
                    <button onClick={() => handleDelete(team.id)} className="text-on-surface-variant hover:text-error">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                {/* Add member form */}
                {addingToTeam === team.id && (
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 rounded-xl bg-surface-container-lowest p-3 sm:p-4">
                    {available.length === 0 ? (
                      <p className="text-xs sm:text-sm text-on-surface-variant">Tous les membres du workspace sont déjà dans cette équipe</p>
                    ) : (
                      <>
                        <select
                          value={selectedUserId}
                          onChange={(e) => setSelectedUserId(e.target.value)}
                          className="flex-1 rounded-lg bg-surface-container-low px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">Sélectionner un membre...</option>
                          {available.map((m: any) => (
                            <option key={m.userId} value={m.userId}>
                              {`${m.firstName || ""} ${m.lastName || ""}`.trim() || m.email} — {m.role}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAddMember(team.id)}
                          disabled={!selectedUserId || addMember.isPending}
                          className="w-fit rounded-lg bg-primary px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm font-bold text-white disabled:opacity-50"
                        >
                          {addMember.isPending ? "..." : "Ajouter"}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Member list */}
                {(team.members || []).length > 0 ? (
                  <div className="space-y-2">
                    {team.members.map((m: any) => (
                      <div key={m.id} className="flex items-center justify-between rounded-lg bg-surface-container-lowest px-3 py-2.5 sm:px-4 sm:py-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: team.color }}>
                            {getMemberInitials(m.userId)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-on-surface truncate">{getMemberName(m.userId)}</p>
                            <p className="text-[10px] text-on-surface-variant truncate">{getMemberEmail(m.userId)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          <span className="hidden sm:inline rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase text-on-surface-variant">{m.role}</span>
                          <button onClick={() => handleRemoveMember(team.id, m.id)} className="text-on-surface-variant hover:text-error">
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-on-surface-variant/50">Aucun membre — utilisez le bouton ci-dessus pour en ajouter</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-4 sm:p-6 md:p-8">
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
              <button onClick={handleCreate} disabled={createTeam.isPending || !newTeam.name.trim()} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white disabled:opacity-50">
                {createTeam.isPending ? "..." : "Créer l'équipe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
