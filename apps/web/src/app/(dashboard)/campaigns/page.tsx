"use client";

import { useState } from "react";
import { useCampaigns, useCreateCampaign, useStartCampaign, usePauseCampaign, useStopCampaign } from "@/hooks/use-campaigns";
import { useAgents } from "@/hooks/use-agents";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

const statusStyles: Record<string, string> = {
  active: "bg-tertiary/10 text-tertiary",
  paused: "bg-orange-400/10 text-orange-400",
  completed: "bg-white/5 text-on-surface-variant",
  draft: "bg-secondary/10 text-secondary",
  failed: "bg-error/10 text-error",
};
const statusLabels: Record<string, string> = { active: "Active", paused: "En pause", completed: "Terminée", draft: "Brouillon", failed: "Échouée" };

export default function CampaignsPage() {
  const { workspaceId } = useWorkspace();
  const { data: campaigns, isLoading, error, refetch } = useCampaigns(workspaceId);
  const { data: agents } = useAgents(workspaceId);
  const createCampaign = useCreateCampaign();
  const startCampaign = useStartCampaign();
  const pauseCampaign = usePauseCampaign();
  const stopCampaign = useStopCampaign();
  const { toast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [newCamp, setNewCamp] = useState({ name: "", agentId: "", callWindowStart: "09:00", callWindowEnd: "18:00", contactsText: "" });

  const handleCreate = async () => {
    if (!newCamp.name.trim() || !newCamp.agentId || !workspaceId) return;
    const contacts = newCamp.contactsText.split("\n").filter(Boolean).map((line) => {
      const [name, phone] = line.split(",").map((s) => s.trim());
      return { name: name || "", phone: phone || "" };
    });
    try {
      await createCampaign.mutateAsync({
        workspaceId,
        name: newCamp.name,
        agentId: newCamp.agentId,
        contacts,
        callWindowStart: newCamp.callWindowStart,
        callWindowEnd: newCamp.callWindowEnd,
      });
      toast("Campagne créée avec succès");
      setShowModal(false);
      setNewCamp({ name: "", agentId: "", callWindowStart: "09:00", callWindowEnd: "18:00", contactsText: "" });
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const handleStart = async (id: string) => { try { await startCampaign.mutateAsync(id); toast("Campagne lancée"); } catch (e: any) { toast(e.message || "Erreur", "error"); } };
  const handlePause = async (id: string) => { try { await pauseCampaign.mutateAsync(id); toast("Campagne mise en pause"); } catch (e: any) { toast(e.message || "Erreur", "error"); } };
  const handleStop = async (id: string) => { try { await stopCampaign.mutateAsync(id); toast("Campagne arrêtée"); } catch (e: any) { toast(e.message || "Erreur", "error"); } };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les campagnes" onRetry={() => refetch()} />;

  const campList = campaigns ?? [];
  const total = campList.reduce((acc: number, c: any) => acc + (c.totalContacts || 0), 0);
  const success = campList.reduce((acc: number, c: any) => acc + (c.successCount || 0), 0);
  const active = campList.filter((c: any) => c.status === "active").length;

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Campagnes</h1>
          <p className="mt-2 text-on-surface-variant">{active} campagne(s) active(s)</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add</span>
          Nouvelle Campagne
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total contacts", value: total, icon: "group", color: "text-primary" },
          { label: "Appels réussis", value: success, icon: "check_circle", color: "text-tertiary" },
          { label: "Campagnes actives", value: active, icon: "campaign", color: "text-secondary" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/5 bg-card p-5">
            <div className={`mb-2 ${s.color}`}><span className="material-symbols-outlined">{s.icon}</span></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{s.label}</p>
            <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {campList.length === 0 ? (
        <EmptyState icon="campaign" title="Aucune campagne" description="Créez votre première campagne d'appels." actionLabel="Nouvelle campagne" onAction={() => setShowModal(true)} />
      ) : (
        <div className="space-y-4">
          {campList.map((camp: any) => {
            const pct = camp.totalContacts > 0 ? Math.round((camp.calledCount / camp.totalContacts) * 100) : 0;
            return (
              <div key={camp.id} className="rounded-2xl border border-white/5 bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-on-surface">{camp.name}</p>
                    <p className="text-xs text-on-surface-variant">{camp.calledCount ?? 0}/{camp.totalContacts ?? 0} contacts appelés</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[camp.status] || statusStyles.draft}`}>
                      {statusLabels[camp.status] || camp.status}
                    </span>
                    {camp.status === "draft" && (
                      <button onClick={() => handleStart(camp.id)} className="rounded-lg border border-tertiary/30 px-3 py-1.5 text-xs font-bold text-tertiary hover:bg-tertiary/10">Lancer</button>
                    )}
                    {camp.status === "active" && (
                      <>
                        <button onClick={() => handlePause(camp.id)} className="rounded-lg border border-orange-400/30 px-3 py-1.5 text-xs font-bold text-orange-400 hover:bg-orange-400/10">Pause</button>
                        <button onClick={() => handleStop(camp.id)} className="rounded-lg border border-error/30 px-3 py-1.5 text-xs font-bold text-error hover:bg-error/10">Arrêter</button>
                      </>
                    )}
                    {camp.status === "paused" && (
                      <button onClick={() => handleStart(camp.id)} className="rounded-lg border border-tertiary/30 px-3 py-1.5 text-xs font-bold text-tertiary hover:bg-tertiary/10">Reprendre</button>
                    )}
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-8">
            <h2 className="mb-6 text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Nouvelle campagne</h2>
            <div className="space-y-4">
              <input value={newCamp.name} onChange={(e) => setNewCamp({ ...newCamp, name: e.target.value })} placeholder="Nom de la campagne" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              <select value={newCamp.agentId} onChange={(e) => setNewCamp({ ...newCamp, agentId: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Sélectionner un agent...</option>
                {(agents ?? []).map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Heure début</label>
                  <input type="time" value={newCamp.callWindowStart} onChange={(e) => setNewCamp({ ...newCamp, callWindowStart: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Heure fin</label>
                  <input type="time" value={newCamp.callWindowEnd} onChange={(e) => setNewCamp({ ...newCamp, callWindowEnd: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Contacts (nom, téléphone — un par ligne)</label>
                <textarea value={newCamp.contactsText} onChange={(e) => setNewCamp({ ...newCamp, contactsText: e.target.value })} placeholder={"Marie Dupont, +33612345678\nJean Martin, +33723456789"} rows={5} className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                <p className="mt-1 text-[10px] text-on-surface-variant">{newCamp.contactsText.split("\n").filter(Boolean).length} contact(s) détecté(s)</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={handleCreate} disabled={createCampaign.isPending || !newCamp.name.trim() || !newCamp.agentId} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {createCampaign.isPending ? "Création..." : "Créer la campagne"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
