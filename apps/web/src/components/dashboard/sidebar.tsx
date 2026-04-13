"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
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
  const { workspace, workspaces, ownedWorkspaces, sharedWorkspaces, setActiveWorkspace } = useWorkspace();
  const { user, signOut } = useAuth();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Close switcher on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    if (switcherOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [switcherOpen]);

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
        <div className="relative mb-2 px-1" ref={switcherRef}>
          <button
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-surface-container-low px-2.5 py-2 transition-all hover:border-primary/30"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${workspace?.isOwned ? "bg-primary/20" : "bg-secondary/20"}`}>
                <span className={`material-symbols-outlined text-xs ${workspace?.isOwned ? "text-primary" : "text-secondary"}`}>
                  {workspace?.isOwned ? "business" : "group"}
                </span>
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate text-[11px] font-bold text-on-surface">{workspace?.name || "Workspace"}</p>
                <p className="text-[9px] text-on-surface-variant">{workspace?.isOwned ? "Personnel" : "Partagé"}</p>
              </div>
            </div>
            <span className={`material-symbols-outlined text-sm text-on-surface-variant transition-transform ${switcherOpen ? "rotate-180" : ""}`}>unfold_more</span>
          </button>

          {/* Dropdown */}
          {switcherOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-white/10 bg-surface/95 shadow-2xl backdrop-blur-xl">
              {/* Espace personnel */}
              {ownedWorkspaces.length > 0 && (
                <div>
                  <p className="px-3 pb-1 pt-2.5 text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Espace personnel
                  </p>
                  {ownedWorkspaces.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => { setActiveWorkspace(w.id); setSwitcherOpen(false); }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-all hover:bg-white/[0.04] ${w.id === workspace?.id ? "bg-primary/5" : ""}`}
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/20">
                        <span className="material-symbols-outlined text-[10px] text-primary">business</span>
                      </div>
                      <span className="truncate text-[11px] text-on-surface">{w.name}</span>
                      {w.id === workspace?.id && (
                        <span className="material-symbols-outlined ml-auto text-xs text-primary">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Espaces partagés */}
              {sharedWorkspaces.length > 0 && (
                <div className={ownedWorkspaces.length > 0 ? "border-t border-white/5" : ""}>
                  <p className="px-3 pb-1 pt-2.5 text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Espaces partagés
                  </p>
                  {sharedWorkspaces.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => { setActiveWorkspace(w.id); setSwitcherOpen(false); }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-all hover:bg-white/[0.04] ${w.id === workspace?.id ? "bg-secondary/5" : ""}`}
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-secondary/20">
                        <span className="material-symbols-outlined text-[10px] text-secondary">group</span>
                      </div>
                      <span className="truncate text-[11px] text-on-surface">{w.name}</span>
                      {w.id === workspace?.id && (
                        <span className="material-symbols-outlined ml-auto text-xs text-secondary">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t border-white/5 p-1.5">
                <p className="px-2 py-1 text-[9px] text-on-surface-variant/50">
                  {workspaces.length} workspace{workspaces.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}
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
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-[6px] text-on-surface-variant transition-all hover:text-error"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-[13px]">Déconnexion</span>
          </button>

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
