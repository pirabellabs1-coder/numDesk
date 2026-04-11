"use client";

import { useState } from "react";

const llmModels = [
  "Gemini 2.5 Flash (défaut)",
  "GPT-4o",
  "Claude 3.5 Haiku",
  "GPT-4o-mini",
];

export function TabReglages() {
  const [recordSession, setRecordSession] = useState(true);
  const [recordAudio, setRecordAudio] = useState(true);
  const [temperature, setTemperature] = useState(0.4);
  const [topP, setTopP] = useState(1.0);
  const [model, setModel] = useState(llmModels[0]);

  return (
    <div className="space-y-6">
      {/* Enregistrement */}
      <Section title="Enregistrement">
        <ToggleRow label="Enregistrer la session en base" desc="Transcript + métadonnées" value={recordSession} onChange={setRecordSession} />
        <ToggleRow label="Enregistrer l'audio" desc="Fichier audio de l'appel" value={recordAudio} onChange={setRecordAudio} />
      </Section>

      {/* Modèles */}
      <Section title="Modèles">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">Modèle LLM</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="input-field"
          >
            {llmModels.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-on-surface-variant">Température</label>
            <span className="text-xs font-bold text-primary">{temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={0.01}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-on-surface-variant/50">
            <span>0 — Déterministe</span>
            <span>2 — Créatif</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-on-surface-variant">Top P</label>
            <span className="text-xs font-bold text-primary">{topP.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={topP}
            onChange={(e) => setTopP(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
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
      <div className="space-y-5">{children}</div>
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
