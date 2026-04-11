"use client";

import { useState } from "react";

const PLANS = ["Starter", "Pro", "Agency", "Enterprise"];

interface Member {
  id: string;
  name: string;
  email: string;
  agency: string;
  plan: string;
  workspaces: number;
  minutesUsed: number;
  minutesTotal: number;
  status: "active" | "suspended" | "trial";
  joinedAt: string;
  lastLogin: string;
  mrr: number;
}

const MEMBERS: Member[] = [
  { id: "1", name: "Marc Andrieu", email: "marc@agence-ia.fr", agency: "Agence IA Pro", plan: "Agency", workspaces: 4, minutesUsed: 2340, minutesTotal: 5000, status: "active", joinedAt: "Jan 2026", lastLogin: "Il y a 2h", mrr: 349 },
  { id: "2", name: "Sophie Leroux", email: "sophie@callbot.fr", agency: "CallBot Agency", plan: "Pro", workspaces: 2, minutesUsed: 890, minutesTotal: 2000, status: "active", joinedAt: "Fév 2026", lastLogin: "Il y a 1j", mrr: 149 },
  { id: "3", name: "Théo Martin", email: "theo@voix-ia.fr", agency: "Voix IA", plan: "Enterprise", workspaces: 7, minutesUsed: 5120, minutesTotal: 20000, status: "active", joinedAt: "Jan 2026", lastLogin: "Aujourd'hui", mrr: 999 },
  { id: "4", name: "Emma Bernard", email: "emma@ia-solutions.fr", agency: "IA Solutions", plan: "Starter", workspaces: 1, minutesUsed: 210, minutesTotal: 500, status: "suspended", joinedAt: "Mars 2026", lastLogin: "Il y a 15j", mrr: 0 },
  { id: "5", name: "Lucas Dubois", email: "lucas@botvoice.fr", agency: "BotVoice", plan: "Pro", workspaces: 3, minutesUsed: 1680, minutesTotal: 2000, status: "active", joinedAt: "Fév 2026", lastLogin: "Il y a 3h", mrr: 149 },
  { id: "6", name: "Clara Petit", email: "clara@callpro.fr", agency: "CallPro", plan: "Agency", workspaces: 5, minutesUsed: 3200, minutesTotal: 5000, status: "active", joinedAt: "Mars 2026", lastLogin: "Il y a 30min", mrr: 349 },
  { id: "7", name: "Antoine Leroy", email: "antoine@voicedge.fr", agency: "VoicEdge", plan: "Starter", workspaces: 1, minutesUsed: 380, minutesTotal: 500, status: "trial", joinedAt: "Avr 2026", lastLogin: "Aujourd'hui", mrr: 0 },
];

const STATUS_STYLE: Record<string, string> = {
  active: "bg-tertiary/10 text-tertiary",
  suspended: "bg-error/10 text-error",
  trial: "bg-secondary/10 text-secondary",
};
const STATUS_LABEL: Record<string, string> = { active: "Actif", suspended: "Suspendu", trial: "Essai" };

const PLAN_COLORS: Record<string, string> = {
  Starter: "text-on-surface-variant",
  Pro: "text-primary",
  Agency: "text-secondary",
  Enterprise: "text-orange-400",
};

