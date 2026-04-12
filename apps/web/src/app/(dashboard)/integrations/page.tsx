"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/hooks/api-client";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";

type IntegrationDef = {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "CRM" | "Productivité" | "Communication";
  configFields: { key: string; label: string; placeholder: string; type?: string }[];
};

const allIntegrations: IntegrationDef[] = [
  { id: "zapier", name: "Zapier", icon: "bolt", description: "Connectez Callpme à 5000+ applications via des Zaps automatisés.", category: "Productivité", configFields: [{ key: "webhookUrl", label: "URL du Zap", placeholder: "https://hooks.zapier.com/hooks/catch/..." }] },
  { id: "google-sheets", name: "Google Sheets", icon: "table_chart", description: "Exportez les données d'appels et contacts vers Google Sheets en temps réel.", category: "Productivité", configFields: [{ key: "spreadsheetId", label: "ID du Spreadsheet", placeholder: "1BxiMVs0XRA5nFMd..." }, { key: "sheetName", label: "Nom de la feuille", placeholder: "Appels" }] },
  { id: "hubspot", name: "HubSpot", icon: "hub", description: "Synchronisez contacts et créez des deals automatiquement après chaque appel qualifié.", category: "CRM", configFields: [{ key: "apiKey", label: "Clé API HubSpot", placeholder: "pat-na1-...", type: "password" }] },
  { id: "salesforce", name: "Salesforce", icon: "cloud", description: "Intégration avec Salesforce pour la gestion des leads et opportunités.", category: "CRM", configFields: [{ key: "instanceUrl", label: "URL de l'instance", placeholder: "https://votre-org.my.salesforce.com" }, { key: "accessToken", label: "Access Token", placeholder: "Bearer token...", type: "password" }] },
  { id: "pipedrive", name: "Pipedrive", icon: "filter_alt", description: "Créez et mettez à jour vos deals Pipedrive après chaque conversation.", category: "CRM", configFields: [{ key: "apiToken", label: "API Token Pipedrive", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", type: "password" }] },
  { id: "slack", name: "Slack", icon: "tag", description: "Notifications d'appels en temps réel dans vos channels. Alertes appels manqués et résumés.", category: "Communication", configFields: [{ key: "webhookUrl", label: "Webhook Slack", placeholder: "https://hooks.slack.com/services/T.../B.../..." }] },
  { id: "google-calendar", name: "Google Calendar", icon: "calendar_month", description: "Planifiez des rendez-vous depuis les conversations. Synchronisation bidirectionnelle.", category: "Productivité", configFields: [{ key: "clientId", label: "Client ID Google", placeholder: "xxxx.apps.googleusercontent.com" }, { key: "clientSecret", label: "Client Secret", placeholder: "GOCSPX-...", type: "password" }] },
  { id: "make", name: "Make (Integromat)", icon: "settings_suggest", description: "Scénarios d'automatisation complexes avec des centaines d'applications.", category: "Productivité", configFields: [{ key: "webhookUrl", label: "URL du scénario Make", placeholder: "https://hook.eu1.make.com/..." }] },
  { id: "n8n", name: "n8n", icon: "account_tree", description: "Workflows d'automatisation open-source. Alternative auto-hébergée à Zapier.", category: "Productivité", configFields: [{ key: "webhookUrl", label: "URL du workflow n8n", placeholder: "https://votre-n8n.com/webhook/..." }] },
  { id: "airtable", name: "Airtable", icon: "grid_view", description: "Synchronisez contacts et conversations avec vos bases Airtable.", category: "Productivité", configFields: [{ key: "apiKey", label: "Personal Access Token", placeholder: "pat...", type: "password" }, { key: "baseId", label: "Base ID", placeholder: "appXXXXXXXXXXXXXX" }] },
  { id: "notion", name: "Notion", icon: "edit_note", description: "Envoyez les résumés d'appels et notes dans votre base Notion.", category: "Productivité", configFields: [{ key: "apiKey", label: "Integration Token", placeholder: "secret_...", type: "password" }, { key: "databaseId", label: "Database ID", placeholder: "xxxx-xxxx-..." }] },
  { id: "discord", name: "Discord", icon: "forum", description: "Notifications d'appels et résumés dans vos serveurs Discord.", category: "Communication", configFields: [{ key: "webhookUrl", label: "Webhook Discord", placeholder: "https://discord.com/api/webhooks/..." }] },
  { id: "teams", name: "Microsoft Teams", icon: "groups", description: "Notifications dans Teams pour la collaboration d'équipe.", category: "Communication", configFields: [{ key: "webhookUrl", label: "Incoming Webhook URL", placeholder: "https://outlook.office.com/webhook/..." }] },
  { id: "whatsapp", name: "WhatsApp Business", icon: "chat", description: "Suivis WhatsApp après les appels. Confirmations de RDV automatiques.", category: "Communication", configFields: [{ key: "phoneNumberId", label: "Phone Number ID", placeholder: "1234567890" }, { key: "accessToken", label: "Access Token", placeholder: "EAAx...", type: "password" }] },
  { id: "webhook-custom", name: "Webhook Custom", icon: "webhook", description: "Envoyez les événements vers n'importe quel endpoint HTTP personnalisé.", category: "Productivité", configFields: [{ key: "url", label: "URL de l'endpoint", placeholder: "https://votre-api.com/webhook" }, { key: "secret", label: "Secret (optionnel)", placeholder: "whsec_...", type: "password" }] },
];

export default function IntegrationsPage() {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [filter, setFilter] = useState("Tous");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [configs, setConfigs] = useState<Record<string, Record<string, string>>>({});
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  // Fetch connected integrations from DB
  const { data: dbIntegrations, isLoading } = useQuery({
    queryKey: ["integrations", workspaceId],
    queryFn: () => apiFetch<any[]>(`/integrations?workspace_id=${workspaceId}`),
    enabled: !!workspaceId,
  });

  // Connect
  const connectMutation = useMutation({
    mutationFn: (input: { provider: string; config: Record<string, string> }) =>
      apiFetch<any>("/integrations", { method: "POST", body: JSON.stringify({ workspaceId, ...input }) }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["integrations"] });
      toast(`${allIntegrations.find((i) => i.id === vars.provider)?.name} connecté avec succès !`);
      setSelectedId(null);
    },
    onError: (e: any) => toast(e.message || "Erreur de connexion", "error"),
  });

  // Disconnect
  const disconnectMutation = useMutation({
    mutationFn: (dbId: string) => apiFetch<any>(`/integrations/${dbId}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["integrations"] });
      toast("Intégration déconnectée");
    },
    onError: (e: any) => toast(e.message || "Erreur", "error"),
  });

  const connectedProviders = (dbIntegrations ?? []).filter((i: any) => i.isConnected);
  const isConnected = (provider: string) => connectedProviders.some((i: any) => i.provider === provider);
  const getDbId = (provider: string) => connectedProviders.find((i: any) => i.provider === provider)?.id;

  const categories = ["Tous", "CRM", "Productivité", "Communication"];
  const filtered = filter === "Tous" ? allIntegrations : allIntegrations.filter((i) => i.category === filter);
  const selected = allIntegrations.find((i) => i.id === selectedId);

  const handleConnect = () => {
    if (!selected || !workspaceId) return;
    const config = configs[selected.id] || {};
    // Validate required fields
    const emptyFields = selected.configFields.filter((f) => !config[f.key]?.trim());
    if (emptyFields.length > 0) {
      toast(`Remplissez le champ : ${emptyFields[0]!.label}`, "error");
      return;
    }
    connectMutation.mutate({ provider: selected.id, config });
  };

  const handleDisconnect = (provider: string) => {
    const dbId = getDbId(provider);
    if (dbId) disconnectMutation.mutate(dbId);
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Intégrations</h1>
        <p className="mt-2 text-on-surface-variant">{connectedProviders.length} connectée(s) · {allIntegrations.length} disponibles</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-2 flex items-center gap-2"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary" /></span><span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Connectées</span></div>
          <p className="text-3xl font-bold text-tertiary" style={{ fontFamily: "Inter, sans-serif" }}>{connectedProviders.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-2 flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /><span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Disponibles</span></div>
          <p className="text-3xl font-bold text-primary" style={{ fontFamily: "Inter, sans-serif" }}>{allIntegrations.length - connectedProviders.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-2 flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-secondary" /><span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total</span></div>
          <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{allIntegrations.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${filter === cat ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>
            {cat} ({cat === "Tous" ? allIntegrations.length : allIntegrations.filter((i) => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((integration) => {
          const connected = isConnected(integration.id);
          return (
            <div key={integration.id} className={`group flex flex-col rounded-2xl border bg-card p-6 transition-all ${connected ? "border-tertiary/20" : "border-white/5 hover:border-primary/20"}`}>
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant">{integration.icon}</span>
                </div>
                <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${connected ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"}`}>
                  {connected && <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-tertiary" /></span>}
                  {connected ? "Connecté" : "Disponible"}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-bold text-on-surface">{integration.name}</h3>
              <p className="mb-4 flex-1 text-xs leading-relaxed text-on-surface-variant">{integration.description}</p>

              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">{integration.category}</span>
                {connected ? (
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedId(integration.id)} className="text-xs font-bold text-primary hover:underline">Modifier</button>
                    <button onClick={() => handleDisconnect(integration.id)} disabled={disconnectMutation.isPending} className="text-xs font-bold text-error hover:underline disabled:opacity-50">
                      {disconnectMutation.isPending ? "..." : "Déconnecter"}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setSelectedId(integration.id)} className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-bold text-white transition-all hover:brightness-110">
                    <span className="material-symbols-outlined text-sm">add</span>Connecter
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Config Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-container-high">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant">{selected.icon}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-on-surface">{selected.name}</h2>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-on-surface-variant">{selected.category}</span>
                </div>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="mb-6 text-sm text-on-surface-variant">{selected.description}</p>

            <div className="space-y-4">
              {selected.configFields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{field.label}</label>
                  <div className="relative">
                    <input
                      type={field.type === "password" && !showKey[`${selected.id}-${field.key}`] ? "password" : "text"}
                      value={configs[selected.id]?.[field.key] || ""}
                      onChange={(e) => setConfigs({ ...configs, [selected.id]: { ...(configs[selected.id] || {}), [field.key]: e.target.value } })}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 pr-10 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {field.type === "password" && (
                      <button onClick={() => setShowKey({ ...showKey, [`${selected.id}-${field.key}`]: !showKey[`${selected.id}-${field.key}`] })} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                        <span className="material-symbols-outlined text-sm">{showKey[`${selected.id}-${field.key}`] ? "visibility_off" : "visibility"}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isConnected(selected.id) && (
              <div className="mt-4 rounded-lg border border-tertiary/20 bg-tertiary/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-tertiary">check_circle</span>
                  <span className="text-xs font-bold text-tertiary">Actuellement connecté</span>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelectedId(null)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={handleConnect} disabled={connectMutation.isPending} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {connectMutation.isPending ? "Connexion..." : isConnected(selected.id) ? "Mettre à jour" : "Connecter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
