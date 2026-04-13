"use client";

import { useState } from "react";
import { usePhoneNumbers, useCreatePhoneNumber, useDeletePhoneNumber } from "@/hooks/use-phone-numbers";
import { useAgents } from "@/hooks/use-agents";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

type AddMode = null | "sip" | "twilio";

export default function PhoneNumbersPage() {
  const { workspaceId } = useWorkspace();
  const { data: numbers, isLoading, error, refetch } = usePhoneNumbers(workspaceId);
  const { data: agents } = useAgents(workspaceId);
  const createNumber = useCreatePhoneNumber();
  const deleteNumber = useDeletePhoneNumber();
  const { toast } = useToast();

  const [addMode, setAddMode] = useState<AddMode>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);

  // SIP form
  const [sipForm, setSipForm] = useState({ number: "", friendlyName: "", agentId: "" });

  // Twilio form — step 1: credentials, step 2: number selection
  const [twilioStep, setTwilioStep] = useState<1 | 2>(1);
  const [twilioForm, setTwilioForm] = useState({ accountSid: "", authToken: "", number: "", friendlyName: "" });
  const [twilioNumbers, setTwilioNumbers] = useState<any[]>([]);
  const [twilioLoading, setTwilioLoading] = useState(false);

  const openAdd = (mode: "sip" | "twilio") => {
    setAddMode(mode);
    setSipForm({ number: "", friendlyName: "", agentId: "" });
    setTwilioForm({ accountSid: "", authToken: "", number: "", friendlyName: "" });
    setTwilioStep(1);
    setTwilioNumbers([]);
  };

  const handleCreateSip = async () => {
    if (!sipForm.number.trim() || !workspaceId) return;
    let fullNumber = sipForm.number.trim().replace(/\s+/g, "");
    if (!fullNumber.startsWith("+")) fullNumber = "+" + fullNumber;
    try {
      await createNumber.mutateAsync({
        workspaceId,
        number: fullNumber,
        friendlyName: sipForm.friendlyName,
        provider: "sip_trunk",
        ...(sipForm.agentId ? { assignedAgentId: sipForm.agentId } : {}),
      });
      toast("Numéro SIP ajouté avec succès");
      setAddMode(null);
    } catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  const handleTwilioContinue = async () => {
    if (!twilioForm.accountSid.trim() || !twilioForm.authToken.trim()) return;
    setTwilioLoading(true);
    try {
      // Fetch available numbers from Twilio
      const res = await fetch("/api/twilio/numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountSid: twilioForm.accountSid.trim(),
          authToken: twilioForm.authToken.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Erreur Twilio");
      setTwilioNumbers(data.data || []);
      setTwilioStep(2);
    } catch (e: any) {
      toast(e.message || "Impossible de récupérer les numéros Twilio", "error");
    }
    setTwilioLoading(false);
  };

  const handleCreateTwilio = async (twilioNumber?: any) => {
    if (!workspaceId) return;
    const number = twilioNumber?.phoneNumber || twilioForm.number.trim();
    if (!number) return;
    let fullNumber = number.replace(/\s+/g, "");
    if (!fullNumber.startsWith("+")) fullNumber = "+" + fullNumber;
    try {
      await createNumber.mutateAsync({
        workspaceId,
        number: fullNumber,
        friendlyName: twilioNumber?.friendlyName || twilioForm.friendlyName || fullNumber,
        provider: "twilio",
        twilioSid: twilioForm.accountSid.trim(),
      });
      toast("Numéro Twilio ajouté avec succès");
      setAddMode(null);
    } catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteNumber.mutateAsync(id); toast("Numéro supprimé"); setShowDelete(null); }
    catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les numéros" onRetry={() => refetch()} />;
  const numList = numbers ?? [];
  const activeCount = numList.filter((n: any) => n.isActive).length;

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Numéros de téléphone</h1>
          <p className="mt-2 text-on-surface-variant">{activeCount} actif(s) sur {numList.length} numéro(s)</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => openAdd("sip")} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-bold text-on-surface transition-all hover:border-white/20">
            <span className="material-symbols-outlined text-sm">router</span>
            SIP Trunk
          </button>
          <button onClick={() => openAdd("twilio")} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white">
            <span className="material-symbols-outlined text-sm">cloud</span>
            Twilio
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-2 text-primary"><span className="material-symbols-outlined">call</span></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total numéros</p>
          <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{numList.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-2 text-tertiary"><span className="material-symbols-outlined">check_circle</span></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Actifs</p>
          <p className="text-3xl font-bold text-tertiary" style={{ fontFamily: "Inter, sans-serif" }}>{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-2 text-secondary"><span className="material-symbols-outlined">router</span></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Providers</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{numList.filter((n: any) => n.provider === "sip_trunk").length} SIP</span>
            <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary">{numList.filter((n: any) => n.provider === "twilio").length} Twilio</span>
          </div>
        </div>
      </div>

      {/* Number list */}
      {numList.length === 0 ? (
        <EmptyState icon="call" title="Aucun numéro configuré" description="Ajoutez un numéro SIP ou Twilio pour recevoir et passer des appels avec vos agents IA." actionLabel="Ajouter un numéro SIP" onAction={() => openAdd("sip")} />
      ) : (
        <div className="space-y-3">
          {numList.map((num: any) => (
            <div key={num.id} className={`rounded-2xl border bg-card p-5 transition-all ${num.isActive ? "border-white/5 hover:border-white/10" : "border-white/5 opacity-60"}`}>
              <div className="flex items-center gap-5">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${num.isActive ? "bg-tertiary/10" : "bg-white/5"}`}>
                  <span className={`material-symbols-outlined text-xl ${num.isActive ? "text-tertiary" : "text-on-surface-variant"}`}>call</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{num.number}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${num.isActive ? "bg-tertiary/10 text-tertiary" : "bg-white/5 text-on-surface-variant"}`}>
                      {num.isActive ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-xs text-on-surface-variant">
                    {num.friendlyName && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">badge</span>{num.friendlyName}</span>}
                    <span className={`flex items-center gap-1 ${num.provider === "twilio" ? "text-secondary" : ""}`}><span className="material-symbols-outlined text-xs">router</span>{num.provider === "twilio" ? "Twilio" : "SIP Trunk"}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">schedule</span>{new Date(num.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowDelete(num.id)} className="rounded-lg border border-white/10 px-3 py-2 text-on-surface-variant transition-all hover:border-error/30 hover:text-error">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="rounded-2xl border border-white/5 bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary">info</span>
          <div>
            <p className="text-sm font-bold text-on-surface">Configuration des numéros</p>
            <p className="mt-1 text-xs text-on-surface-variant">
              <strong className="text-on-surface">SIP Trunk</strong> — Connectez vos numéros via votre trunk SIP configuré dans les paramètres. Les credentials sont chiffrés AES-256 au repos.
              <br />
              <strong className="text-on-surface">Twilio</strong> — Importez vos numéros depuis votre compte Twilio en entrant vos identifiants (Account SID + Auth Token).
            </p>
          </div>
        </div>
      </div>

      {/* ─── SIP MODAL ─── */}
      {addMode === "sip" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-8">
            <h2 className="mb-6 text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Ajouter un numéro SIP</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nom du numéro</label>
                <input value={sipForm.friendlyName} onChange={(e) => setSipForm({ ...sipForm, friendlyName: e.target.value })} placeholder="Ex: Ligne Support, Accueil, Commercial..." className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Agent inbound (optionnel)</label>
                <select value={sipForm.agentId} onChange={(e) => setSipForm({ ...sipForm, agentId: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Aucun agent assigné</option>
                  {(agents ?? []).map((agent: any) => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-on-surface-variant">L&apos;agent qui répondra automatiquement aux appels entrants sur ce numéro.</p>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Numéro de téléphone ou extension</label>
                <input value={sipForm.number} onChange={(e) => setSipForm({ ...sipForm, number: e.target.value })} placeholder="+33187000000" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
                <p className="mt-1 text-[10px] text-on-surface-variant">Format E.164 recommandé (ex: +33187000000) ou extension SIP.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setAddMode(null)} className="rounded-lg px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={handleCreateSip} disabled={createNumber.isPending || !sipForm.number.trim()} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-50">
                {createNumber.isPending ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TWILIO MODAL ─── */}
      {addMode === "twilio" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-8">
            <h2 className="mb-6 text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Ajouter un numéro</h2>

            {twilioStep === 1 ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Fournisseur</label>
                    <div className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface">
                      <div className="flex items-center justify-between">
                        <span>twilio</span>
                        <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Twilio Account SID</label>
                    <input value={twilioForm.accountSid} onChange={(e) => setTwilioForm({ ...twilioForm, accountSid: e.target.value })} placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Twilio Auth Token</label>
                    <input type="password" value={twilioForm.authToken} onChange={(e) => setTwilioForm({ ...twilioForm, authToken: e.target.value })} placeholder="••••••••••••••••••••••••••••••••" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setAddMode(null)} className="rounded-lg px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface">Annuler</button>
                  <button onClick={handleTwilioContinue} disabled={twilioLoading || !twilioForm.accountSid.trim() || !twilioForm.authToken.trim()} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-50">
                    {twilioLoading ? "Chargement..." : "Continuer"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  {twilioNumbers.length > 0 ? (
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Sélectionnez un numéro Twilio</label>
                      <div className="max-h-60 space-y-2 overflow-y-auto">
                        {twilioNumbers.map((tn: any, i: number) => (
                          <button key={i} onClick={() => handleCreateTwilio(tn)} disabled={createNumber.isPending} className="flex w-full items-center gap-3 rounded-lg border border-white/5 bg-surface-container-low px-4 py-3 text-left transition-all hover:border-primary/30">
                            <span className="material-symbols-outlined text-sm text-secondary">call</span>
                            <div>
                              <p className="font-mono text-sm font-bold text-on-surface">{tn.phoneNumber}</p>
                              {tn.friendlyName && <p className="text-xs text-on-surface-variant">{tn.friendlyName}</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-3 text-sm text-on-surface-variant">Aucun numéro trouvé sur ce compte Twilio. Saisissez un numéro manuellement :</p>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Numéro de téléphone</label>
                        <input value={twilioForm.number} onChange={(e) => setTwilioForm({ ...twilioForm, number: e.target.value })} placeholder="+33612345678" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div className="mt-3">
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nom (optionnel)</label>
                        <input value={twilioForm.friendlyName} onChange={(e) => setTwilioForm({ ...twilioForm, friendlyName: e.target.value })} placeholder="Ligne principale" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setTwilioStep(1)} className="rounded-lg px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface">Retour</button>
                  {twilioNumbers.length === 0 && (
                    <button onClick={() => handleCreateTwilio()} disabled={createNumber.isPending || !twilioForm.number.trim()} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-50">
                      {createNumber.isPending ? "Enregistrement..." : "Enregistrer"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10">
              <span className="material-symbols-outlined text-3xl text-error">call_end</span>
            </div>
            <h3 className="mb-2 text-lg font-bold text-on-surface">Supprimer ce numéro ?</h3>
            <p className="mb-6 text-sm text-on-surface-variant">Le numéro sera déconnecté et ne recevra plus d&apos;appels.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDelete(null)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={() => handleDelete(showDelete)} disabled={deleteNumber.isPending} className="rounded-lg bg-error px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {deleteNumber.isPending ? "..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
