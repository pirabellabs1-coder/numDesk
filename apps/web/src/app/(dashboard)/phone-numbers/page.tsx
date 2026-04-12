"use client";

import { useState } from "react";
import { usePhoneNumbers, useCreatePhoneNumber, useDeletePhoneNumber } from "@/hooks/use-phone-numbers";
import { useAgents } from "@/hooks/use-agents";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function PhoneNumbersPage() {
  const { workspaceId } = useWorkspace();
  const { data: numbers, isLoading, error, refetch } = usePhoneNumbers(workspaceId);
  const { data: agents } = useAgents(workspaceId);
  const createNumber = useCreatePhoneNumber();
  const deleteNumber = useDeletePhoneNumber();
  const { toast } = useToast();

  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState({ number: "", friendlyName: "", agentId: "" });

  const handleCreate = async () => {
    if (!newNumber.number.trim() || !workspaceId) return;
    const fullNumber = newNumber.number.startsWith("+") ? newNumber.number : newNumber.number;
    try {
      await createNumber.mutateAsync({ workspaceId, number: fullNumber, friendlyName: newNumber.friendlyName, provider: "sip_trunk" });
      toast("Numéro ajouté avec succès");
      setShowAdd(false);
      setNewNumber({ number: "", friendlyName: "", agentId: "" });
    } catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteNumber.mutateAsync(id); toast("Numéro supprimé"); setShowDelete(null); }
    catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les numéros" onRetry={() => refetch()} />;
  const numList = numbers ?? [];
  const activeCount = numList.filter((n: any) => n.isActive).length;

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Numéros de téléphone</h1>
          <p className="mt-2 text-on-surface-variant">{activeCount} actif(s) sur {numList.length} numéro(s)</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add_call</span>
          Ajouter un numéro
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-2 text-primary"><span className="material-symbols-outlined">call</span></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total numéros</p>
          <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{numList.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-2 text-tertiary"><span className="material-symbols-outlined">check_circle</span></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Actifs</p>
          <p className="text-3xl font-bold text-tertiary" style={{ fontFamily: "Inter, sans-serif" }}>{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-2 text-secondary"><span className="material-symbols-outlined">router</span></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Provider</p>
          <p className="text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>SIP Trunk</p>
        </div>
      </div>

      {/* Number list */}
      {numList.length === 0 ? (
        <EmptyState icon="call" title="Aucun numéro configuré" description="Ajoutez un numéro SIP pour recevoir et passer des appels avec vos agents IA." actionLabel="Ajouter un numéro" onAction={() => setShowAdd(true)} />
      ) : (
        <div className="space-y-3">
          {numList.map((num: any) => (
            <div key={num.id} className={`rounded-2xl border bg-card p-5 transition-all ${num.isActive ? "border-white/5 hover:border-white/10" : "border-white/5 opacity-60"}`}>
              <div className="flex items-center gap-5">
                {/* Icon */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${num.isActive ? "bg-tertiary/10" : "bg-white/5"}`}>
                  <span className={`material-symbols-outlined text-xl ${num.isActive ? "text-tertiary" : "text-on-surface-variant"}`}>call</span>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{num.number}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${num.isActive ? "bg-tertiary/10 text-tertiary" : "bg-white/5 text-on-surface-variant"}`}>
                      {num.isActive ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-xs text-on-surface-variant">
                    {num.friendlyName && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">badge</span>{num.friendlyName}</span>}
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">router</span>{num.provider || "SIP Trunk"}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">schedule</span>{new Date(num.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowDelete(num.id)} className="rounded-lg border border-white/10 px-3 py-2 text-on-surface-variant transition-all hover:border-error/30 hover:text-error">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="rounded-2xl border border-white/5 bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary">info</span>
          <div>
            <p className="text-sm font-bold text-on-surface">Configuration SIP Trunk</p>
            <p className="mt-1 text-xs text-on-surface-variant">
              Les numéros SIP sont connectés via votre trunk SIP configuré dans les paramètres.
              Pour configurer un trunk SIP, allez dans <strong className="text-on-surface">Administration → SIP Trunks</strong>.
              Les credentials sont chiffrés AES-256 au repos.
            </p>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-8">
            <h2 className="mb-6 text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Ajouter un numéro SIP</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">SIP Trunk</label>
                <select className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">SIP trunk de la company</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nom du numéro</label>
                <input value={newNumber.friendlyName} onChange={(e) => setNewNumber({ ...newNumber, friendlyName: e.target.value })} placeholder="Ex: Ligne Support, Accueil, Commercial..." className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Agent inbound (optionnel)</label>
                <select value={newNumber.agentId} onChange={(e) => setNewNumber({ ...newNumber, agentId: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Aucun agent assigné</option>
                  {(agents ?? []).map((agent: any) => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-on-surface-variant">L&apos;agent qui répondra automatiquement aux appels entrants sur ce numéro.</p>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Numéro de téléphone ou extension</label>
                <input value={newNumber.number} onChange={(e) => setNewNumber({ ...newNumber, number: e.target.value })} placeholder="+33187000000" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                <p className="mt-1 text-[10px] text-on-surface-variant">Format E.164 recommandé (ex: +33187000000) ou extension SIP.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowAdd(false)} className="rounded-lg px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={handleCreate} disabled={createNumber.isPending || !newNumber.number.trim()} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-50">
                {createNumber.isPending ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10">
              <span className="material-symbols-outlined text-3xl text-error">call_end</span>
            </div>
            <h3 className="mb-2 text-lg font-bold text-on-surface">Supprimer ce numéro ?</h3>
            <p className="mb-6 text-sm text-on-surface-variant">Le numéro sera déconnecté et ne recevra plus d&apos;appels.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDelete(null)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={() => handleDelete(showDelete)} disabled={deleteNumber.isPending} className="rounded-lg bg-error px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {deleteNumber.isPending ? "..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
