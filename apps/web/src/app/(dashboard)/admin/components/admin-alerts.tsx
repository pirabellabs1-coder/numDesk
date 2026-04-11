"use client";

import { useState } from "react";

type Severity = "critical" | "warning" | "info";

interface Alert {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  member?: string;
  workspace?: string;
  time: string;
  acked: boolean;
  icon: string;
}

const INITIAL_ALERTS: Alert[] = [
  { id: "a1", severity: "critical", title: "Quota dépassé", description: "Le workspace 'Voix IA Enterprise' a dépassé son quota de 20 000 min (21 340 min utilisées).", member: "Théo Martin", workspace: "Voix IA Enterprise", time: "Il y a 12 min", acked: false, icon: "warning" },
  { id: "a2", severity: "warning", title: "Quota proche (90%)", description: "Le workspace 'Agence IA Pro' approche son quota mensuel (4 520 / 5 000 min).", member: "Marc Andrieu", workspace: "Agence IA Pro", time: "Il y a 1h", acked: false, icon: "trending_up" },
  { id: "a3", severity: "critical", title: "Webhook en échec répété", description: "https://mon-crm.fr/webhook 5 échecs consécutifs (HTTP 502). Désactivation automatique.", member: "Lucas Dubois", workspace: "BotVoice Pro", time: "Il y a 2h", acked: false, icon: "webhook" },
  { id: "a4", severity: "warning", title: "Latence Cartesia dégradée", description: "P95 Cartesia TTS : 620ms (seuil : 500ms). Surveillance active.", time: "Il y a 3h", acked: false, icon: "speed" },
  { id: "a5", severity: "info", title: "Nouveau membre inscrit", description: "Antoine Leroy (VoicEdge) vient de créer son compte. Essai gratuit démarré.", member: "Antoine Leroy", time: "Il y a 4h", acked: false, icon: "person_add" },
  { id: "a6", severity: "warning", title: "Carte bancaire expirée", description: "Moyen de paiement de Sophie Leroux expire dans 7 jours. Prochaine facture : 149 €.", member: "Sophie Leroux", time: "Il y a 6h", acked: true, icon: "credit_card_off" },
  { id: "a7", severity: "info", title: "Campagne terminée", description: "Campagne 'Onboarding Q2' terminée : 80/80 contacts appelés, 71 succès (89%).", member: "Marc Andrieu", workspace: "Agence IA Pro", time: "Hier 18:00", acked: true, icon: "campaign" },
];

const SEVERITY_STYLE: Record<Severity, string> = {
  critical: "border-error/30 bg-error/5",
  warning: "border-orange-400/30 bg-orange-400/5",
  info: "border-primary/20 bg-primary/5",
};
const SEVERITY_BADGE: Record<Severity, string> = {
  critical: "bg-error/10 text-error",
  warning: "bg-orange-400/10 text-orange-400",
  info: "bg-primary/10 text-primary",
};
const SEVERITY_ICON: Record<Severity, string> = {
  critical: "text-error",
  warning: "text-orange-400",
  info: "text-primary",
};
const SEVERITY_LABEL: Record<Severity, string> = { critical: "Critique", warning: "Avertissement", info: "Information" };

const RULES = [
  { label: "Alerte quota > 80%", enabled: true },
  { label: "Alerte quota > 100%", enabled: true },
  { label: "Webhook en échec > 3x", enabled: true },
  { label: "Latence provider > 500ms", enabled: true },
  { label: "Nouveau membre inscrit", enabled: true },
  { label: "Carte bancaire expirée", enabled: true },
  { label: "Fin de campagne", enabled: false },
  { label: "Agent sans activité 7j", enabled: false },
];

export function AdminAlerts() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const [rules, setRules] = useState(RULES);

  const ack = (id: string) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acked: true } : a));
  const dismiss = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));
  const ackAll = () => setAlerts((prev) => prev.map((a) => ({ ...a, acked: true })));

  const displayed = alerts.filter((a) => filter === "all" || a.severity === filter);
  const unacked = alerts.filter((a) => !a.acked).length;

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* Alerts list */}
      <div className="col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Centre d'alertes</h3>
            {unacked > 0 && (
              <span className="rounded-full bg-error/10 px-2.5 py-0.5 text-[10px] font-bold text-error">{unacked} non lue(s)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 rounded-xl bg-surface-container-low p-1">
              {([["all", "Toutes"], ["critical", "Critiques"], ["warning", "Avertissements"], ["info", "Infos"]] as const).map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setFilter(v)}
                  className={`rounded-lg px-3 py-1 text-[10px] font-bold transition-all ${filter === v ? "bg-surface-container-highest text-on-surface" : "text-on-surface-variant"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            {unacked > 0 && (
              <button onClick={ackAll} className="rounded-lg bg-surface-container-low px-3 py-1.5 text-[10px] font-bold text-on-surface-variant hover:text-on-surface">
                Tout marquer lu
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {displayed.length === 0 && (
            <div className="flex flex-col items-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined mb-3 text-4xl opacity-20">check_circle</span>
              <p className="text-sm">Aucune alerte dans cette catégorie</p>
            </div>
          )}
          {displayed.map((a) => (
            <div key={a.id} className={`rounded-2xl border p-4 transition-all ${SEVERITY_STYLE[a.severity]} ${a.acked ? "opacity-50" : ""}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${SEVERITY_ICON[a.severity]}`}>
                  <span className="material-symbols-outlined">{a.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${SEVERITY_BADGE[a.severity]}`}>
                      {SEVERITY_LABEL[a.severity]}
                    </span>
                    <p className="text-sm font-bold text-on-surface">{a.title}</p>
                    {!a.acked && <span className="h-2 w-2 rounded-full bg-error" />}
                  </div>
                  <p className="mt-1 text-xs text-on-surface-variant">{a.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-on-surface-variant">
                    {a.member && <span><span className="text-on-surface">Membre :</span> {a.member}</span>}
                    {a.workspace && <span><span className="text-on-surface">Workspace :</span> {a.workspace}</span>}
                    <span>{a.time}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {!a.acked && (
                    <button onClick={() => ack(a.id)} className="rounded-lg bg-surface-container-low px-2.5 py-1.5 text-[10px] font-bold text-on-surface-variant hover:text-on-surface">
                      Lu
                    </button>
                  )}
                  <button onClick={() => dismiss(a.id)} className="rounded-lg bg-surface-container-low px-2 py-1.5 text-on-surface-variant hover:text-error">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert rules */}
      <div>
        <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Règles d'alerte</h3>
        <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
          {rules.map((r, i) => (
            <div key={r.label} className={`flex items-center justify-between px-4 py-3.5 ${i !== 0 ? "border-t border-white/5" : ""}`}>
              <p className="text-xs text-on-surface">{r.label}</p>
              <button
                onClick={() => setRules((prev) => prev.map((rr, j) => j === i ? { ...rr, enabled: !rr.enabled } : rr))}
                className={`relative h-5 w-9 rounded-full transition-colors ${r.enabled ? "bg-primary" : "bg-surface-container-high"}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${r.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-surface-container-low p-4 text-xs text-on-surface-variant">
          <p className="font-bold text-on-surface mb-1">Canaux de notification</p>
          <p>• Email admin (activé)</p>
          <p>• Slack webhook (non configuré)</p>
          <p className="mt-2">
            <button className="text-primary hover:underline">Configurer les canaux →</button>
          </p>
        </div>
      </div>
    </div>
  );
}
