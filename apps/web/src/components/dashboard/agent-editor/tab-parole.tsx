"use client";

import { useState } from "react";

const voices = [
  { provider: "Cartesia", name: "Gabriel", gender: "male", lang: "fr-FR", premium: true },
  { provider: "Cartesia", name: "Sophie", gender: "female", lang: "fr-FR", premium: true },
  { provider: "ElevenLabs", name: "Marie", gender: "female", lang: "fr-FR", premium: false },
  { provider: "Cartesia", name: "Luc", gender: "male", lang: "fr-FR", premium: false },
];

export function TabParole() {
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [hesitations, setHesitations] = useState(true);
  const [frNumbers, setFrNumbers] = useState(true);

  return (
    <div className="space-y-6">
      {/* Langue */}
      <Section title="Langue de démarrage">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">Code langue ISO</label>
          <select className="input-field">
            <option value="fr-FR">fr-FR — Français (France)</option>
            <option value="fr-BE">fr-BE — Français (Belgique)</option>
            <option value="en-US">en-US — English (US)</option>
          </select>
        </div>
      </Section>

      {/* Voix */}
      <Section title="Voix par défaut">
        <div className="space-y-2">
          {voices.map((v, i) => (
            <button
              key={i}
              onClick={() => setSelectedVoice(i)}
              className={`flex w-full items-center gap-4 rounded-xl border p-3 text-left transition-all ${
                selectedVoice === i
                  ? "border-primary/40 bg-primary/5"
                  : "border-white/5 bg-surface-container-low hover:border-white/10"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${
                v.gender === "male" ? "from-primary to-secondary" : "from-secondary to-tertiary"
              }`}>
                <span className="material-symbols-outlined text-sm text-white">person</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">
                  {v.provider} — {v.name}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {v.gender === "male" ? "Homme" : "Femme"} · {v.lang}
                </p>
              </div>
              {v.premium && (
                <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Premium
                </span>
              )}
              {selectedVoice === i && (
                <span className="material-symbols-outlined text-primary">check_circle</span>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Paramètres */}
      <Section title="Paramètres de parole">
        <ToggleRow
          label="Hésitations naturelles"
          desc="Ajouter des euh, ah, bien, alors..."
          value={hesitations}
          onChange={setHesitations}
        />
        <ToggleRow
          label="Prononciation française des nombres"
          desc="Soixante-dix au lieu de septante"
          value={frNumbers}
          onChange={setFrNumbers}
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-card p-6">
      <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm font-medium text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? "bg-primary" : "bg-surface-container-high"
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`} />
      </button>
    </div>
  );
}
