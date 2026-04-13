"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { useWorkspace } from "@/providers/workspace-provider";
import { useWorkspaceMembers, useSendInvitation, useCancelInvitation } from "@/hooks/use-workspace-members";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { workspaceId } = useWorkspace();
  const { data: membersData } = useWorkspaceMembers(workspaceId);
  const sendInvitation = useSendInvitation();
  const cancelInvitation = useCancelInvitation();
  const [tab, setTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  // Extract user data from auth
  const meta = user?.user_metadata || {};
  const firstName = meta.first_name || meta.full_name?.split(" ")[0] || "";
  const lastName = meta.last_name || meta.full_name?.split(" ").slice(1).join(" ") || "";
  const agencyName = meta.agency_name || "";
  const email = user?.email || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: {
          first_name: (document.getElementById("settings-firstname") as HTMLInputElement)?.value,
          last_name: (document.getElementById("settings-lastname") as HTMLInputElement)?.value,
          agency_name: (document.getElementById("settings-agency") as HTMLInputElement)?.value,
        },
      });
      const newPassword = (document.getElementById("settings-password") as HTMLInputElement)?.value;
      if (newPassword && newPassword.length >= 6) {
        await supabase.auth.updateUser({ password: newPassword });
      }
      toast("Paramètres sauvegardés");
    } catch (e: any) {
      toast(e.message || "Erreur lors de la sauvegarde", "error");
    }
    setSaving(false);
  };

  const tabs = [
    { id: "profile", label: "Profil" },
    { id: "members", label: "Membres" },
    { id: "notifications", label: "Notifications" },
    { id: "providers", label: "Clés API Providers" },
  ];

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
          Paramètres
        </h1>
        <p className="mt-2 text-on-surface-variant">Gérez votre profil et vos préférences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-white/5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-6 py-3 text-sm font-bold tracking-wide transition-all ${
              tab === t.id ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              {meta.avatar_url ? (
                <img src={meta.avatar_url} alt="" className="h-20 w-20 rounded-2xl object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white">
                  {initials}
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high border border-white/10">
                <span className="material-symbols-outlined text-xs text-on-surface-variant">edit</span>
              </button>
            </div>
            <div>
              <p className="font-bold text-on-surface">{agencyName || `${firstName} ${lastName}`.trim() || "Mon compte"}</p>
              <p className="text-xs text-on-surface-variant">{email}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-card p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Prénom</label>
                <input id="settings-firstname" className="input-field" defaultValue={firstName} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Nom</label>
                <input id="settings-lastname" className="input-field" defaultValue={lastName} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Nom de l&apos;agence</label>
              <input id="settings-agency" className="input-field" defaultValue={agencyName} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Email</label>
              <input type="email" className="input-field opacity-60" defaultValue={email} disabled />
              <p className="text-[10px] text-on-surface-variant">L&apos;email ne peut pas être modifié depuis cette page.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Nouveau mot de passe</label>
              <input id="settings-password" type="password" className="input-field" placeholder="Laisser vide pour ne pas changer" />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${
                saving
                  ? "bg-tertiary/10 text-tertiary"
                  : "bg-gradient-to-r from-primary to-secondary text-white"
              }`}
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined text-sm">check</span>
                  Sauvegardé !
                </>
              ) : (
                "Sauvegarder les modifications"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Members tab */}
      {tab === "members" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">
              {(membersData?.members?.length || 1)} membre{(membersData?.members?.length || 1) > 1 ? "s" : ""} dans ce workspace
            </p>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold text-white"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              Inviter un membre
            </button>
          </div>

          {/* Members table */}
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  {["Membre", "Rôle", "Statut", ""].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(membersData?.members || [{ id: "self", email, firstName, lastName, role: "owner", userId: user?.id }]).map((m: any) => {
                  const mInitials = `${(m.firstName || "")[0] || ""}${(m.lastName || "")[0] || ""}`.toUpperCase() || "?";
                  const mName = `${m.firstName || ""} ${m.lastName || ""}`.trim() || m.email?.split("@")[0] || "—";
                  const isYou = m.userId === user?.id;
                  return (
                    <tr key={m.id} className="border-t border-white/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
                            {mInitials}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-on-surface">{mName}</p>
                            <p className="text-xs text-on-surface-variant">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          m.role === "owner" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                        }`}>
                          {m.role === "owner" ? "Propriétaire" : m.role === "admin" ? "Admin" : "Membre"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">
                        {isYou ? "Connecté" : "Actif"}
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">
                        {isYou ? "Vous" : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pending invitations */}
          {(membersData?.invitations?.length || 0) > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Invitations en attente</h3>
              {membersData!.invitations.map((inv: any) => (
                <div key={inv.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-card px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400/10">
                      <span className="material-symbols-outlined text-sm text-orange-400">mail</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{inv.email}</p>
                      <p className="text-[10px] text-on-surface-variant">
                        Expire le {new Date(inv.expiresAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => cancelInvitation.mutate(inv.id, {
                      onSuccess: () => toast("Invitation annulée"),
                      onError: (e: any) => toast(e.message || "Erreur", "error"),
                    })}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
                  >
                    Annuler
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Invite modal */}
          {showInviteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-8">
                <h2 className="mb-2 text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
                  Inviter un membre
                </h2>
                <p className="mb-6 text-sm text-on-surface-variant">
                  Un email d&apos;invitation sera envoyé avec un lien d&apos;accès au workspace.
                </p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">Email</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="collaborateur@email.com"
                      className="input-field"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">Rôle</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="input-field"
                    >
                      <option value="member">Membre — Lecture et utilisation</option>
                      <option value="admin">Admin — Gestion complète</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => { setShowInviteModal(false); setInviteEmail(""); }}
                    className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      if (!inviteEmail.trim() || !workspaceId) return;
                      sendInvitation.mutate(
                        { workspaceId, email: inviteEmail.trim(), role: inviteRole },
                        {
                          onSuccess: (data: any) => {
                            if (data?.emailSent === false) {
                              toast("Invitation créée mais l'email n'a pas pu être envoyé. Vérifiez la configuration email.", "error");
                            } else {
                              toast("Invitation envoyée par email !");
                            }
                            setShowInviteModal(false);
                            setInviteEmail("");
                          },
                          onError: (e: any) => toast(e.message || "Erreur lors de l'envoi", "error"),
                        }
                      );
                    }}
                    disabled={sendInvitation.isPending || !inviteEmail.trim()}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    {sendInvitation.isPending ? "Envoi..." : "Envoyer l'invitation"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notifications tab */}
      {tab === "notifications" && (
        <div className="space-y-4">
          {[
            { label: "Alertes de dépassement de quota", desc: "Recevoir un email quand le quota atteint 80% et 100%", default: true },
            { label: "Résumé hebdomadaire", desc: "Rapport d'activité chaque lundi matin", default: true },
            { label: "Fin de campagne", desc: "Notification à la fin de chaque campagne d'appels", default: false },
            { label: "Webhook en échec", desc: "Alerte si un webhook échoue plus de 3 fois", default: true },
            { label: "Nouvel appel entrant", desc: "Notification en temps réel pour chaque appel entrant", default: false },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between rounded-2xl border border-white/5 bg-card p-5">
              <div>
                <p className="text-sm font-bold text-on-surface">{n.label}</p>
                <p className="mt-0.5 text-xs text-on-surface-variant">{n.desc}</p>
              </div>
              <Toggle defaultOn={n.default} />
            </div>
          ))}
        </div>
      )}

      {/* API Providers tab */}
      {tab === "providers" && (
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">
            Ces clés sont utilisées côté serveur uniquement et ne sont jamais exposées dans le bundle frontend.
          </p>
          {[
            { label: "Cartesia API Key", placeholder: "sk-cart-...", hint: "TTS voix française premium" },
            { label: "ElevenLabs API Key", placeholder: "sk-el-...", hint: "TTS voix française backup" },
            { label: "OpenAI API Key", placeholder: "sk-...", hint: "LLM GPT-4o (option premium)" },
            { label: "Gemini API Key", placeholder: "AIza...", hint: "LLM Gemini 2.5 Flash (défaut)" },
          ].map((f) => (
            <ProviderKeyField key={f.label} label={f.label} placeholder={f.placeholder} hint={f.hint} />
          ))}
        </div>
      )}
    </section>
  );
}

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-primary" : "bg-surface-container-high"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

function ProviderKeyField({ label, placeholder, hint }: { label: string; placeholder: string; hint: string }) {
  const [visible, setVisible] = useState(false);
  const [providerSaved, setProviderSaved] = useState(false);

  return (
    <div className="rounded-2xl border border-white/5 bg-card p-5">
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{label}</label>
        <span className="text-[10px] text-on-surface-variant">{hint}</span>
      </div>
      <div className="mt-2 flex gap-3">
        <div className="relative flex-1">
          <input
            type={visible ? "text" : "password"}
            placeholder={placeholder}
            className="input-field pr-10"
          />
          <button
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-sm">
              {visible ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
        <button
          onClick={() => {
            setProviderSaved(true);
            setTimeout(() => setProviderSaved(false), 2000);
          }}
          className={`rounded-lg px-4 text-sm font-bold transition-all ${
            providerSaved ? "bg-tertiary/10 text-tertiary" : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {providerSaved ? "Sauvegardé" : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}
