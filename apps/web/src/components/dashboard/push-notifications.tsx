"use client";

import { useEffect, useState } from "react";

export function PushNotificationInit() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setPermission(Notification.permission);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw-notifications.js").catch(() => {});
    }

    // Request permission if not yet decided
    if (Notification.permission === "default") {
      // Wait a bit before requesting to not annoy user on first load
      const timer = setTimeout(() => {
        Notification.requestPermission().then((p) => setPermission(p));
      }, 10000); // 10 seconds after page load
      return () => clearTimeout(timer);
    }
  }, []);

  return null; // No UI — just registers the SW
}

/**
 * Send a browser push notification (client-side)
 */
export function sendBrowserNotification(title: string, body: string, link?: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const notif = new Notification(title, {
    body,
    icon: "/favicon.ico",
    tag: "callpme-" + Date.now(),
  });

  if (link) {
    notif.onclick = () => {
      window.focus();
      window.location.href = link;
    };
  }
}
