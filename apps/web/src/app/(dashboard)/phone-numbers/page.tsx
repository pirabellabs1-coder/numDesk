"use client";

import { useState } from "react";
import { mockPhoneNumbers } from "@/lib/mock-data";

export default function PhoneNumbersPage() {
  const [tab, setTab] = useState<"sip" | "twilio">("sip");

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
            Numéros
          </h1>
          <p className="mt-2 text-on-surface-variant">{mockPhoneNumbers.filter((n) => n.isActive).length} numéros actifs</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add</span>
          Ajouter un numéro SIP
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-white/5">
        {[
          { id: "sip", label: "SIP Trunk Numbers" },
          { id: "twilio", label: "Twilio (deprecated)" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as "sip" | "twilio")}
            className={`border-b-2 px-6 py-3 text-sm font-bold tracking-wide transition-all ${
              tab === t.id ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "sip" && (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                {["Numéro", "Trunk SIP", "Nom", "Agent assigné", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockPhoneNumbers.map((num) => (
                <tr key={num.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-mono text-sm text-on-surface">{num.number}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{num.trunkName}</td>
                  <td className="px-6 py-4 text-sm text-on-surface">{num.friendlyName}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{num.assignedAgent ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      num.isActive ? "bg-tertiary/10 text-tertiary" : "bg-white/5 text-on-surface-variant"
                    }`}>
                      {num.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-on-surface-variant hover:text-error">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "twilio" && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-card py-16">
          <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant/20">phone_disabled</span>
          <p className="text-sm text-on-surface-variant">L&apos;intégration Twilio est maintenue pour rétrocompatibilité uniquement.</p>
        </div>
      )}
    </section>
  );
}
