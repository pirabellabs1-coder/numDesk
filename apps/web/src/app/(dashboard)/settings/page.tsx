"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState("profile");
  const [saving, setSaving] = useState(false);

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
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white">
                MA
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high border border-white/10">
                <span className="material-symbols-outlined text-xs text-on-surface-variant">edit</span>
              </button>
            </div>
            <div>
              <p className="font-bold text-on-surface">Mon Agence</p>
              <p className="text-xs text-on-surface-variant">admin@monagence.fr</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-card p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Prénom</label>
                <input className="input-field" defaultValue="Marc" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Nom</label>
                <input className="input-field" defaultValue="Andrieu" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Nom de l'agence</label>
              <input className="input-field" defaultValue="Mon Agence IA" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Email</label>
              <input type="email" className="input-field" defaultValue="admin@monagence.fr" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Nouveau mot de passe</label>
              <input type="password" className="input-field" placeholder="Laisser vide pour ne pas changer" />
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
            <p className="text-sm text-on-surface-variant">1 membre dans ce workspace</p>
            <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold text-white">
              <span className="material-symbols-outlined text-sm">person_add</span>
              Inviter un membre
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  {["Membre", "Rôle", "Dernière connexion", ""].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
                        MA
                      </div>
                      <div>
                        <p className="text-sm font-medium text-on-surface">Marc Andrieu</p>
                        <p className="text-xs text-on-surface-variant">admin@monagence.fr</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      Admin
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant">Aujourd'hui</td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant">Vous</td>
                </tr>
              </tbody>
            </table>
          </div>
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
