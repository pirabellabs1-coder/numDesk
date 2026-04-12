"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./sidebar-context";
import { useWorkspace } from "@/providers/workspace-provider";
import { useAuth } from "@/providers/auth-provider";
import { PLANS, type PlanSlug } from "@vocalia/shared";

// "pro" = requires Pro plan, "starter" = requires at least Starter
const navItems = [
  { label: "Tableau de bord", icon: "dashboard", href: "/dashboard" },
  { label: "Live", icon: "sensors", href: "/live", badge: "LIVE" },
  { label: "Agents", icon: "smart_toy", href: "/agents" },
  { label: "Conversations", icon: "forum", href: "/conversations" },
  { label: "Contacts", icon: "contacts", href: "/contacts" },
  { label: "Leads", icon: "filter_alt", href: "/leads" },
  { label: "Campagnes", icon: "campaign", href: "/campaigns", requiresPlan: "pro" as const },
  { label: "Templates", icon: "content_copy", href: "/templates" },
  { label: "Connaissances", icon: "menu_book", href: "/knowledge", requiresPlan: "pro" as const },
  { label: "Enregistrements", icon: "graphic_eq", href: "/recordings", requiresPlan: "pro" as const },
  { label: "Calendrier", icon: "calendar_month", href: "/calendar" },
  { label: "Chat", icon: "chat", href: "/chat" },
  { label: "Notes", icon: "sticky_note_2", href: "/notes" },
  { label: "Équipes", icon: "groups", href: "/teams" },
  { label: "Tags", icon: "label", href: "/tags" },
  { label: "Favoris", icon: "star", href: "/favorites" },
  { label: "Qualité", icon: "speed", href: "/quality", requiresPlan: "pro" as const },
  { label: "Anomalies", icon: "warning", href: "/anomalies" },
  { label: "Suggestions IA", icon: "auto_awesome", href: "/suggestions" },
  { label: "Activité", icon: "history", href: "/activity" },
  { label: "Rapports", icon: "assessment", href: "/reports", requiresPlan: "pro" as const },
  { label: "Carte", icon: "map", href: "/geo", requiresPlan: "pro" as const },
  { label: "Comparaison", icon: "compare_arrows", href: "/compare", requiresPlan: "pro" as const },
  { label: "Mots-clés", icon: "text_fields", href: "/keywords", requiresPlan: "pro" as const },
  { label: "Intégrations", icon: "extension", href: "/integrations", requiresPlan: "starter" as const },
  { label: "Numéros", icon: "call", href: "/phone-numbers" },
  { label: "API & Webhooks", icon: "code", href: "/api-webhooks", requiresPlan: "starter" as const },
  { label: "Documentation", icon: "description", href: "/docs" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();
  const { workspace } = useWorkspace();
  const { user } = useAuth();

  const planSlug = ((workspace as any)?.planSlug as PlanSlug) || "trial";

  const meta = user?.user_metadata || {};
  const firstName = meta.first_name || meta.full_name?.split(" ")[0] || "";
  const lastName = meta.last_name || meta.full_name?.split(" ").slice(1).join(" ") || "";
  const displayName = `${firstName} ${lastName}`.trim() || user?.email?.split("@")[0] || "Utilisateur";
  const userEmail = user?.email || "";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const isLocked = (item: typeof navItems[0]) => {
    if (!("requiresPlan" in item) || !item.requiresPlan) return false;
    if (item.requiresPlan === "pro") return planSlug !== "pro" && planSlug !== "enterprise";
    if (item.requiresPlan === "starter") return planSlug === "trial";
    return false;
  };

  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={toggle}
        className="fixed left-4 top-4 z-[60] flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant transition-all hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-xl">
          {isOpen ? "menu_open" : "menu"}
        </span>
      </button>

      {/* Overlay on mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={toggle} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/5 bg-surface transition-all duration-300 ${
        isOpen ? "w-[220px] px-3 opacity-100" : "w-0 -translate-x-full overflow-hidden opacity-0"
      } py-4`}>
        {/* Logo */}
        <div className="mb-3 mt-10 px-3">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-primary">
            <span className="material-symbols-outlined text-2xl">waves</span>
            <span>Callpme</span>
          </Link>
        </div>

        {/* Workspace switcher */}
        <div className="mb-2 px-1">
          <button className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-surface-container-low px-2.5 py-2 transition-all hover:border-primary/30">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20">
                <span className="material-symbols-outlined text-xs text-primary">business</span>
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-on-surface">Global Agency</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-sm text-on-surface-variant">unfold_more</span>
          </button>
        </div>

        {/* Navigation - scrollable if needed */}
        <nav className="flex-1 space-y-[1px] overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const locked = isLocked(item);
            return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-2.5 rounded-lg px-3 py-[6px] transition-all ${
                locked
                  ? "text-on-surface-variant/40"
                  : isActive(item.href)
                    ? "bg-surface-container-low font-semibold text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${locked ? "opacity-40" : isActive(item.href) ? "" : "group-hover:text-primary"}`}>
                {locked ? "lock" : item.icon}
              </span>
              <span className={`flex-1 text-[13px] ${locked ? "opacity-50" : ""}`}>{item.label}</span>
              {locked && (
                <span className={`rounded px-1 py-px text-[7px] font-bold tracking-wider uppercase ${
                  ("requiresPlan" in item && item.requiresPlan === "starter") ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                }`}>
                  {("requiresPlan" in item && item.requiresPlan === "starter") ? "Starter" : "Pro"}
                </span>
              )}
              {!locked && "badge" in item && item.badge && (
                <span className={`rounded px-1 py-px text-[7px] font-bold tracking-wider ${
                  isActive(item.href) ? "bg-tertiary/15 text-tertiary" : "bg-white/5 text-on-surface-variant"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
            );
          })}
        </nav>

        {/* Footer - always visible */}
        <div className="shrink-0 space-y-[1px] pt-2">
          <Link
            href="/billing"
            className={`flex items-center gap-2.5 rounded-lg px-3 py-[6px] transition-all ${
              isActive("/billing")
                ? "bg-surface-container-low font-semibold text-primary"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">payments</span>
            <span className="text-[13px]">Facturation</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2.5 rounded-lg px-3 py-[6px] text-on-surface-variant transition-all hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span className="text-[13px]">Paramètres</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2.5 rounded-lg px-3 py-[6px] text-on-surface-variant transition-all hover:text-error"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-[13px]">Déconnexion</span>
          </Link>

          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-surface-container-high text-on-surface-variant">
              <span className="material-symbols-outlined text-xs">person</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-on-surface">{displayName}</p>
              <p className="truncate text-[9px] text-on-surface-variant">{userEmail}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
