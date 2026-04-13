"use client";

import { useState } from "react";
import Link from "next/link";
import { useAgents, useCreateAgent, useDeleteAgent, useUpdateAgent } from "@/hooks/use-agents";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { usePlanAccess } from "@/hooks/use-plan-access";

export default function AgentsPage() {
  const { workspaceId } = useWorkspace();
  const { data: agents, isLoading, error, refetch } = useAgents(workspaceId);
  const createAgent = useCreateAgent();
  const deleteAgent = useDeleteAgent();
  const updateAgent = useUpdateAgent();
  const { toast } = useToast();
  const { maxAgents, planSlug, plan } = usePlanAccess();

  const [showCreate, setShowCreate] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: "", prompt: "", voiceId: "Cartesia — Sophie", llmModel: "gemini-2.5-flash" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newAgent.name.trim() || !workspaceId) return;
    try {
      await createAgent.mutateAsync({
        workspaceId,
        name: newAgent.name,
        prompt: newAgent.prompt,
        voiceId: newAgent.voiceId,
        llmModel: newAgent.llmModel,
        color: "from-primary to-secondary",
      });
      toast("Agent créé avec succès");
      setShowCreate(false);
      setNewAgent({ name: "", prompt: "", voiceId: "Cartesia — Sophie", llmModel: "gemini-2.5-flash" });
    } catch (e: any) {
      toast(e.message || "Erreur lors de la création", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAgent.mutateAsync(id);
      toast("Agent supprimé");
      setDeletingId(null);
    } catch (e: any) {
      toast(e.message || "Erreur lors de la suppression", "error");
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await updateAgent.mutateAsync({ id, isActive: !isActive });
      toast(isActive ? "Agent désactivé" : "Agent activé");
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les agents" onRetry={() => refetch()} />;

  const agentList = agents ?? [];

  return (
    <section className="mx-auto max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
            Mes Agents
          </h1>
          <p className="mt-2 text-on-surface-variant">
            {agentList.filter((a: any) => a.isActive).length} agents actifs sur {agentList.length} configurés
          </p>
        </div>
        <button
          onClick={() => {
            if (maxAgents !== null && agentList.length >= maxAgents) {
              toast(`Limite de ${maxAgents} agent(s) atteinte pour le plan ${plan.name}. Passez au plan supérieur.`, "error");
              return;
            }
            setShowCreate(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Créer un agent
          {maxAgents !== null && (
            <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px]">{agentList.length}/{maxAgents}</span>
          )}
        </button>
      </div>

      {agentList.length === 0 ? (
        <EmptyState
          icon="smart_toy"
          title="Aucun agent configuré"
          description="Créez votre premier agent IA pour commencer à automatiser vos appels."
          actionLabel="Créer votre premier agent"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {agentList.map((agent: any) => (
            <div key={agent.id} className="group rounded-2xl border border-white/5 bg-card p-4 sm:p-5 transition-all hover:border-white/10">
              <div className="mb-4 flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${agent.color || "from-primary to-secondary"}`}>
                  <span className="material-symbols-outlined text-2xl text-white">smart_toy</span>
                </div>
                <button
                  onClick={() => handleToggle(agent.id, agent.isActive)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${agent.isActive ? "bg-tertiary" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${agent.isActive ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
              <h3 className="mb-1 text-lg font-bold text-on-surface">{agent.name}</h3>
              <p className="mb-3 text-xs text-on-surface-variant">{agent.voiceId || "Voix non configurée"}</p>
              <div className="mb-4 flex items-center gap-4 text-xs text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">call</span>
                  {agent.totalCalls ?? 0} appels
                </div>
              </div>
              <div className="mb-4">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  agent.isPublished ? "bg-tertiary/10 text-tertiary" : "bg-white/5 text-on-surface-variant"
                }`}>
                  {agent.isPublished ? "Publié" : "Brouillon"}
                </span>
              </div>
              <div className="flex gap-2">
                <Link href={`/agents/${agent.id}`} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 py-2 text-xs font-bold text-on-surface-variant transition-all hover:border-white/20 hover:text-on-surface">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Éditer
                </Link>
                <button onClick={() => setDeletingId(agent.id)} className="rounded-lg border border-white/10 px-3 py-2 text-on-surface-variant transition-all hover:border-error/30 hover:text-error">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-4 sm:p-6 md:p-8">
            <h2 className="mb-6 text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Créer un agent</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nom de l&apos;agent</label>
                <input value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} placeholder="Ex: Agent Support FR" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Voix</label>
                <select value={newAgent.voiceId} onChange={(e) => setNewAgent({ ...newAgent, voiceId: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Cartesia — Sophie</option>
                  <option>Cartesia — Gabriel</option>
                  <option>ElevenLabs — Marie</option>
                  <option>Cartesia — Luc</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Modèle LLM</label>
                <select value={newAgent.llmModel} onChange={(e) => setNewAgent({ ...newAgent, llmModel: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="claude-3.5-haiku">Claude 3.5 Haiku</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Prompt initial</label>
                <textarea value={newAgent.prompt} onChange={(e) => setNewAgent({ ...newAgent, prompt: e.target.value })} placeholder="Décrivez le comportement de votre agent..." rows={4} className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={handleCreate} disabled={createAgent.isPending || !newAgent.name.trim()} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white disabled:opacity-50">
                {createAgent.isPending ? "Création..." : "Créer l'agent"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-4 sm:p-6 md:p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10">
              <span className="material-symbols-outlined text-3xl text-error">delete</span>
            </div>
            <h3 className="mb-2 text-lg font-bold text-on-surface">Supprimer cet agent ?</h3>
            <p className="mb-6 text-sm text-on-surface-variant">Cette action est irréversible.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeletingId(null)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={() => handleDelete(deletingId)} disabled={deleteAgent.isPending} className="rounded-lg bg-error px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {deleteAgent.isPending ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
