"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminSipTrunks, useCreateSipTrunk, useDeleteSipTrunk } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function SipConfigPage() {
  const { data: trunks, isLoading, error } = useAdminSipTrunks();
  const createTrunk = useCreateSipTrunk();
  const deleteTrunk = useDeleteSipTrunk();
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", host: "", port: "5060", username: "", password: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (isLoading) return <PageSkeleton />;

  const handleSave = () => {
    createTrunk.mutate(
      { name: formData.name, host: formData.host, port: parseInt(formData.port) || 5060, username: formData.username, password: formData.password },
      {
        onSuccess: () => {
          setShowForm(false);
          setFormData({ name: "", host: "", port: "5060", username: "", password: "" });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteTrunk.mutate(id, { onSuccess: () => setDeleteConfirm(null) });
  };

  const trunkList = trunks ?? [];

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="mb-1">
            <Link href="/phone-numbers" className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Retour aux numéros
            </Link>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
            Configuration SIP
          </h1>
          <p className="mt-2 text-on-surface-variant">Gérez vos SIP trunks pour les appels entrants et sortants</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nouveau Trunk
        </button>
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-primary">info</span>
          <div>
            <p className="text-sm font-bold text-on-surface">Comment ça fonctionne</p>
            <p className="mt-1 text-xs text-on-surface-variant">
              Les SIP trunks permettent de connecter vos numéros de téléphone à Callpme.
              Les credentials sont chiffrés AES-256 au repos et ne sont jamais exposés côté client.
            </p>
          </div>
        </div>
      </div>

      {/* Trunks list */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
          Trunks configurés ({trunkList.length})
        </h2>

        {error && (
          <div className="rounded-xl border border-error/20 bg-error/5 p-4 text-sm text-error">
            Erreur lors du chargement des trunks.
          </div>
        )}

        {trunkList.length === 0 && !error ? (
          <div className="rounded-2xl border border-white/5 bg-card p-12 text-center">
            <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant/30">dns</span>
            <p className="text-on-surface-variant">Aucun SIP trunk configuré.</p>
            <p className="mt-1 text-xs text-on-surface-variant/60">Ajoutez un trunk pour connecter vos numéros de téléphone.</p>
          </div>
        ) : (
          trunkList.map((trunk: any) => (
            <div key={trunk.id} className="rounded-2xl border border-white/5 bg-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
                      {trunk.name}
                    </h3>
                    {trunk.isGlobal && (
                      <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                        Global
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="font-mono text-sm text-on-surface-variant">
                      <span className="text-on-surface-variant/50 mr-2">Host</span>
                      {trunk.host}:{trunk.port}
                    </p>
                    <p className="font-mono text-sm text-on-surface-variant">
                      <span className="text-on-surface-variant/50 mr-2">User</span>
                      {trunk.username}
                    </p>
                    <p className="font-mono text-sm text-on-surface-variant">
                      <span className="text-on-surface-variant/50 mr-2">Pass</span>
                      ••••••••••••
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {deleteConfirm === trunk.id ? (
                    <>
                      <button onClick={() => handleDelete(trunk.id)} className="rounded-lg bg-error px-3 py-2 text-xs font-bold text-white">
                        Confirmer
                      </button>
                      <button onClick={() => setDeleteConfirm(null)} className="rounded-lg bg-surface-container-low px-3 py-2 text-xs font-bold text-on-surface-variant">
                        Annuler
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(trunk.id)}
                      className="rounded-lg bg-error/10 px-3 py-2 text-xs font-bold text-error hover:bg-error/20"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add trunk form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
                Ajouter un SIP Trunk
              </h2>
              <button onClick={() => setShowForm(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Nom du trunk</label>
                <input className="input-field" placeholder="ex: Trunk Principal FR" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">Hôte SIP</label>
                  <input className="input-field" placeholder="sip.provider.com" value={formData.host} onChange={(e) => setFormData({ ...formData, host: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">Port</label>
                  <input className="input-field" value={formData.port} onChange={(e) => setFormData({ ...formData, port: e.target.value })} type="number" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Nom d'utilisateur SIP</label>
                <input className="input-field" placeholder="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Mot de passe SIP</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                <p className="text-[10px] text-on-surface-variant">Chiffré AES-256 — jamais stocké en clair</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-bold text-on-surface-variant"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={createTrunk.isPending || !formData.name || !formData.host}
                className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {createTrunk.isPending ? "Enregistrement..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
