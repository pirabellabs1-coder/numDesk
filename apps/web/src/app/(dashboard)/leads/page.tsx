"use client";

import { useState } from "react";
import { useLeads, useCreateLead, useUpdateLeadStage, useDeleteLead } from "@/hooks/use-leads";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";

const stages = [
  { id: "new" as const, label: "Nouveau", color: "border-primary/30", headerBg: "bg-primary/10", headerText: "text-primary" },
  { id: "contacted" as const, label: "Contacté", color: "border-secondary/30", headerBg: "bg-secondary/10", headerText: "text-secondary" },
  { id: "qualified" as const, label: "Qualifié", color: "border-orange-400/30", headerBg: "bg-orange-400/10", headerText: "text-orange-400" },
  { id: "converted" as const, label: "Converti", color: "border-tertiary/30", headerBg: "bg-tertiary/10", headerText: "text-tertiary" },
];

export default function LeadsPage() {
  const { workspaceId } = useWorkspace();
  const { data: leads, isLoading, error, refetch } = useLeads(workspaceId);
  const createLead = useCreateLead();
  const updateStage = useUpdateLeadStage();
  const deleteLead = useDeleteLead();
  const { toast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", company: "", phone: "", value: "", source: "Appel entrant" });

  const handleCreate = async () => {
    if (!newLead.name.trim() || !workspaceId) return;
    try {
      await createLead.mutateAsync({ workspaceId, ...newLead });
      toast("Lead créé avec succès");
      setShowCreate(false);
      setNewLead({ name: "", company: "", phone: "", value: "", source: "Appel entrant" });
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const handleStageChange = async (id: string, newStage: string) => {
    try {
      await updateStage.mutateAsync({ id, stage: newStage });
      toast(`Lead déplacé vers "${stages.find((s) => s.id === newStage)?.label}"`);
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead.mutateAsync(id);
      toast("Lead supprimé");
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les leads" onRetry={() => refetch()} />;

  const leadList = leads ?? [];
  const totalValue = leadList.reduce((a: number, l: any) => a + parseInt((l.value || "0").replace(/\D/g, "") || "0"), 0);

  return (
    <section className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Pipeline Leads</h1>
          <p className="mt-2 text-on-surface-variant">{leadList.length} leads · {totalValue.toLocaleString("fr-FR")} € valeur totale</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add</span>
          Nouveau lead
        </button>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
        {stages.map((stage) => {
          const stageLeads = leadList.filter((l: any) => l.stage === stage.id);
          const stageValue = stageLeads.reduce((a: number, l: any) => a + parseInt((l.value || "0").replace(/\D/g, "") || "0"), 0);
          return (
            <div key={stage.id} className="space-y-3">
              <div className={`flex items-center justify-between rounded-xl ${stage.headerBg} px-4 py-3`}>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${stage.headerText}`}>{stage.label}</span>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold ${stage.headerText}`}>{stageLeads.length}</span>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant">{stageValue.toLocaleString("fr-FR")} €</span>
              </div>
              {stageLeads.map((lead: any) => (
                <div key={lead.id} className={`rounded-xl border ${stage.color} bg-card p-4 transition-all hover:border-white/20`}>
                  <div className="mb-2 flex items-start justify-between">
                    <p className="text-sm font-bold text-on-surface">{lead.name}</p>
                    <span className="text-xs font-bold text-tertiary">{lead.value}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">{lead.company}</p>
                  {lead.source && <span className="mt-2 inline-block rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-on-surface-variant">{lead.source}</span>}
                  {/* Stage change buttons */}
                  <div className="mt-3 flex gap-1">
                    {stages.filter((s) => s.id !== lead.stage).map((s) => (
                      <button key={s.id} onClick={() => handleStageChange(lead.id, s.id)} className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${s.headerBg} ${s.headerText}`} title={`Déplacer vers ${s.label}`}>
                        {s.label}
                      </button>
                    ))}
                    <button onClick={() => handleDelete(lead.id)} className="ml-auto rounded px-1 text-on-surface-variant hover:text-error">
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-4 sm:p-6 md:p-8">
            <h2 className="mb-6 text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Nouveau lead</h2>
            <div className="space-y-4">
              <input value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} placeholder="Nom du contact" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              <input value={newLead.company} onChange={(e) => setNewLead({ ...newLead, company: e.target.value })} placeholder="Entreprise" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              <input value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} placeholder="Téléphone" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              <input value={newLead.value} onChange={(e) => setNewLead({ ...newLead, value: e.target.value })} placeholder="Valeur estimée (ex: 2 400 €)" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              <select value={newLead.source} onChange={(e) => setNewLead({ ...newLead, source: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Appel entrant</option>
                <option>Campagne</option>
                <option>Site web</option>
                <option>Recommandation</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={handleCreate} disabled={createLead.isPending || !newLead.name.trim()} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white disabled:opacity-50">
                {createLead.isPending ? "Création..." : "Créer le lead"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
