"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../dashboard/sidebar-context";

const navItems = [
  { label: "Vue d'ensemble", icon: "dashboard", href: "/admin/overview" },
  { label: "Monitoring", icon: "monitor_heart", href: "/admin/monitoring", badge: "LIVE" },
  { label: "Membres", icon: "group", href: "/admin/members" },
  { label: "Équipes", icon: "groups", href: "/admin/teams" },
  { label: "Analytiques", icon: "insert_chart", href: "/admin/analytics" },
  { label: "Alertes", icon: "notifications_active", href: "/admin/alerts" },
  { label: "Anomalies", icon: "warning", href: "/admin/anomalies" },
  { label: "Offres & Plans", icon: "sell", href: "/admin/offers" },
  { label: "SIP Trunks", icon: "router", href: "/admin/trunks" },
  { label: "Contacts", icon: "contacts", href: "/admin/contacts" },
  { label: "Leads", icon: "filter_alt", href: "/admin/leads" },
  { label: "Templates", icon: "content_copy", href: "/admin/templates" },
  { label: "Intégrations", icon: "extension", href: "/admin/integrations" },
  { label: "Tags", icon: "label", href: "/admin/tags" },
  { label: "Qualité", icon: "speed", href: "/admin/quality" },
  { label: "Enregistrements", icon: "graphic_eq", href: "/admin/recordings" },
  { label: "Mots-clés", icon: "text_fields", href: "/admin/keywords" },
  { label: "Logs", icon: "terminal", href: "/admin/logs", badge: "LIVE" },
  { label: "Revenus", icon: "payments", href: "/admin/revenue" },
  { label: "Voice Studio", icon: "graphic_eq", href: "/admin/voice-studio" },
  { label: "Configuration", icon: "tune", href: "/admin/config" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggle}
        className="fixed left-4 top-4 z-[60] flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant transition-all hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-xl">
          {isOpen ? "menu_open" : "menu"}
        </span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={toggle} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/5 bg-surface transition-all duration-300 ${
        isOpen ? "w-[220px] px-3 opacity-100" : "w-0 -translate-x-full overflow-hidden opacity-0"
      } py-4`}>
        {/* Logo + Admin badge */}
        <div className="mb-3 mt-10 px-3">
          <Link href="/admin/overview" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-primary">
            <span className="material-symbols-outlined text-2xl">waves</span>
            <span>Callpme</span>
          </Link>
          <div className="mt-1 flex items-center gap-1.5">
            <div className="flex h-4 w-4 items-center justify-center rounded bg-error/15">
              <span className="material-symbols-outlined text-[10px] text-error">admin_panel_settings</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-error">Administration</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-[1px] overflow-y-auto scrollbar-none">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-2.5 rounded-lg px-3 py-[6px] transition-all ${
                isActive(item.href)
                  ? "bg-surface-container-low font-semibold text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${isActive(item.href) ? "" : "group-hover:text-primary"}`}>
                {item.icon}
              </span>
              <span className="flex-1 text-[13px]">{item.label}</span>
              {"badge" in item && item.badge && (
                <span className={`rounded px-1 py-px text-[7px] font-bold tracking-wider ${
                  isActive(item.href) ? "bg-tertiary/15 text-tertiary" : "bg-white/5 text-on-surface-variant"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 space-y-[1px] pt-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-lg px-3 py-[6px] text-on-surface-variant transition-all hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="text-[13px]">Espace client</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2.5 rounded-lg px-3 py-[6px] text-on-surface-variant transition-all hover:text-error"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-[13px]">Déconnexion</span>
          </Link>

          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-error/30 bg-surface-container-high text-on-surface-variant">
              <span className="material-symbols-outlined text-xs">shield_person</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-on-surface">Alex Rivera</p>
              <p className="truncate text-[9px] text-error/80">Administrateur</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
