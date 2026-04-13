"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FocusModeToggle } from "@/components/dashboard/focus-mode";
import { useSidebar } from "@/components/dashboard/sidebar-context";
import { SearchModal } from "@/components/dashboard/search-modal";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/live": "Appels en direct",
  "/agents": "Agents",
  "/conversations": "Conversations",
  "/contacts": "Contacts",
  "/leads": "Pipeline Leads",
  "/campaigns": "Campagnes",
  "/templates": "Templates",
  "/knowledge": "Base de connaissances",
  "/recordings": "Enregistrements",
  "/calendar": "Calendrier",
  "/chat": "Chat interne",
  "/notes": "Notes d'appels",
  "/teams": "Équipes",
  "/tags": "Tags",
  "/favorites": "Favoris",
  "/quality": "Score de qualité",
  "/anomalies": "Anomalies",
  "/suggestions": "Suggestions IA",
  "/activity": "Journal d'activité",
  "/reports": "Rapports",
  "/geo": "Carte géographique",
  "/compare": "Comparaison",
  "/keywords": "Mots-clés",
  "/integrations": "Intégrations",
  "/phone-numbers": "Numéros",
  "/api-webhooks": "API & Webhooks",
  "/billing": "Facturation",
  "/settings": "Paramètres",
  "/docs": "Documentation",
};

const actionButtons: Record<string, { label: string; href: string; icon: string }> = {
  "/agents": { label: "Créer un agent", href: "/agents/new", icon: "add" },
  "/campaigns": { label: "Nouvelle campagne", href: "/campaigns/new", icon: "add" },
  "/conversations": { label: "Actualiser", href: "#", icon: "refresh" },
  "/knowledge": { label: "Nouvelle base", href: "/knowledge/new", icon: "add" },
  "/phone-numbers": { label: "Ajouter un numéro", href: "/phone-numbers", icon: "add" },
  "/dashboard": { label: "Créer un agent", href: "/agents/new", icon: "add" },
  "/billing": { label: "Acheter des minutes", href: "/billing", icon: "add" },
};

export function Topbar() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const basePath = "/" + (pathname.split("/")[1] || "dashboard");
  const title = pageTitles[basePath] || "Dashboard";
  const action = actionButtons[basePath];

  // Keyboard shortcut: Cmd/Ctrl + K for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className={`glass fixed right-0 top-0 z-40 flex h-12 items-center justify-between border-b border-white/10 px-3 transition-all duration-300 sm:h-14 sm:px-4 md:px-8 ${
        isOpen ? "left-0 pl-14 lg:left-[220px] lg:pl-8" : "left-0 pl-14 sm:pl-16"
      }`}>
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <span
            className="hidden text-sm font-semibold text-on-surface-variant sm:inline sm:text-base md:text-lg"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Callpme
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:inline" />
          <span className="truncate text-[10px] uppercase tracking-widest text-on-surface-variant/70 sm:text-xs">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-white/5 p-1.5 text-on-surface-variant transition-all hover:bg-white/10 sm:gap-2 sm:px-3 sm:py-1.5"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">search</span>
            <span className="hidden text-xs md:inline">Rechercher</span>
            <kbd className="hidden rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-on-surface-variant/50 md:inline">
              Ctrl+K
            </kbd>
          </button>

          <span className="hidden sm:inline"><FocusModeToggle /></span>

          {/* Notifications button */}
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-1.5 text-on-surface-variant transition-opacity hover:opacity-80 sm:p-2"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-tertiary text-[8px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {action && (
            <Link
              href={action.href}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-br from-primary to-secondary px-2.5 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-primary/20 active:scale-95 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">{action.icon}</span>
              <span className="hidden sm:inline">{action.label}</span>
            </Link>
          )}
        </div>
      </header>

      {/* Search modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Notifications panel */}
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} onUnreadCountChange={setUnreadCount} />
    </>
  );
}
