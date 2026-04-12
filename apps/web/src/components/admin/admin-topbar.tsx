"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@/components/dashboard/sidebar-context";

const pageTitles: Record<string, string> = {
  "/admin/overview": "Vue d'ensemble",
  "/admin/monitoring": "Monitoring",
  "/admin/members": "Membres",
  "/admin/teams": "Équipes",
  "/admin/analytics": "Analytiques",
  "/admin/alerts": "Alertes",
  "/admin/anomalies": "Anomalies",
  "/admin/offers": "Offres & Plans",
  "/admin/trunks": "SIP Trunks",
  "/admin/contacts": "Contacts",
  "/admin/leads": "Pipeline Leads",
  "/admin/templates": "Templates",
  "/admin/integrations": "Intégrations",
  "/admin/tags": "Tags",
  "/admin/quality": "Qualité agents",
  "/admin/recordings": "Enregistrements",
  "/admin/keywords": "Mots-clés",
  "/admin/logs": "Logs",
  "/admin/revenue": "Revenus",
  "/admin/voice-studio": "Voice Studio",
  "/admin/config": "Configuration",
};

export function AdminTopbar() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();
  const title = pageTitles[pathname] || "Administration";

  return (
    <header className={`glass fixed right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 px-8 transition-all duration-300 ${
      isOpen ? "left-[220px]" : "left-0 pl-16"
    }`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-error/15">
            <span className="material-symbols-outlined text-[14px] text-error">admin_panel_settings</span>
          </div>
          <span className="text-sm font-bold uppercase tracking-wider text-error">Admin</span>
        </div>
        <span className="h-1 w-1 rounded-full bg-white/20" />
        <span className="text-xs uppercase tracking-widest text-on-surface-variant/70">{title}</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface-variant transition-opacity hover:opacity-80">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button className="relative p-2 text-on-surface-variant transition-opacity hover:opacity-80">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-surface bg-error" />
        </button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-on-surface-variant transition-all hover:border-primary/30 hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Espace client</span>
        </Link>
      </div>
    </header>
  );
}
