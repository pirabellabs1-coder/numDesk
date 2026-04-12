"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const searchablePages = [
  { name: "Tableau de bord", href: "/dashboard", icon: "dashboard", keywords: "accueil home kpi" },
  { name: "Agents", href: "/agents", icon: "smart_toy", keywords: "bot ia agent vocal" },
  { name: "Conversations", href: "/conversations", icon: "forum", keywords: "appels calls transcript" },
  { name: "Contacts", href: "/contacts", icon: "contacts", keywords: "client annuaire" },
  { name: "Leads", href: "/leads", icon: "filter_alt", keywords: "prospect pipeline" },
  { name: "Campagnes", href: "/campaigns", icon: "campaign", keywords: "outbound appels sortants" },
  { name: "Connaissances", href: "/knowledge", icon: "menu_book", keywords: "kb base documents pdf" },
  { name: "Enregistrements", href: "/recordings", icon: "graphic_eq", keywords: "audio replay" },
  { name: "Numéros", href: "/phone-numbers", icon: "call", keywords: "sip twilio telephone" },
  { name: "API & Webhooks", href: "/api-webhooks", icon: "code", keywords: "token webhook api" },
  { name: "Facturation", href: "/billing", icon: "payments", keywords: "credits minutes plan paiement" },
  { name: "Paramètres", href: "/settings", icon: "settings", keywords: "profil config" },
  { name: "Documentation", href: "/docs", icon: "description", keywords: "guide aide" },
  { name: "Équipes", href: "/teams", icon: "groups", keywords: "membres collaborateurs" },
  { name: "Tags", href: "/tags", icon: "label", keywords: "etiquettes" },
  { name: "Qualité", href: "/quality", icon: "speed", keywords: "score performance" },
  { name: "Anomalies", href: "/anomalies", icon: "warning", keywords: "alertes erreurs" },
  { name: "Suggestions IA", href: "/suggestions", icon: "auto_awesome", keywords: "recommandations" },
  { name: "Rapports", href: "/reports", icon: "assessment", keywords: "statistiques export" },
  { name: "Intégrations", href: "/integrations", icon: "extension", keywords: "crm connecteur" },
  { name: "Live", href: "/live", icon: "sensors", keywords: "temps reel direct" },
  { name: "Calendrier", href: "/calendar", icon: "calendar_month", keywords: "planning" },
  { name: "Chat", href: "/chat", icon: "chat", keywords: "message interne" },
  { name: "Notes", href: "/notes", icon: "sticky_note_2", keywords: "memo" },
];

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? searchablePages.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.keywords.toLowerCase().includes(query.toLowerCase())
      )
    : searchablePages.slice(0, 8);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      router.push(filtered[selectedIndex].href);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] bg-black/60" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-white/5 bg-surface shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher une page, fonctionnalité..."
            className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
          />
          <kbd className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-on-surface-variant">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-on-surface-variant">
              Aucun résultat pour &quot;{query}&quot;
            </p>
          ) : (
            filtered.map((page, i) => (
              <button
                key={page.href}
                onClick={() => { router.push(page.href); onClose(); }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-all ${
                  i === selectedIndex
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{page.icon}</span>
                <span className="text-sm">{page.name}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-white/5 px-5 py-2.5">
          <span className="text-[10px] text-on-surface-variant/40">
            <kbd className="rounded bg-white/5 px-1.5 py-0.5 text-[10px]">↑↓</kbd> naviguer
          </span>
          <span className="text-[10px] text-on-surface-variant/40">
            <kbd className="rounded bg-white/5 px-1.5 py-0.5 text-[10px]">↵</kbd> ouvrir
          </span>
        </div>
      </div>
    </div>
  );
}
