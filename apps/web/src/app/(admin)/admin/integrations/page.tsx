"use client";

// Integration definitions (static catalog)
const integrationsList = [
  { id: "zapier", name: "Zapier", icon: "bolt", category: "Productivité", status: "available" },
  { id: "google-sheets", name: "Google Sheets", icon: "table_chart", category: "Productivité", status: "available" },
  { id: "hubspot", name: "HubSpot", icon: "hub", category: "CRM", status: "available" },
  { id: "salesforce", name: "Salesforce", icon: "cloud", category: "CRM", status: "available" },
  { id: "slack", name: "Slack", icon: "tag", category: "Communication", status: "available" },
  { id: "google-calendar", name: "Google Calendar", icon: "calendar_month", category: "Productivité", status: "available" },
  { id: "make", name: "Make", icon: "settings_suggest", category: "Productivité", status: "available" },
  { id: "n8n", name: "n8n", icon: "account_tree", category: "Productivité", status: "available" },
  { id: "pipedrive", name: "Pipedrive", icon: "filter_alt", category: "CRM", status: "available" },
  { id: "airtable", name: "Airtable", icon: "grid_view", category: "Productivité", status: "available" },
  { id: "notion", name: "Notion", icon: "edit_note", category: "Productivité", status: "available" },
  { id: "discord", name: "Discord", icon: "forum", category: "Communication", status: "available" },
  { id: "teams", name: "Microsoft Teams", icon: "groups", category: "Communication", status: "available" },
  { id: "whatsapp", name: "WhatsApp Business", icon: "chat", category: "Communication", status: "available" },
  { id: "webhook", name: "Webhook Custom", icon: "webhook", category: "Productivité", status: "available" },
];

const statusConfig: Record<string, { label: string; style: string }> = {
  connected: { label: "Connecté", style: "bg-tertiary/10 text-tertiary" },
  available: { label: "Disponible", style: "bg-primary/10 text-primary" },
  soon: { label: "Bientôt", style: "bg-white/5 text-on-surface-variant" },
};

export default function AdminIntegrationsPage() {
  const connected = integrationsList.filter((i) => i.status === "connected").length;
  const available = integrationsList.filter((i) => i.status === "available").length;
  const soon = integrationsList.filter((i) => i.status === "soon").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Gestion des intégrations</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Contrôle des connecteurs de la plateforme</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Connectées</p>
          <p className="mt-1 text-3xl font-bold text-tertiary" style={{ fontFamily: "Inter, sans-serif" }}>{connected}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Disponibles</p>
          <p className="mt-1 text-3xl font-bold text-primary" style={{ fontFamily: "Inter, sans-serif" }}>{available}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Bientôt</p>
          <p className="mt-1 text-3xl font-bold text-on-surface-variant" style={{ fontFamily: "Inter, sans-serif" }}>{soon}</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
        <table className="w-full">
          <thead><tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <th className="px-6 py-3">Intégration</th><th className="px-6 py-3">Catégorie</th><th className="px-6 py-3">Statut</th><th className="px-6 py-3">Actions</th>
          </tr></thead>
          <tbody>{integrationsList.map((i) => {
            const status = statusConfig[i.status]!;
            return (
              <tr key={i.id} className="border-b border-white/5 last:border-0">
                <td className="px-6 py-3"><div className="flex items-center gap-3"><span className="material-symbols-outlined text-on-surface-variant">{i.icon}</span><span className="text-sm font-bold text-on-surface">{i.name}</span></div></td>
                <td className="px-6 py-3 text-sm text-on-surface-variant">{i.category}</td>
                <td className="px-6 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status.style}`}>{status.label}</span></td>
                <td className="px-6 py-3"><button className={`text-xs font-bold ${i.status === "soon" ? "text-on-surface-variant/40" : "text-primary hover:underline"}`}>{i.status === "soon" ? "Non disponible" : "Configurer"}</button></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}
