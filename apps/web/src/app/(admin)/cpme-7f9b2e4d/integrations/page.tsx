"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/hooks/api-client";
import { PageSkeleton } from "@/components/ui/page-skeleton";

// Static catalog of available integrations
const INTEGRATIONS_CATALOG = [
  { id: "zapier", name: "Zapier", icon: "bolt", category: "Productivité" },
  { id: "google-sheets", name: "Google Sheets", icon: "table_chart", category: "Productivité" },
  { id: "hubspot", name: "HubSpot", icon: "hub", category: "CRM" },
  { id: "salesforce", name: "Salesforce", icon: "cloud", category: "CRM" },
  { id: "slack", name: "Slack", icon: "tag", category: "Communication" },
  { id: "google-calendar", name: "Google Calendar", icon: "calendar_month", category: "Productivité" },
  { id: "make", name: "Make", icon: "settings_suggest", category: "Productivité" },
  { id: "n8n", name: "n8n", icon: "account_tree", category: "Productivité" },
  { id: "pipedrive", name: "Pipedrive", icon: "filter_alt", category: "CRM" },
  { id: "airtable", name: "Airtable", icon: "grid_view", category: "Productivité" },
  { id: "notion", name: "Notion", icon: "edit_note", category: "Productivité" },
  { id: "discord", name: "Discord", icon: "forum", category: "Communication" },
  { id: "teams", name: "Microsoft Teams", icon: "groups", category: "Communication" },
  { id: "whatsapp", name: "WhatsApp Business", icon: "chat", category: "Communication" },
  { id: "webhook", name: "Webhook Custom", icon: "webhook", category: "Productivité" },
];

const statusConfig: Record<string, { label: string; style: string }> = {
  connected: { label: "Connecté", style: "bg-tertiary/10 text-tertiary" },
  available: { label: "Disponible", style: "bg-primary/10 text-primary" },
};

function useAllIntegrations() {
  return useQuery({
    queryKey: ["admin-all-integrations"],
    queryFn: async () => {
      // Fetch all connected integrations across all workspaces
      const connected = await apiFetch<any[]>("/admin/integrations");
      return connected;
    },
  });
}

export default function AdminIntegrationsPage() {
  const { data: connectedList, isLoading } = useAllIntegrations();

  if (isLoading) return <PageSkeleton />;

  // Build a set of connected provider names from real DB data
  const connectedProviders = new Map<string, number>();
  for (const integration of connectedList ?? []) {
    const provider = integration.provider;
    connectedProviders.set(provider, (connectedProviders.get(provider) ?? 0) + 1);
  }

  // Merge catalog with real connection status
  const mergedList = INTEGRATIONS_CATALOG.map((item) => ({
    ...item,
    status: connectedProviders.has(item.id) ? "connected" as const : "available" as const,
    connectionCount: connectedProviders.get(item.id) ?? 0,
  }));

  const connected = mergedList.filter((i) => i.status === "connected").length;
  const available = mergedList.filter((i) => i.status === "available").length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Gestion des intégrations</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Connecteurs de la plateforme — statut en temps réel</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Connectées</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-tertiary" style={{ fontFamily: "Inter, sans-serif" }}>{connected}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Disponibles</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-primary" style={{ fontFamily: "Inter, sans-serif" }}>{available}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Workspaces connectés</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-on-surface-variant" style={{ fontFamily: "Inter, sans-serif" }}>{connectedList?.length ?? 0}</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead><tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <th className="px-6 py-3">Intégration</th><th className="px-6 py-3">Catégorie</th><th className="px-6 py-3">Statut</th><th className="px-6 py-3">Connexions</th>
          </tr></thead>
          <tbody>{mergedList.map((i) => {
            const status = statusConfig[i.status] ?? statusConfig.available!;
            return (
              <tr key={i.id} className="border-b border-white/5 last:border-0">
                <td className="px-6 py-3"><div className="flex items-center gap-3"><span className="material-symbols-outlined text-on-surface-variant">{i.icon}</span><span className="text-sm font-bold text-on-surface">{i.name}</span></div></td>
                <td className="px-6 py-3 text-sm text-on-surface-variant">{i.category}</td>
                <td className="px-6 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status.style}`}>{status.label}</span></td>
                <td className="px-6 py-3 text-sm text-on-surface-variant">{i.connectionCount > 0 ? `${i.connectionCount} workspace${i.connectionCount > 1 ? "s" : ""}` : "—"}</td>
              </tr>
            );
          })}</tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
