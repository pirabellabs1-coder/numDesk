"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@/components/dashboard/sidebar-context";

const pageTitles: Record<string, string> = {
  "/cpme-7f9b2e4d/overview": "Vue d'ensemble",
  "/cpme-7f9b2e4d/monitoring": "Monitoring",
  "/cpme-7f9b2e4d/members": "Membres",
  "/cpme-7f9b2e4d/teams": "Équipes",
  "/cpme-7f9b2e4d/analytics": "Analytiques",
  "/cpme-7f9b2e4d/alerts": "Alertes",
  "/cpme-7f9b2e4d/anomalies": "Anomalies",
  "/cpme-7f9b2e4d/offers": "Offres & Plans",
  "/cpme-7f9b2e4d/trunks": "SIP Trunks",
  "/cpme-7f9b2e4d/contacts": "Contacts",
  "/cpme-7f9b2e4d/leads": "Pipeline Leads",
  "/cpme-7f9b2e4d/templates": "Templates",
  "/cpme-7f9b2e4d/integrations": "Intégrations",
  "/cpme-7f9b2e4d/tags": "Tags",
  "/cpme-7f9b2e4d/quality": "Qualité agents",
  "/cpme-7f9b2e4d/recordings": "Enregistrements",
  "/cpme-7f9b2e4d/keywords": "Mots-clés",
  "/cpme-7f9b2e4d/logs": "Logs",
  "/cpme-7f9b2e4d/revenue": "Revenus",
  "/cpme-7f9b2e4d/voice-studio": "Voice Studio",
  "/cpme-7f9b2e4d/config": "Configuration",
};

export function AdminTopbar() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();
  const title = pageTitles[pathname] || "Administration";

  return (
    <header className={`glass fixed right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 px-4 sm:px-8 transition-all duration-300 ${
      isOpen ? "left-[220px]" : "left-0 pl-16"
    }`}>
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-error/15">
            <span className="material-symbols-outlined text-[14px] text-error">admin_panel_settings</span>
          </div>
          <span className="hidden sm:inline text-sm font-bold uppercase tracking-wider text-error">Admin</span>
        </div>
        <span className="hidden sm:block h-1 w-1 rounded-full bg-white/20" />
        <span className="truncate text-xs uppercase tracking-widest text-on-surface-variant/70">{title}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button className="p-2 text-on-surface-variant transition-opacity hover:opacity-80">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button className="relative p-2 text-on-surface-variant transition-opacity hover:opacity-80">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-surface bg-error" />
        </button>
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-on-surface-variant transition-all hover:border-primary/30 hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Espace client</span>
        </Link>
      </div>
    </header>
  );
}
