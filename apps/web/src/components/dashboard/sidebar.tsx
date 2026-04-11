"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Tableau de bord", icon: "dashboard", href: "/dashboard" },
  { label: "Agents", icon: "smart_toy", href: "/agents" },
  { label: "Conversations", icon: "forum", href: "/conversations" },
  { label: "Campagnes", icon: "campaign", href: "/campaigns" },
  { label: "Base de connaissances", icon: "menu_book", href: "/knowledge" },
];

const navItemsBottom = [
  { label: "Numéros", icon: "call", href: "/phone-numbers" },
  { label: "API & Webhooks", icon: "code", href: "/api-webhooks" },
  { label: "Documentation", icon: "description", href: "/docs" },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col bg-surface py-6 px-4">
      {/* Logo */}
      <div className="mb-10 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-primary"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <span className="material-symbols-outlined text-3xl">waves</span>
          <span>Callpme</span>
        </Link>
        <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50">
          Enterprise Workspace
        </div>
      </div>

      {/* Workspace switcher */}
      <div className="mb-8 px-2">
        <button className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-surface-container-low p-3 transition-all duration-300 hover:border-primary/30">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <span className="material-symbols-outlined text-sm text-primary">
                business
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-on-surface">Global Agency</p>
              <p className="text-[10px] text-on-surface-variant">Pro Plan</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">
            unfold_more
          </span>
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-200 ${
              isActive(item.href)
                ? "bg-surface-container-low font-semibold text-primary"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                isActive(item.href) ? "" : "group-hover:text-primary"
              }`}
            >
              {item.icon}
            </span>
            <span
              className="text-sm tracking-wide"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {item.label}
            </span>
          </Link>
        ))}

        <div className="my-2 border-t border-white/5 py-2 opacity-40" />

        {navItemsBottom.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-200 ${
              isActive(item.href)
                ? "bg-surface-container-low font-semibold text-primary"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                isActive(item.href) ? "" : "group-hover:text-primary"
              }`}
            >
              {item.icon}
            </span>
            <span
              className="text-sm tracking-wide"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto space-y-1 border-t border-white/5 pt-6">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-on-surface-variant transition-all duration-200 hover:text-on-surface"
        >
          <span className="material-symbols-outlined">settings</span>
          <span
            className="text-sm tracking-wide"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Paramètres
          </span>
        </Link>

        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/30 bg-surface-container-high text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">person</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-on-surface">
              Alex Rivera
            </p>
            <p className="truncate text-[10px] text-on-surface-variant">
              alex@callpme.ai
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
