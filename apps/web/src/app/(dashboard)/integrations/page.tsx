"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/hooks/api-client";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";

type IntegrationStatus = "available" | "soon";

type IntegrationDef = {
  id: string;
  name: string;
  icon: string;
  logo?: string;
  description: string;
  category: "Automatisation" | "CRM" | "Productivité" | "Communication";
  status: IntegrationStatus;
  configFields: { key: string; label: string; placeholder: string; type?: string; helpText?: string }[];
};

const allIntegrations: IntegrationDef[] = [
  // ── Actives — webhook-based, fonctionnelles ──
  {
    id: "zapier",
    name: "Zapier",
    icon: "bolt",
    description: "Connectez Callpme à 7000+ applications. Déclenchez des Zaps sur chaque appel terminé, lead qualifié ou rendez-vous pris.",
    category: "Automatisation",
    status: "available",
    configFields: [
      { key: "webhookUrl", label: "URL du Webhook Zapier", placeholder: "https://hooks.zapier.com/hooks/catch/...", helpText: "Créez un Zap avec le trigger \"Webhooks by Zapier\" puis collez l'URL ici." },
    ],
  },
  {
    id: "make",
    name: "Make",
    icon: "settings_suggest",
    description: "Créez des scénarios d'automatisation visuels avec Make (ex-Integromat). Idéal pour des workflows complexes multi-étapes.",
    category: "Automatisation",
    status: "available",
    configFields: [
      { key: "webhookUrl", label: "URL du Webhook Make", placeholder: "https://hook.eu2.make.com/...", helpText: "Dans Make, ajoutez un module \"Custom Webhook\" et copiez l'URL générée." },
    ],
  },
  {
    id: "n8n",
    name: "n8n",
    icon: "account_tree",
    description: "Workflows d'automatisation open-source auto-hébergés. Alternative à Zapier avec contrôle total de vos données.",
    category: "Automatisation",
    status: "available",
    configFields: [
      { key: "webhookUrl", label: "URL du Webhook n8n", placeholder: "https://votre-n8n.com/webhook/...", helpText: "Dans n8n, ajoutez un nœud \"Webhook\" en mode production et copiez l'URL." },
    ],
  },

  // ── À venir ──
  {
    id: "hubspot",
    name: "HubSpot",
    icon: "hub",
    description: "Synchronisation native des contacts et deals HubSpot après chaque appel qualifié.",
    category: "CRM",
    status: "soon",
    configFields: [],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    icon: "cloud",
    description: "Intégration directe avec Salesforce pour la gestion des leads et opportunités.",
    category: "CRM",
    status: "soon",
    configFields: [],
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    icon: "filter_alt",
    description: "Créez et mettez à jour vos deals Pipedrive automatiquement après chaque conversation.",
    category: "CRM",
    status: "soon",
    configFields: [],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    icon: "table_chart",
    description: "Exportez les données d'appels et contacts vers Google Sheets en temps réel.",
    category: "Productivité",
    status: "soon",
    configFields: [],
  },
  {
    id: "slack",
    name: "Slack",
    icon: "tag",
    description: "Notifications d'appels en temps réel dans vos channels Slack.",
    category: "Communication",
    status: "soon",
    configFields: [],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    icon: "calendar_month",
    description: "Planifiez des rendez-vous depuis les conversations avec synchronisation bidirectionnelle.",
    category: "Productivité",
    status: "soon",
    configFields: [],
  },
  {
    id: "notion",
    name: "Notion",
    icon: "edit_note",
    description: "Envoyez les résumés d'appels et notes dans votre base Notion automatiquement.",
    category: "Productivité",
    status: "soon",
    configFields: [],
  },
  {
    id: "airtable",
    name: "Airtable",
    icon: "grid_view",
    description: "Synchronisez contacts et conversations avec vos bases Airtable.",
    category: "Productivité",
    status: "soon",
    configFields: [],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: "chat",
    description: "Suivis WhatsApp automatiques après les appels et confirmations de RDV.",
    category: "Communication",
    status: "soon",
    configFields: [],
  },
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

  const availableIntegrations = allIntegrations.filter((i) => i.status === "available");
  const soonIntegrations = allIntegrations.filter((i) => i.status === "soon");

  const categories = ["Tous", "Automatisation", "CRM", "Productivité", "Communication"];
  const filtered = filter === "Tous" ? allIntegrations : allIntegrations.filter((i) => i.category === filter);
  const selected = allIntegrations.find((i) => i.id === selectedId);

  const handleConnect = () => {
    if (!selected || !workspaceId || selected.status === "soon") return;
    const config = configs[selected.id] || {};
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
    <section className="mx-auto max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Intégrations</h1>
        <p className="mt-2 text-on-surface-variant">
          {connectedProviders.length} connectée(s) · {availableIntegrations.length} disponibles · {soonIntegrations.length} à venir
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary" /></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Connectées</span>
          </div>
          <p className="text-3xl font-bold text-tertiary" style={{ fontFamily: "Inter, sans-serif" }}>{connectedProviders.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <div className="mb-2 flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /><span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Disponibles</span></div>
          <p className="text-3xl font-bold text-primary" style={{ fontFamily: "Inter, sans-serif" }}>{availableIntegrations.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <div className="mb-2 flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-secondary" /><span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">À venir</span></div>
          <p className="text-3xl font-bold text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>{soonIntegrations.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <div className="mb-2 flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-on-surface-variant" /><span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total</span></div>
          <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{allIntegrations.length}</p>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-primary">info</span>
          <div>
            <p className="text-sm font-bold text-on-surface">Comment fonctionnent les intégrations ?</p>
            <p className="mt-1 text-xs text-on-surface-variant leading-relaxed">
              Callpme envoie les événements (appel terminé, lead qualifié, RDV pris) vers vos webhooks configurés.
              Connectez <strong className="text-on-surface">Zapier</strong>, <strong className="text-on-surface">Make</strong> ou <strong className="text-on-surface">n8n</strong> pour automatiser vos workflows avec n'importe quelle application.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} className={`rounded-lg px-3 py-2 text-xs sm:px-4 sm:text-sm font-bold transition-all ${filter === cat ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>
            {cat} ({cat === "Tous" ? allIntegrations.length : allIntegrations.filter((i) => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((integration) => {
          const connected = isConnected(integration.id);
          const isSoon = integration.status === "soon";

          return (
            <div key={integration.id} className={`group relative flex flex-col rounded-2xl border bg-card p-6 transition-all ${
              connected ? "border-tertiary/20" : isSoon ? "border-white/5 opacity-70" : "border-white/5 hover:border-primary/20"
            }`}>
              {/* Soon overlay */}
              {isSoon && (
                <div className="absolute right-4 top-4">
                  <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
                    Bientôt
                  </span>
                </div>
              )}

              <div className="mb-4 flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isSoon ? "bg-white/5" : "bg-surface-container-high"}`}>
                  <span className={`material-symbols-outlined text-2xl ${isSoon ? "text-on-surface-variant/50" : "text-on-surface-variant"}`}>{integration.icon}</span>
                </div>
                {!isSoon && (
                  <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${connected ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"}`}>
                    {connected && <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-tertiary" /></span>}
                    {connected ? "Connecté" : "Disponible"}
                  </span>
                )}
              </div>

              <h3 className={`mb-2 text-lg font-bold ${isSoon ? "text-on-surface/60" : "text-on-surface"}`}>{integration.name}</h3>
              <p className={`mb-4 flex-1 text-xs leading-relaxed ${isSoon ? "text-on-surface-variant/60" : "text-on-surface-variant"}`}>{integration.description}</p>

              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">{integration.category}</span>
                {isSoon ? (
                  <span className="text-xs text-on-surface-variant/50">Prochainement disponible</span>
                ) : connected ? (
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
      {selected && selected.status === "available" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-4 sm:p-6 md:p-8">
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
                  {field.helpText && (
                    <p className="mt-1.5 text-[11px] text-on-surface-variant/70">{field.helpText}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Webhook events info */}
            <div className="mt-5 rounded-lg border border-white/5 bg-surface-container-lowest p-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Événements envoyés</p>
              <div className="flex flex-wrap gap-2">
                {["call.ended", "call.started", "lead.qualified", "campaign.completed", "appointment.created"].map((event) => (
                  <span key={event} className="rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary">{event}</span>
                ))}
              </div>
            </div>

            {isConnected(selected.id) && (
              <div className="mt-4 rounded-lg border border-tertiary/20 bg-tertiary/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-tertiary">check_circle</span>
                  <span className="text-xs font-bold text-tertiary">Actuellement connecté — les événements sont envoyés en temps réel</span>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelectedId(null)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={handleConnect} disabled={connectMutation.isPending} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white disabled:opacity-50">
                {connectMutation.isPending ? "Connexion..." : isConnected(selected.id) ? "Mettre à jour" : "Connecter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
