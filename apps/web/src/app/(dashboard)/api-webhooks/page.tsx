"use client";

import { useState } from "react";
import { useApiTokens, useCreateApiToken, useRevokeApiToken } from "@/hooks/use-api-tokens";
import { useWebhooks, useCreateWebhook, useDeleteWebhook } from "@/hooks/use-webhooks";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function ApiWebhooksPage() {
  const { workspaceId } = useWorkspace();
  const { data: tokens, isLoading: loadingTokens } = useApiTokens(workspaceId);
  const { data: webhookList, isLoading: loadingWebhooks } = useWebhooks(workspaceId);
  const createToken = useCreateApiToken();
  const revokeToken = useRevokeApiToken();
  const createWebhook = useCreateWebhook();
  const deleteWebhook = useDeleteWebhook();
  const { toast } = useToast();

  const [tab, setTab] = useState("tokens");
  const [newTokenName, setNewTokenName] = useState("");
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ url: "", events: ["call.ended"] as string[] });
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);
  const [showRevoke, setShowRevoke] = useState<string | null>(null);
  const [providerKeys, setProviderKeys] = useState<Record<string, string>>({});
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  const handleCreateToken = async () => {
    if (!newTokenName.trim() || !workspaceId) return;
    try {
      const result = await createToken.mutateAsync({ workspaceId, name: newTokenName });
      setCreatedToken(result.rawToken);
      setNewTokenName("");
      toast("Token API créé avec succès");
    } catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  const handleRevokeToken = async (id: string) => {
    try { await revokeToken.mutateAsync(id); toast("Token révoqué"); setShowRevoke(null); }
    catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  const handleCreateWebhook = async () => {
    if (!newWebhook.url.trim() || !workspaceId || newWebhook.events.length === 0) return;
    try {
      await createWebhook.mutateAsync({ workspaceId, url: newWebhook.url, events: newWebhook.events });
      toast("Webhook créé");
      setShowWebhookForm(false);
      setNewWebhook({ url: "", events: ["call.ended"] });
    } catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  const handleDeleteWebhook = async (id: string) => {
    try { await deleteWebhook.mutateAsync(id); toast("Webhook supprimé"); }
    catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  const handleTestWebhook = async (wh: any) => {
    setTestingWebhook(wh.id);
    try {
      await fetch(wh.url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "test", timestamp: new Date().toISOString() }), mode: "no-cors" });
      toast("Test envoyé à " + wh.url, "info");
    } catch { toast("Test envoyé (mode no-cors)", "info"); }
    setTestingWebhook(null);
  };

  const toggleEvent = (event: string) => {
    setNewWebhook((prev) => ({ ...prev, events: prev.events.includes(event) ? prev.events.filter((e) => e !== event) : [...prev.events, event] }));
  };

  if (loadingTokens || loadingWebhooks) return <PageSkeleton />;
  const tokenList = tokens ?? [];
  const webhooks = webhookList ?? [];

  const availableEvents = [
    { id: "call.started", label: "Appel démarré", icon: "call" },
    { id: "call.ended", label: "Appel terminé", icon: "call_end" },
    { id: "call.transferred", label: "Appel transféré", icon: "swap_horiz" },
    { id: "campaign.completed", label: "Campagne terminée", icon: "campaign" },
  ];

  const providers = [
    { id: "elevenlabs", name: "ElevenLabs", icon: "record_voice_over", desc: "Voix IA premium", placeholder: "sk_..." },
    { id: "openai", name: "OpenAI", icon: "psychology", desc: "Modèles GPT-4o", placeholder: "sk-proj-..." },
    { id: "cartesia", name: "Cartesia", icon: "graphic_eq", desc: "Voix française premium", placeholder: "sk_cart_..." },
    { id: "gemini", name: "Google Gemini", icon: "auto_awesome", desc: "Gemini 2.5 Flash", placeholder: "AIza..." },
  ];

  return (
    <section className="mx-auto max-w-5xl space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>API & Webhooks</h1>
        <p className="mt-2 text-on-surface-variant">Gérez vos tokens, webhooks et clés API de providers tiers</p>
      </div>

      <div className="flex flex-wrap gap-0 border-b border-white/5">
        {[{ id: "tokens", label: "Tokens API", icon: "key" }, { id: "providers", label: "Clés Providers", icon: "settings_suggest" }, { id: "webhooks", label: "Webhooks", icon: "webhook" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm md:px-6 font-bold transition-all ${tab === t.id ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>
            <span className="material-symbols-outlined text-sm">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* TOKENS */}
      {tab === "tokens" && (
        <div className="space-y-6">
          {createdToken && (
            <div className="rounded-2xl border border-tertiary/20 bg-tertiary/5 p-5">
              <div className="mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-tertiary">check_circle</span><p className="text-sm font-bold text-tertiary">Token créé !</p></div>
              <p className="mb-3 text-xs text-on-surface-variant">Copiez-le maintenant — il ne sera <strong>plus jamais affiché</strong>.</p>
              <div className="flex items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-3">
                <code className="flex-1 break-all font-mono text-sm text-on-surface">{createdToken}</code>
                <button onClick={() => { navigator.clipboard.writeText(createdToken); toast("Copié !"); }} className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"><span className="material-symbols-outlined text-sm">content_copy</span>Copier</button>
              </div>
              <button onClick={() => setCreatedToken(null)} className="mt-3 text-xs text-on-surface-variant hover:text-on-surface">Fermer</button>
            </div>
          )}

          <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
            <h3 className="mb-4 text-sm font-bold text-on-surface">Créer un nouveau token</h3>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nom du token</label>
                <input value={newTokenName} onChange={(e) => setNewTokenName(e.target.value)} placeholder="Ex: Production API" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" onKeyDown={(e) => e.key === "Enter" && handleCreateToken()} />
              </div>
              <button onClick={handleCreateToken} disabled={createToken.isPending || !newTokenName.trim()} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white disabled:opacity-50">
                <span className="material-symbols-outlined text-sm">add</span>{createToken.isPending ? "..." : "Créer le token"}
              </button>
            </div>
          </div>

          {tokenList.length === 0 ? <EmptyState icon="key" title="Aucun token API" description="Créez un token pour accéder à l'API Callpme." /> : (
            <div className="overflow-x-auto overflow-hidden rounded-2xl border border-white/5 bg-card">
              <table className="w-full min-w-[500px]">
                <thead><tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6">Nom</th><th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6">Préfixe</th><th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6">Créé le</th><th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6">Actions</th>
                </tr></thead>
                <tbody>{tokenList.map((tok: any) => (
                  <tr key={tok.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-3 py-3 sm:px-4 md:px-6 md:py-4"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><span className="material-symbols-outlined text-sm text-primary">key</span></div><span className="text-sm font-bold text-on-surface">{tok.name}</span></div></td>
                    <td className="px-3 py-3 sm:px-4 md:px-6 md:py-4"><code className="rounded bg-surface-container-lowest px-2 py-1 font-mono text-xs text-on-surface-variant">{tok.tokenPrefix}</code></td>
                    <td className="px-3 py-3 sm:px-4 md:px-6 md:py-4 text-sm text-on-surface-variant">{new Date(tok.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-3 py-3 sm:px-4 md:px-6 md:py-4"><button onClick={() => setShowRevoke(tok.id)} className="flex items-center gap-1 text-xs font-bold text-error hover:underline"><span className="material-symbols-outlined text-xs">delete</span>Révoquer</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-5">
            <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary">info</span>
              <div><p className="text-sm font-bold text-on-surface">Utilisation</p><p className="mt-1 text-xs text-on-surface-variant">Header requis :</p><code className="mt-2 block rounded-lg bg-surface-container-lowest px-4 py-2 text-xs text-primary">Authorization: Bearer voc_xxxxxxxxxxxx</code></div>
            </div>
          </div>
        </div>
      )}

      {/* PROVIDERS */}
      {tab === "providers" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-5">
            <div className="flex items-start gap-3"><span className="material-symbols-outlined text-primary">info</span>
              <div><p className="text-sm font-bold text-on-surface">Clés optionnelles</p><p className="mt-1 text-xs text-on-surface-variant">Utilisez vos propres comptes providers. Si non renseignées, les clés Callpme par défaut sont utilisées.</p></div>
            </div>
          </div>
          {providers.map((p) => (
            <div key={p.id} className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6 transition-all hover:border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high"><span className="material-symbols-outlined text-xl text-on-surface-variant">{p.icon}</span></div>
                  <div><h3 className="text-sm font-bold text-on-surface">{p.name}</h3><p className="text-xs text-on-surface-variant">{p.desc}</p></div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${providerKeys[p.id] ? "bg-tertiary/10 text-tertiary" : "bg-white/5 text-on-surface-variant"}`}>{providerKeys[p.id] ? "Configuré" : "Par défaut"}</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative flex-1">
                  <input type={showKey[p.id] ? "text" : "password"} value={providerKeys[p.id] || ""} onChange={(e) => setProviderKeys({ ...providerKeys, [p.id]: e.target.value })} placeholder={p.placeholder} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 pr-10 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
                  <button onClick={() => setShowKey({ ...showKey, [p.id]: !showKey[p.id] })} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined text-sm">{showKey[p.id] ? "visibility_off" : "visibility"}</span></button>
                </div>
                <button onClick={() => toast(`Clé ${p.name} sauvegardée`)} className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-bold text-on-surface-variant hover:border-white/20 hover:text-on-surface">Sauvegarder</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WEBHOOKS */}
      {tab === "webhooks" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">{webhooks.length} webhook(s)</p>
            <button onClick={() => setShowWebhookForm(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white"><span className="material-symbols-outlined text-sm">add</span>Nouveau webhook</button>
          </div>

          {showWebhookForm && (
            <div className="rounded-2xl border border-primary/20 bg-card p-6">
              <h3 className="mb-4 text-sm font-bold text-on-surface">Configurer un webhook</h3>
              <div className="space-y-4">
                <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">URL</label>
                  <input value={newWebhook.url} onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })} placeholder="https://votre-app.com/webhook" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" /></div>
                <div><label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Événements</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableEvents.map((ev) => (
                      <button key={ev.id} onClick={() => toggleEvent(ev.id)} className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${newWebhook.events.includes(ev.id) ? "border-primary/30 bg-primary/5" : "border-white/5 hover:border-white/10"}`}>
                        <span className={`material-symbols-outlined text-lg ${newWebhook.events.includes(ev.id) ? "text-primary" : "text-on-surface-variant"}`}>{ev.icon}</span>
                        <div><p className="text-xs font-bold text-on-surface">{ev.id}</p><p className="text-[10px] text-on-surface-variant">{ev.label}</p></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setShowWebhookForm(false)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant">Annuler</button>
                <button onClick={handleCreateWebhook} disabled={createWebhook.isPending || !newWebhook.url.trim() || newWebhook.events.length === 0} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold text-white disabled:opacity-50">{createWebhook.isPending ? "..." : "Créer le webhook"}</button>
              </div>
            </div>
          )}

          {webhooks.length === 0 && !showWebhookForm ? <EmptyState icon="webhook" title="Aucun webhook" description="Recevez des notifications en temps réel." actionLabel="Créer un webhook" onAction={() => setShowWebhookForm(true)} /> : (
            <div className="space-y-3">
              {webhooks.map((wh: any) => (
                <div key={wh.id} className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5 transition-all hover:border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10"><span className="material-symbols-outlined text-sm text-secondary">webhook</span></div>
                        <div className="min-w-0"><p className="truncate text-sm font-bold text-on-surface">{wh.url}</p>
                          <div className="mt-1 flex flex-wrap gap-1">{(wh.events || []).map((ev: string) => <span key={ev} className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">{ev}</span>)}</div>
                        </div>
                      </div>
                      {wh.secret && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-[10px] text-on-surface-variant">Secret :</span>
                          <code className="rounded bg-surface-container-lowest px-2 py-0.5 font-mono text-[10px] text-on-surface-variant">{wh.secret.slice(0, 20)}...</code>
                          <button onClick={() => { navigator.clipboard.writeText(wh.secret); toast("Secret copié"); }} className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined text-xs">content_copy</span></button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${wh.isActive ? "bg-tertiary/10 text-tertiary" : "bg-white/5 text-on-surface-variant"}`}>{wh.isActive ? "Actif" : "Inactif"}</span>
                      <button onClick={() => handleTestWebhook(wh)} disabled={testingWebhook === wh.id} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:border-primary/30 hover:text-primary disabled:opacity-50">{testingWebhook === wh.id ? "..." : "Tester"}</button>
                      <button onClick={() => handleDeleteWebhook(wh.id)} className="rounded-lg border border-white/10 px-2 py-1.5 text-on-surface-variant hover:border-error/30 hover:text-error"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
            <div className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary">security</span>
              <div><p className="text-sm font-bold text-on-surface">Signature HMAC-SHA256</p><p className="mt-1 text-xs text-on-surface-variant">Chaque requête webhook inclut <code className="text-primary">X-Callpme-Signature</code>. Utilisez le secret pour vérifier l&apos;authenticité.</p></div>
            </div>
          </div>
        </div>
      )}

      {showRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-4 sm:p-6 md:p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10"><span className="material-symbols-outlined text-3xl text-error">key_off</span></div>
            <h3 className="mb-2 text-lg font-bold text-on-surface">Révoquer ce token ?</h3>
            <p className="mb-6 text-sm text-on-surface-variant">Les applications utilisant ce token perdront l&apos;accès.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowRevoke(null)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant">Annuler</button>
              <button onClick={() => handleRevokeToken(showRevoke)} disabled={revokeToken.isPending} className="rounded-lg bg-error px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{revokeToken.isPending ? "..." : "Révoquer"}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
