"use client";

import { useState } from "react";
import { mockCampaigns } from "@/lib/mock-data";

const statusStyles: Record<string, string> = {
  active: "bg-tertiary/10 text-tertiary",
  paused: "bg-orange-400/10 text-orange-400",
  completed: "bg-white/5 text-on-surface-variant",
  draft: "bg-secondary/10 text-secondary",
  failed: "bg-error/10 text-error",
};

export default function CampaignsPage() {
  const [showModal, setShowModal] = useState(false);

  const total = mockCampaigns.reduce((acc, c) => acc + c.totalContacts, 0);
  const success = mockCampaigns.reduce((acc, c) => acc + c.successCount, 0);
  const active = mockCampaigns.filter((c) => c.status === "active").length;

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
            Campagnes
          </h1>
          <p className="mt-2 text-on-surface-variant">{active} campagne(s) active(s)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white"
        >
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
            <div className={`mb-2 ${s.color}`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{s.label}</p>
            <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Campaigns list */}
      <div className="space-y-4">
        {mockCampaigns.map((camp) => {
          const pct = Math.round((camp.calledCount / camp.totalContacts) * 100);
          return (
            <div key={camp.id} className="rounded-2xl border border-white/5 bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
                    {camp.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant">{camp.agentName} · {camp.scheduledAt}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[camp.status]}`}>
                    {camp.statusLabel}
                  </span>
                  <div className="flex gap-1">
                    {camp.status === "active" && (
                      <button className="rounded-lg bg-surface-container-low p-2 text-on-surface-variant hover:text-orange-400">
                        <span className="material-symbols-outlined text-sm">pause</span>
                      </button>
                    )}
                    {camp.status === "paused" && (
                      <button className="rounded-lg bg-surface-container-low p-2 text-on-surface-variant hover:text-tertiary">
                        <span className="material-symbols-outlined text-sm">play_arrow</span>
                      </button>
                    )}
                    <button className="rounded-lg bg-surface-container-low p-2 text-on-surface-variant hover:text-error">
                      <span className="material-symbols-outlined text-sm">stop</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-surface-container-low">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>{camp.calledCount} / {camp.totalContacts} contacts appelés</span>
                <span>{pct}% · {camp.successCount} succès</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
                Nouvelle Campagne
              </h2>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Nom de la campagne", type: "text", placeholder: "Relance Prospects" },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} className="input-field" />
                </div>
              ))}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Agent</label>
                <select className="input-field">
                  <option>Agent Support FR</option>
                  <option>Sales Assistant</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">Début plage horaire</label>
                  <input type="time" defaultValue="09:00" className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">Fin plage horaire</label>
                  <input type="time" defaultValue="18:00" className="input-field" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Contacts (CSV)</label>
                <div className="rounded-xl border-2 border-dashed border-white/10 p-6 text-center">
                  <span className="material-symbols-outlined mb-2 text-3xl text-on-surface-variant/30">upload_file</span>
                  <p className="text-xs text-on-surface-variant">Glissez votre fichier CSV ici</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-bold text-on-surface-variant">
                Annuler
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary py-2.5 text-sm font-bold text-white">
                Créer la campagne
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
