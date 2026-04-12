// Callpme Notification Service Worker
self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Callpme";
  const options = {
    body: data.message || "",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: data.type || "default",
    data: { url: data.link || "/dashboard" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard";
  event.waitUntil(clients.openWindow(url));
});