export function AdminMembers() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [allocModal, setAllocModal] = useState<Member | null>(null);
  const [planModal, setPlanModal] = useState<Member | null>(null);
  const [detailPanel, setDetailPanel] = useState<Member | null>(null);
  const [allocMinutes, setAllocMinutes] = useState("");
  const [newPlan, setNewPlan] = useState("");
  const [actionDone, setActionDone] = useState(false);
  const [members, setMembers] = useState(MEMBERS);

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()) || m.agency.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "Tous" || m.plan === planFilter;
    const matchStatus = statusFilter === "Tous" || m.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const handleToggleStatus = (id: string) => {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, status: m.status === "active" ? "suspended" : "active" } : m));
  };

  const handleConfirm = () => {
    setActionDone(true);
    setTimeout(() => { setActionDone(false); setAllocModal(null); setPlanModal(null); setAllocMinutes(""); setNewPlan(""); }, 1500);
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-sm">search</span>
          <input
            className="input-field pl-9"
            placeholder="Rechercher par nom, email, agence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field w-36" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
          <option>Tous</option>
          {PLANS.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select className="input-field w-36" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>Tous</option>
          <option value="active">Actifs</option>
          <option value="suspended">Suspendus</option>
          <option value="trial">Essai</option>
        </select>
        <span className="text-xs text-on-surface-variant whitespace-nowrap">{filtered.length} membre(s)</span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low/50">
              {["Membre", "Plan", "Workspaces", "Minutes", "Statut", "MRR", "Actions"].map((h) => (
                <th key={h} className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((m) => {
              const pct = Math.round((m.minutesUsed / m.minutesTotal) * 100);
              return (
                <tr key={m.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-bold text-primary shrink-0">
                        {m.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-on-surface leading-tight">{m.name}</p>
                        <p className="text-[10px] text-on-surface-variant">{m.agency}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold ${PLAN_COLORS[m.plan]}`}>{m.plan}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-on-surface">{m.workspaces}</td>
                  <td className="px-5 py-3.5">
                    <div className="w-24">
                      <div className="flex justify-between text-[10px] text-on-surface-variant mb-1">
                        <span>{m.minutesUsed.toLocaleString("fr-FR")}</span>
                        <span className={pct >= 90 ? "text-error" : pct >= 70 ? "text-orange-400" : "text-on-surface-variant"}>{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-container-high">
                        <div
                          className={`h-full rounded-full ${pct >= 90 ? "bg-error" : pct >= 70 ? "bg-orange-400" : "bg-gradient-to-r from-primary to-tertiary"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[m.status]}`}>
                      {STATUS_LABEL[m.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold text-on-surface">{m.mrr > 0 ? `${m.mrr} €` : "—"}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setDetailPanel(m)} className="rounded-lg bg-surface-container-low px-2.5 py-1.5 text-[10px] font-bold text-on-surface-variant hover:text-on-surface">
                        Voir
                      </button>
                      <button onClick={() => setAllocModal(m)} className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-[10px] font-bold text-primary hover:bg-primary/20">
                        + Min
                      </button>
                      <button onClick={() => { setPlanModal(m); setNewPlan(m.plan); }} className="rounded-lg bg-secondary/10 px-2.5 py-1.5 text-[10px] font-bold text-secondary hover:bg-secondary/20">
                        Plan
                      </button>
                      <button onClick={() => handleToggleStatus(m.id)} className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${m.status === "active" ? "bg-error/10 text-error hover:bg-error/20" : "bg-tertiary/10 text-tertiary hover:bg-tertiary/20"}`}>
                        {m.status === "active" ? "Susp." : "Activer"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Allocation modal */}
      {allocModal && (
        <Modal title="Allouer des minutes" onClose={() => { setAllocModal(null); setAllocMinutes(""); }}>
          <p className="mb-4 text-sm text-on-surface-variant">Ajouter des minutes à <span className="font-bold text-on-surface">{allocModal.name}</span></p>
          <input type="number" className="input-field" placeholder="ex: 500" value={allocMinutes} onChange={(e) => setAllocMinutes(e.target.value)} />
          {actionDone && <p className="mt-3 text-xs text-tertiary font-bold">✓ {allocMinutes} minutes ajoutées !</p>}
          <div className="mt-5 flex gap-3">
            <button onClick={() => { setAllocModal(null); setAllocMinutes(""); }} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-bold text-on-surface-variant">Annuler</button>
            <button onClick={handleConfirm} disabled={!allocMinutes} className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary py-2.5 text-sm font-bold text-white disabled:opacity-40">Confirmer</button>
          </div>
        </Modal>
      )}

      {/* Plan modal */}
      {planModal && (
        <Modal title="Changer de plan" onClose={() => setPlanModal(null)}>
          <p className="mb-4 text-sm text-on-surface-variant">Plan actuel de <span className="font-bold text-on-surface">{planModal.name}</span> : <span className={`font-bold ${PLAN_COLORS[planModal.plan]}`}>{planModal.plan}</span></p>
          <select className="input-field" value={newPlan} onChange={(e) => setNewPlan(e.target.value)}>
            {PLANS.map((p) => <option key={p}>{p}</option>)}
          </select>
          {actionDone && <p className="mt-3 text-xs text-tertiary font-bold">✓ Plan mis à jour vers {newPlan} !</p>}
          <div className="mt-5 flex gap-3">
            <button onClick={() => setPlanModal(null)} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-bold text-on-surface-variant">Annuler</button>
            <button onClick={handleConfirm} className="flex-1 rounded-lg bg-gradient-to-r from-secondary to-primary py-2.5 text-sm font-bold text-white">Appliquer</button>
          </div>
        </Modal>
      )}

      {/* Detail side panel */}
      {detailPanel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setDetailPanel(null)} />
          <div className="w-96 overflow-y-auto bg-surface border-l border-white/10 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>{detailPanel.name}</h2>
              <button onClick={() => setDetailPanel(null)} className="text-on-surface-variant"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-xl font-bold text-white">
              {detailPanel.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="space-y-3">
              {[
                ["Agence", detailPanel.agency],
                ["Email", detailPanel.email],
                ["Plan", detailPanel.plan],
                ["Statut", STATUS_LABEL[detailPanel.status]],
                ["Workspaces", String(detailPanel.workspaces)],
                ["Minutes utilisées", `${detailPanel.minutesUsed.toLocaleString("fr-FR")} / ${detailPanel.minutesTotal.toLocaleString("fr-FR")}`],
                ["Membre depuis", detailPanel.joinedAt],
                ["Dernière connexion", detailPanel.lastLogin],
                ["MRR", detailPanel.mrr > 0 ? `${detailPanel.mrr} €/mois` : "Aucun"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">{k}</span>
                  <span className="font-medium text-on-surface">{v}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-white/5">
              <button onClick={() => setAllocModal(detailPanel)} className="w-full rounded-lg bg-primary/10 py-2.5 text-sm font-bold text-primary">+ Ajouter des minutes</button>
              <button onClick={() => { setPlanModal(detailPanel); setNewPlan(detailPanel.plan); }} className="w-full rounded-lg bg-secondary/10 py-2.5 text-sm font-bold text-secondary">Changer de plan</button>
              <button onClick={() => { handleToggleStatus(detailPanel.id); setDetailPanel(null); }} className={`w-full rounded-lg py-2.5 text-sm font-bold ${detailPanel.status === "active" ? "bg-error/10 text-error" : "bg-tertiary/10 text-tertiary"}`}>
                {detailPanel.status === "active" ? "Suspendre le compte" : "Réactiver le compte"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>{title}</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined">close</span></button>
        </div>
        {children}
      </div>
    </div>
  );
}
