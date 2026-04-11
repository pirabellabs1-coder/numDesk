"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/agents": "Agents",
  "/conversations": "Conversations",
  "/campaigns": "Campagnes",
  "/knowledge": "Base de connaissances",
  "/phone-numbers": "Numéros",
  "/api-webhooks": "API & Webhooks",
  "/billing": "Facturation",
  "/settings": "Paramètres",
  "/admin": "Administration",
};

const actionButtons: Record<string, { label: string; href: string; icon: string }> = {
  "/agents": { label: "Créer un agent", href: "/agents/new", icon: "add" },
  "/campaigns": { label: "Nouvelle campagne", href: "/campaigns/new", icon: "add" },
  "/conversations": { label: "Actualiser", href: "#", icon: "refresh" },
  "/knowledge": { label: "Nouvelle base", href: "/knowledge/new", icon: "add" },
  "/phone-numbers": { label: "Ajouter un numéro", href: "/phone-numbers/new", icon: "add" },
  "/dashboard": { label: "Créer un agent", href: "/agents/new", icon: "add" },
};

export function Topbar() {
  const pathname = usePathname();
  const basePath = "/" + (pathname.split("/")[1] || "dashboard");
  const title = pageTitles[basePath] || "Dashboard";
  const action = actionButtons[basePath];

  return (
    <header className="glass fixed left-[240px] right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 px-8">
      <div className="flex items-center gap-4">
        <span
          className="text-lg font-semibold text-on-surface-variant"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Callpme Agency
        </span>
        <span className="h-1 w-1 rounded-full bg-white/20" />
        <span className="text-xs uppercase tracking-widest text-on-surface-variant/70">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface-variant transition-opacity hover:opacity-80">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button className="relative p-2 text-on-surface-variant transition-opacity hover:opacity-80">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-surface bg-tertiary" />
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
  );
}
