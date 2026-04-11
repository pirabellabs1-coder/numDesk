"use client";

import { useState } from "react";

interface Trunk {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  region: string;
  status: "active" | "inactive" | "testing";
  membersUsing: number;
  numbersCount: number;
  callsToday: number;
  isGlobal: boolean;
}

const INITIAL_TRUNKS: Trunk[] = [
  { id: "t1", name: "Trunk Principal FR", host: "sip.telnyx.com", port: 5060, username: "user_fr_main", region: "Paris, FR", status: "active", membersUsing: 12, numbersCount: 34, callsToday: 420, isGlobal: true },
  { id: "t2", name: "Trunk Backup EU", host: "sip.zadarma.com", port: 5060, username: "user_eu_backup", region: "Amsterdam, NL", status: "active", membersUsing: 5, numbersCount: 8, callsToday: 45, isGlobal: true },
  { id: "t3", name: "Trunk Test / Staging", host: "sip-test.telnyx.com", port: 5060, username: "user_test", region: "Paris, FR", status: "testing", membersUsing: 0, numbersCount: 2, callsToday: 12, isGlobal: false },
];

const STATUS_STYLE: Record<string, string> = {
  active: "bg-tertiary/10 text-tertiary",
  inactive: "bg-white/5 text-on-surface-variant",
  testing: "bg-secondary/10 text-secondary",
};
const STATUS_LABEL: Record<string, string> = { active: "Actif", inactive: "Inactif", testing: "Test" };

export function AdminTrunks() {
  const [trunks, setTrunks] = useState(INITIAL_TRUNKS);
  const [showForm, setShowForm] = useState(false);
  const [testModal, setTestModal] = useState<Trunk | null>(null);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "fail">("idle");
  const [showPassword, setShowPassword] = useState(false);

  const handleTest = () => {
    setTestStatus("testing");
    setTimeout(() => setTestStatus("success"), 2000);
  };

  const toggleGlobal = (id: string) => setTrunks((prev) => prev.map((t) => t.id === id ? { ...t, isGlobal: !t.isGlobal } : t));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>SIP Trunks globaux</h3>
          <p className="text-xs text-on-surface-variant mt-1">Trunks partagés disponibles pour tous les membres de la plateforme</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add</span>
          Ajouter un Trunk
        </button>
      </div>

      {/* Trunks */}
      <div className="space-y-4">
        {trunks.map((t) => (
          <div key={t.id} className="rounded-2xl border border-white/5 bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-low">
                  <span className="material-symbols-outlined text-on-surface-variant">router</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-on-surface">{t.name}</h4>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[t.status]}`}>{STATUS_LABEL[t.status]}</span>
                    {t.isGlobal && <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">Global</span>}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1">
                    {[
                      ["Host", `${t.host}:${t.port}`],
                      ["Région", t.region],
                      ["Utilisateur", t.username],
                      ["Mot de passe", "••••••••••"],
                    ].map(([k, v]) => (
                      <p key={k} className="text-xs text-on-surface-variant">
                        <span className="font-bold text-on-surface">{k} :</span> <span className="font-mono">{v}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setTestModal(t)} className="rounded-lg bg-surface-container-low px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined text-sm">network_check</span>
                </button>
                <button className="rounded-lg bg-surface-container-low px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button className="rounded-lg bg-error/10 px-3 py-1.5 text-xs font-bold text-error hover:bg-error/20">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {[
                { label: "Membres utilisant", value: t.membersUsing, icon: "group" },
                { label: "Numéros actifs", value: t.numbersCount, icon: "dialpad" },
                { label: "Appels aujourd'hui", value: t.callsToday, icon: "call" },
                { label: "Trunk global", value: t.isGlobal ? "Oui" : "Non", icon: "public" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-surface-container-low px-3 py-2.5 text-center">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">{s.icon}</span>
                  <p className="mt-0.5 text-sm font-bold text-on-surface">{s.value}</p>
                  <p className="text-[10px] text-on-surface-variant">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => toggleGlobal(t.id)}
                className="text-xs text-on-surface-variant hover:text-primary"
              >
                {t.isGlobal ? "Retirer du catalogue global" : "Rendre disponible globalement"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add trunk modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Nouveau SIP Trunk Global</h2>
              <button onClick={() => setShowForm(false)} className="text-on-surface-variant"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Nom du trunk", placeholder: "ex: Trunk Entreprise EU" },
                { label: "Région", placeholder: "ex: Paris, FR" },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">{f.label}</label>
                  <input className="input-field" placeholder={f.placeholder} />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">Hôte SIP</label>
                  <input className="input-field" placeholder="sip.provider.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">Port</label>
                  <input className="input-field" defaultValue="5060" type="number" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Nom d'utilisateur</label>
                <input className="input-field" placeholder="username" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Mot de passe</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} className="input-field pr-10" placeholder="••••••••" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                <p className="text-[10px] text-on-surface-variant">Chiffré AES-256 au repos</p>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isGlobal" defaultChecked className="rounded" />
                <label htmlFor="isGlobal" className="text-xs text-on-surface-variant">Rendre ce trunk disponible pour tous les membres</label>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-bold text-on-surface-variant">Annuler</button>
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary py-2.5 text-sm font-bold text-white">Ajouter le trunk</button>
            </div>
          </div>
        </div>
      )}

      {/* Test modal */}
      {testModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Tester le trunk</h2>
              <button onClick={() => { setTestModal(null); setTestStatus("idle"); }} className="text-on-surface-variant"><span className="material-symbols-outlined">close</span></button>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">Trunk : <span className="font-bold text-on-surface">{testModal.name}</span></p>
            <p className="font-mono text-xs text-on-surface-variant mb-5">{testModal.host}:{testModal.port}</p>
            {testStatus === "idle" && (
              <button onClick={handleTest} className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary py-3 text-sm font-bold text-white">
                Lancer le test de connexion SIP
              </button>
            )}
            {testStatus === "testing" && (
              <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-4">
                <span className="animate-spin material-symbols-outlined text-primary">progress_activity</span>
                <p className="text-sm text-on-surface-variant">Test en cours...</p>
              </div>
            )}
            {testStatus === "success" && (
              <div className="rounded-xl bg-tertiary/5 border border-tertiary/20 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">check_circle</span>
                  <p className="text-sm font-bold text-tertiary">Connexion réussie !</p>
                </div>
                <div className="text-xs text-on-surface-variant space-y-1">
                  <p>✓ Résolution DNS : <span className="text-on-surface">OK (12ms)</span></p>
                  <p>✓ Connexion TCP : <span className="text-on-surface">OK (18ms)</span></p>
                  <p>✓ Auth SIP : <span className="text-on-surface">OK</span></p>
                  <p>✓ OPTIONS ping : <span className="text-on-surface">200 OK (24ms)</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
