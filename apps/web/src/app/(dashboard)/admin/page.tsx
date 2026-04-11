"use client";

import { useState } from "react";
import { AdminKpis } from "./components/admin-kpis";
import { AdminMonitoring } from "./components/admin-monitoring";
import { AdminMembers } from "./components/admin-members";
import { AdminAnalytics } from "./components/admin-analytics";
import { AdminAlerts } from "./components/admin-alerts";
import { AdminOffers } from "./components/admin-offers";
import { AdminTrunks } from "./components/admin-trunks";
import { AdminLogs } from "./components/admin-logs";
import { AdminRevenue } from "./components/admin-revenue";
import { AdminConfig } from "./components/admin-config";

type Section =
  | "kpis"
  | "monitoring"
  | "members"
  | "analytics"
  | "alerts"
  | "offers"
  | "trunks"
  | "logs"
  | "revenue"
  | "config";

const NAV: Array<{
  id: Section;
  label: string;
  icon: string;
  description: string;
  badge?: string;
}> = [
  { id: "kpis", label: "Vue d'ensemble", icon: "dashboard", description: "KPIs plateforme & santé globale" },
  { id: "monitoring", label: "Monitoring", icon: "monitor_heart", description: "Providers en temps réel", badge: "LIVE" },
  { id: "members", label: "Membres", icon: "group", description: "Gestion des comptes membres" },
  { id: "analytics", label: "Analytiques", icon: "insert_chart", description: "Appels, sentiments, heatmap" },
  { id: "alerts", label: "Alertes", icon: "notifications_active", description: "Centre de notification & règles" },
  { id: "offers", label: "Offres & Plans", icon: "sell", description: "Tarifs et paramètres des plans" },
  { id: "trunks", label: "SIP Trunks", icon: "router", description: "Trunks globaux de la plateforme" },
  { id: "logs", label: "Logs", icon: "terminal", description: "Journal d'événements en temps réel", badge: "LIVE" },
  { id: "revenue", label: "Revenus", icon: "payments", description: "MRR, ARR, factures" },
  { id: "config", label: "Configuration", icon: "tune", description: "LLMs, TTS, limites globales" },
];

const SECTION_TITLES: Record<Section, { title: string; subtitle: string }> = {
  kpis: { title: "Vue d'ensemble", subtitle: "Métriques clés et santé de la plateforme Callpme" },
  monitoring: { title: "Monitoring en temps réel", subtitle: "Latence et disponibilité des providers tiers" },
  members: { title: "Gestion des membres", subtitle: "Comptes, plans, quotas et allocations" },
  analytics: { title: "Analytiques", subtitle: "Activité des appels, sentiments et performances" },
  alerts: { title: "Centre d'alertes", subtitle: "Notifications, règles et canaux de diffusion" },
  offers: { title: "Offres & Tarifs", subtitle: "Configurer les plans et les prix de la plateforme" },
  trunks: { title: "SIP Trunks globaux", subtitle: "Infrastructure téléphonie partagée de la plateforme" },
  logs: { title: "Journal des événements", subtitle: "Flux d'événements en temps réel — toute la plateforme" },
  revenue: { title: "Revenus & Facturation", subtitle: "MRR, ARR, dépassements et historique des factures" },
  config: { title: "Configuration IA", subtitle: "Modèles LLM, providers TTS et limites globales" },
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>("kpis");

  const { title, subtitle } = SECTION_TITLES[activeSection];

  return (
    <div className="flex h-full gap-0">
      {/* Admin sidebar nav */}
      <aside className="w-56 shrink-0 border-r border-white/5 bg-surface/60 pr-0">
        {/* Admin badge */}
        <div className="px-4 py-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-error/10">
              <span className="material-symbols-outlined text-sm text-error">admin_panel_settings</span>
            </div>
            <div>
              <p className="text-xs font-bold text-error uppercase tracking-wider">Admin</p>
              <p className="text-[10px] text-on-surface-variant">Callpme Platform</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="px-2 py-3 space-y-0.5">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`group w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all ${
                activeSection === item.id
                  ? "bg-surface-container-low text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface"
              }`}
            >
              <span className={`material-symbols-outlined text-base shrink-0 ${
                activeSection === item.id ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface"
              }`}>
                {item.icon}
              </span>
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className={`rounded px-1 py-px text-[8px] font-bold tracking-wider ${
                  activeSection === item.id ? "bg-tertiary/15 text-tertiary" : "bg-white/5 text-on-surface-variant"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto px-8 py-8 min-w-0">
        {/* Section header */}
        <div className="mb-7">
          <h1
            className="text-3xl font-bold tracking-tight text-on-surface"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {title}
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>
        </div>

        {/* Rendered section */}
        {activeSection === "kpis" && <AdminKpis />}
        {activeSection === "monitoring" && <AdminMonitoring />}
        {activeSection === "members" && <AdminMembers />}
        {activeSection === "analytics" && <AdminAnalytics />}
        {activeSection === "alerts" && <AdminAlerts />}
        {activeSection === "offers" && <AdminOffers />}
        {activeSection === "trunks" && <AdminTrunks />}
        {activeSection === "logs" && <AdminLogs />}
        {activeSection === "revenue" && <AdminRevenue />}
        {activeSection === "config" && <AdminConfig />}
      </main>
    </div>
  );
}
