"use client";

import { useState } from "react";
import { useAdminSipTrunks, useCreateSipTrunk, useDeleteSipTrunk } from "@/hooks/use-admin";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export function AdminTrunks() {
  const { data: trunks, isLoading } = useAdminSipTrunks();
  const createTrunk = useCreateSipTrunk();
  const deleteTrunk = useDeleteSipTrunk();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [newTrunk, setNewTrunk] = useState({ name: "", host: "", port: 5060, username: "", password: "", isGlobal: false });

  if (isLoading) return <PageSkeleton />;
  const trunkList = trunks ?? [];

  const handleCreate = async () => {
    if (!newTrunk.name.trim() || !newTrunk.host.trim()) return;
    try {
      await createTrunk.mutateAsync(newTrunk);
      toast("SIP Trunk créé");
      setShowForm(false);
      setNewTrunk({ name: "", host: "", port: 5060, username: "", password: "", isGlobal: false });
    } catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteTrunk.mutateAsync(id); toast("Trunk supprimé"); }
    catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>SIP Trunks globaux</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{trunkList.length} trunk(s) configuré(s)</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add</span>Nouveau trunk
        </button>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-5">
        <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary">security</span>
          <div><p className="text-sm font-bold text-on-surface">Sécurité</p><p className="mt-1 text-xs text-on-surface-variant">Les credentials SIP sont chiffrés AES-256 au repos. Les mots de passe ne sont jamais affichés en clair.</p></div>
        </div>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-primary/20 bg-card p-6">
          <h3 className="mb-4 text-sm font-bold text-on-surface">Configurer un trunk SIP</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nom</label><input value={newTrunk.name} onChange={(e) => setNewTrunk({ ...newTrunk, name: e.target.value })} placeholder="Trunk Principal FR" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Host</label><input value={newTrunk.host} onChange={(e) => setNewTrunk({ ...newTrunk, host: e.target.value })} placeholder="sip.provider.com" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Port</label><input type="number" value={newTrunk.port} onChange={(e) => setNewTrunk({ ...newTrunk, port: +e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Username</label><input value={newTrunk.username} onChange={(e) => setNewTrunk({ ...newTrunk, username: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Password</label><input type="password" value={newTrunk.password} onChange={(e) => setNewTrunk({ ...newTrunk, password: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div className="flex items-end"><label className="flex items-center gap-2"><input type="checkbox" checked={newTrunk.isGlobal} onChange={(e) => setNewTrunk({ ...newTrunk, isGlobal: e.target.checked })} className="rounded" /><span className="text-sm text-on-surface">Trunk global (partagé)</span></label></div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="text-sm text-on-surface-variant">Annuler</button>
            <button onClick={handleCreate} disabled={createTrunk.isPending || !newTrunk.name.trim()} className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-50">{createTrunk.isPending ? "..." : "Créer"}</button>
          </div>
        </div>
      )}

      {trunkList.length === 0 && !showForm ? (
        <EmptyState icon="router" title="Aucun trunk SIP" description="Configurez un trunk pour connecter vos numéros de téléphone." actionLabel="Nouveau trunk" onAction={() => setShowForm(true)} />
      ) : (
        <div className="space-y-3">
          {trunkList.map((trunk: any) => (
            <div key={trunk.id} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-card px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high"><span className="material-symbols-outlined text-on-surface-variant">router</span></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><p className="text-sm font-bold text-on-surface">{trunk.name}</p>{trunk.isGlobal && <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary">Global</span>}</div>
                <p className="text-xs text-on-surface-variant">{trunk.host}:{trunk.port} · {trunk.username || "—"}</p>
              </div>
              <button onClick={() => handleDelete(trunk.id)} className="text-on-surface-variant hover:text-error"><span className="material-symbols-outlined text-sm">delete</span></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
