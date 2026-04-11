"use client";

import { useState } from "react";
import { mockApiTokens, mockWebhooks } from "@/lib/mock-data";

export default function ApiWebhooksPage() {
  const [tab, setTab] = useState("tokens");
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);

  const generateToken = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const rand = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setNewToken(`cmp_${rand}`);
    setShowTokenModal(false);
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
          API & Webhooks
        </h1>
        <p className="mt-2 text-on-surface-variant">Intégrez Callpme dans votre workflow</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-white/5">
        {[
          { id: "tokens", label: "Tokens API" },
          { id: "providers", label: "Token Providers" },
          { id: "webhooks", label: "Webhooks" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-6 py-3 text-sm font-bold tracking-wide transition-all ${
              tab === t.id ? "border-primary text-primary" : "border-transparent text-on-surface-variant"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "tokens" && (
        <div className="space-y-4">
          {newToken && (
            <div className="rounded-xl border border-tertiary/20 bg-tertiary/5 p-4">
              <p className="mb-2 text-xs font-bold text-tertiary">Token créé — copiez-le maintenant, il ne sera plus affiché !</p>
              <div className="flex items-center gap-3 rounded-lg bg-surface-container-lowest p-3 font-mono text-sm text-on-surface">
                <span className="flex-1 truncate">{newToken}</span>
                <button onClick={() => navigator.clipboard.writeText(newToken)} className="text-primary hover:underline text-xs">
                  Copier
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setShowTokenModal(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Créer un token
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  {["Nom", "Préfixe", "Dernière utilisation", "Créé le", ""].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockApiTokens.map((tok) => (
                  <tr key={tok.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 text-sm font-medium text-on-surface">{tok.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{tok.prefix}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{tok.lastUsed}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{tok.createdAt}</td>
                    <td className="px-6 py-4">
                      <button className="rounded-lg bg-error/10 px-3 py-1 text-xs font-bold text-error hover:bg-error/20">
                        Révoquer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "providers" && (
        <div className="space-y-4">
          {[
            { label: "ElevenLabs API Key", placeholder: "sk-el-..." },
            { label: "OpenAI API Key", placeholder: "sk-..." },
            { label: "Cartesia API Key", placeholder: "cart-..." },
          ].map((f) => (
            <div key={f.label} className="rounded-2xl border border-white/5 bg-card p-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">{f.label}</label>
              <div className="flex gap-3">
                <input type="password" placeholder={f.placeholder} className="input-field flex-1" />
                <button className="rounded-lg bg-surface-container-low px-4 text-sm font-bold text-on-surface-variant hover:text-on-surface">
                  Sauvegarder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "webhooks" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white">
              <span className="material-symbols-outlined text-sm">add</span>
              Ajouter un webhook
            </button>
          </div>

          {mockWebhooks.map((wh) => (
            <div key={wh.id} className="rounded-2xl border border-white/5 bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm text-on-surface">{wh.url}</p>
                  <div className="mt-2 flex gap-2">
                    {wh.events.map((e) => (
                      <span key={e} className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-on-surface-variant">{wh.lastTriggered}</span>
                  <span className="rounded bg-tertiary/10 px-2 py-0.5 text-xs font-bold text-tertiary">
                    {wh.lastStatus}
                  </span>
                  <button className="text-on-surface-variant hover:text-error">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create token modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-6">
            <h2 className="mb-4 text-lg font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Créer un token API</h2>
            <div className="space-y-1.5 mb-5">
              <label className="text-xs font-semibold text-on-surface-variant">Nom du token</label>
              <input className="input-field" placeholder="Production API" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowTokenModal(false)} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-bold text-on-surface-variant">
                Annuler
              </button>
              <button onClick={generateToken} className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary py-2.5 text-sm font-bold text-white">
                Générer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
