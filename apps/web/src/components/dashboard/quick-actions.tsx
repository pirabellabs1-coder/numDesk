"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const actions = [
  { label: "Nouvel agent", icon: "smart_toy", href: "/agents", color: "text-primary" },
  { label: "Nouvelle campagne", icon: "campaign", href: "/campaigns", color: "text-secondary" },
  { label: "Ajouter un numéro", icon: "add_call", href: "/phone-numbers", color: "text-tertiary" },
  { label: "Nouveau contact", icon: "person_add", href: "/contacts", color: "text-primary" },
  { label: "Appel test", icon: "play_circle", href: "/agents", color: "text-orange-400" },
];

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "n" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      <div className="fixed bottom-6 left-[264px] z-50">
        {/* Actions menu */}
        {isOpen && (
          <div className="mb-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-surface/95 shadow-2xl backdrop-blur-xl">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Actions rapides</p>
            </div>
            <div className="p-2">
              {actions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-on-surface-variant transition-all hover:bg-white/[0.04] hover:text-on-surface"
                >
                  <span className={`material-symbols-outlined text-lg ${action.color}`}>{action.icon}</span>
                  <span className="text-sm">{action.label}</span>
                </Link>
              ))}
            </div>
            <div className="border-t border-white/5 px-4 py-2">
              <p className="text-[10px] text-on-surface-variant/50">
                Raccourci : appuyez sur <kbd className="rounded bg-white/5 px-1 py-0.5 font-mono text-[10px]">N</kbd>
              </p>
            </div>
          </div>
        )}

        {/* FAB button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-95 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          <span className="material-symbols-outlined text-2xl text-white">add</span>
        </button>
      </div>
    </>
  );
}
