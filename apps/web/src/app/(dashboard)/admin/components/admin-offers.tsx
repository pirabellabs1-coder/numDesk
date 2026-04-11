"use client";

import { useState } from "react";

interface Offer {
  id: string;
  name: string;
  price: number;
  minutesIncluded: number;
  overageRate: number;
  maxAgents: number;
  maxWorkspaces: number;
  features: string[];
  color: string;
  activeMembers: number;
  mrr: number;
}

const INITIAL_OFFERS: Offer[] = [
  { id: "starter", name: "Starter", price: 49, minutesIncluded: 500, overageRate: 0.12, maxAgents: 2, maxWorkspaces: 1, features: ["Cartesia TTS", "Gemini Flash", "1 SIP trunk"], color: "from-on-surface-variant to-on-surface-variant", activeMembers: 3, mrr: 147 },
  { id: "pro", name: "Pro", price: 149, minutesIncluded: 2000, overageRate: 0.08, maxAgents: 10, maxWorkspaces: 3, features: ["Cartesia + ElevenLabs", "GPT-4o option", "Webhooks", "API REST"], color: "from-primary to-secondary", activeMembers: 8, mrr: 1192 },
  { id: "agency", name: "Agency", price: 349, minutesIncluded: 5000, overageRate: 0.06, maxAgents: 50, maxWorkspaces: 15, features: ["Tous providers TTS", "Tous LLMs", "White-label", "Campagnes"], color: "from-secondary to-tertiary", activeMembers: 5, mrr: 1745 },
  { id: "enterprise", name: "Enterprise", price: 999, minutesIncluded: 20000, overageRate: 0.04, maxAgents: 999, maxWorkspaces: 999, features: ["Tout illimité", "SLA 99.9%", "Support dédié", "Onboarding"], color: "from-orange-400 to-error", activeMembers: 2, mrr: 1998 },
];

export function AdminOffers() {
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [editModal, setEditModal] = useState<Offer | null>(null);
  const [editData, setEditData] = useState<Partial<Offer>>({});
  const [saved, setSaved] = useState(false);

  const openEdit = (o: Offer) => { setEditModal(o); setEditData({ price: o.price, minutesIncluded: o.minutesIncluded, overageRate: o.overageRate, maxAgents: o.maxAgents, maxWorkspaces: o.maxWorkspaces }); };

  const handleSave = () => {
    if (!editModal) return;
    setOffers((prev) => prev.map((o) => o.id === editModal.id ? { ...o, ...editData } : o));
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditModal(null); }, 1500);
  };

  const totalMrr = offers.reduce((s, o) => s + o.mrr, 0);

  return (
    <div className="space-y-6">
      {/* MRR summary */}
      <div className="grid grid-cols-4 gap-4">
        {offers.map((o) => (
          <div key={o.id} className="rounded-2xl border border-white/5 bg-card p-4 text-center">
            <p className={`text-sm font-bold bg-gradient-to-r ${o.color} bg-clip-text text-transparent`}>{o.name}</p>
            <p className="mt-2 text-2xl font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>{o.activeMembers}</p>
            <p className="text-[10px] text-on-surface-variant">membres actifs</p>
            <p className="mt-2 text-sm font-bold text-tertiary">{o.mrr} €</p>
            <p className="text-[10px] text-on-surface-variant">MRR</p>
          </div>
        ))}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-2 gap-5">
        {offers.map((o) => (
          <div key={o.id} className="rounded-2xl border border-white/5 bg-card overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${o.color}`} />
            <div className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className={`text-xl font-bold bg-gradient-to-r ${o.color} bg-clip-text text-transparent`} style={{ fontFamily: "Syne, sans-serif" }}>{o.name}</h3>
                  <p className="mt-1 text-3xl font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>{o.price} <span className="text-sm font-normal text-on-surface-variant">€/mois</span></p>
                </div>
                <button onClick={() => openEdit(o)} className="rounded-lg bg-surface-container-low px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <div className="space-y-2 mb-4 text-xs text-on-surface-variant">
                <div className="flex justify-between"><span>Minutes incluses</span><span className="font-bold text-on-surface">{o.minutesIncluded.toLocaleString("fr-FR")} min</span></div>
                <div className="flex justify-between"><span>Tarif dépassement</span><span className="font-bold text-on-surface">{o.overageRate.toFixed(2)} €/min</span></div>
                <div className="flex justify-between"><span>Agents max</span><span className="font-bold text-on-surface">{o.maxAgents === 999 ? "Illimité" : o.maxAgents}</span></div>
                <div className="flex justify-between"><span>Workspaces max</span><span className="font-bold text-on-surface">{o.maxWorkspaces === 999 ? "Illimité" : o.maxWorkspaces}</span></div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {o.features.map((f) => (
                  <span key={f} className="rounded-md bg-surface-container-low px-2 py-1 text-[10px] text-on-surface-variant">{f}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/5 bg-card p-4 flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">MRR total tous plans confondus</p>
        <p className="text-2xl font-bold text-tertiary" style={{ fontFamily: "Syne, sans-serif" }}>{totalMrr.toLocaleString("fr-FR")} €</p>
      </div>

      {/* Edit modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Modifier — {editModal.name}</h2>
              <button onClick={() => setEditModal(null)} className="text-on-surface-variant"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Prix mensuel (€)", key: "price" as const, type: "number" },
                { label: "Minutes incluses", key: "minutesIncluded" as const, type: "number" },
                { label: "Tarif dépassement (€/min)", key: "overageRate" as const, type: "number" },
                { label: "Agents max", key: "maxAgents" as const, type: "number" },
                { label: "Workspaces max", key: "maxWorkspaces" as const, type: "number" },
              ].map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">{f.label}</label>
                  <input
                    type={f.type}
                    className="input-field"
                    value={editData[f.key] ?? ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, [f.key]: f.key === "overageRate" ? parseFloat(e.target.value) : parseInt(e.target.value) }))}
                  />
                </div>
              ))}
            </div>
            {saved && <p className="mt-3 text-xs text-tertiary font-bold">✓ Plan {editModal.name} mis à jour !</p>}
            <div className="mt-5 flex gap-3">
              <button onClick={() => setEditModal(null)} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-bold text-on-surface-variant">Annuler</button>
              <button onClick={handleSave} className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary py-2.5 text-sm font-bold text-white">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
