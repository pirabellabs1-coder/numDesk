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
  "/phone-numbers": { label: "Ajouter un numéro", href: "/phone-numbers/new", icon: "add" },
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
      <header className={`glass fixed right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 px-8 transition-all duration-300 ${
        isOpen ? "left-[220px]" : "left-0 pl-16"
      }`}>
        <div className="flex items-center gap-4">
          <span
            className="text-lg font-semibold text-on-surface-variant"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Callpme Agency
          </span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span className="text-xs uppercase tracking-widest text-on-surface-variant/70">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-on-surface-variant transition-all hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-lg">search</span>
            <span className="hidden text-xs md:inline">Rechercher</span>
            <kbd className="hidden rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-on-surface-variant/50 md:inline">
              Ctrl+K
            </kbd>
          </button>

          <FocusModeToggle />

          {/* Notifications button */}
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-on-surface-variant transition-opacity hover:opacity-80"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-tertiary text-[8px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {action && (
            <Link
              href={action.href}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-primary to-secondary px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:shadow-primary/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">{action.icon}</span>
              <span>{action.label}</span>
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
