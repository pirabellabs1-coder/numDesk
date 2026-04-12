"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/hooks/api-client";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

const typeConfig: Record<string, { icon: string; color: string }> = {
  call: { icon: "call", color: "text-tertiary" },
  credit: { icon: "payments", color: "text-[#FF7F3F]" },
  campaign: { icon: "campaign", color: "text-secondary" },
  agent: { icon: "smart_toy", color: "text-primary" },
  system: { icon: "info", color: "text-primary" },
  anomaly: { icon: "warning", color: "text-error" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  return `Il y a ${days} jours`;
}

export function NotificationsPanel({ open, onClose, onUnreadCountChange }: NotificationsPanelProps) {
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch<{ notifications: Notification[]; unreadCount: number }>("/notifications?limit=30");
      setItems(res.notifications);
      setUnreadCount(res.unreadCount);
      onUnreadCountChange?.(res.unreadCount);
    } catch {
      // Silently fail
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchNotifications();
    }
  }, [open]);

  // Poll for new notifications every 30s when panel is closed
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await apiFetch<{ notifications: Notification[]; unreadCount: number }>("/notifications?limit=1&unread=true");
        setUnreadCount(res.unreadCount);
        onUnreadCountChange?.(res.unreadCount);
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await apiFetch("/notifications", { method: "PATCH", body: JSON.stringify({ markAll: true }) });
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      onUnreadCountChange?.(0);
    } catch {}
  };

  const markOneRead = async (id: string) => {
    try {
      await apiFetch("/notifications", { method: "PATCH", body: JSON.stringify({ ids: [id] }) });
      setItems((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
      onUnreadCountChange?.(Math.max(0, unreadCount - 1));
    } catch {}
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" onClick={onClose}>
      <div
        className="absolute right-4 top-14 w-96 rounded-2xl border border-white/5 bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold text-on-surface">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-tertiary/10 px-2 py-0.5 text-[10px] font-bold text-tertiary">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] font-bold text-primary hover:underline"
              >
                Tout marquer comme lu
              </button>
            )}
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">notifications_off</span>
              <p className="mt-2 text-sm text-on-surface-variant">Aucune notification</p>
            </div>
          ) : (
            items.map((n) => {
              const cfg = typeConfig[n.type] || typeConfig["system"]!;
              const content = (
                <div
                  className={`flex gap-3 border-b border-white/5 px-5 py-3.5 transition-colors last:border-0 hover:bg-white/[0.02] ${
                    !n.isRead ? "bg-primary/[0.03]" : ""
                  }`}
                  onClick={() => { if (!n.isRead) markOneRead(n.id); }}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    !n.isRead ? "bg-white/5" : "bg-white/[0.02]"
                  }`}>
                    <span className={`material-symbols-outlined text-base ${cfg.color}`}>
                      {cfg.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.isRead ? "font-semibold text-on-surface" : "text-on-surface-variant"}`}>
                      {n.title}
                    </p>
                    {n.message && (
                      <p className="mt-0.5 text-xs text-on-surface-variant line-clamp-2">{n.message}</p>
                    )}
                    <p className="mt-1 text-[10px] text-on-surface-variant/50">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.isRead && (
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
              );

              return n.link ? (
                <Link key={n.id} href={n.link} onClick={onClose}>{content}</Link>
              ) : (
                <div key={n.id}>{content}</div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
