"use client";

import { useState } from "react";

interface LlmModel {
  id: string;
  name: string;
  provider: string;
  latencyMs: number;
  costPer1kTokens: number;
  maxTokens: number;
  isDefault: boolean;
  enabledPlans: string[];
}

interface VoiceProvider {
  id: string;
  name: string;
  voices: string[];
  latencyMs: number;
  costPerMin: number;
  enabled: boolean;
  apiConfigured: boolean;
}

const INITIAL_MODELS: LlmModel[] = [
  { id: "gemini-flash", name: "Gemini 2.5 Flash", provider: "Google", latencyMs: 320, costPer1kTokens: 0.001, maxTokens: 32768, isDefault: true, enabledPlans: ["Starter", "Pro", "Agency", "Enterprise"] },
  { id: "gpt4o-mini", name: "GPT-4o-mini", provider: "OpenAI", latencyMs: 280, costPer1kTokens: 0.002, maxTokens: 16384, isDefault: false, enabledPlans: ["Pro", "Agency", "Enterprise"] },
  { id: "gpt4o", name: "GPT-4o", provider: "OpenAI", latencyMs: 420, costPer1kTokens: 0.015, maxTokens: 128000, isDefault: false, enabledPlans: ["Agency", "Enterprise"] },
  { id: "claude-haiku", name: "Claude Haiku 4.5", provider: "Anthropic", latencyMs: 240, costPer1kTokens: 0.0008, maxTokens: 32000, isDefault: false, enabledPlans: ["Pro", "Agency", "Enterprise"] },
];

const INITIAL_VOICE_PROVIDERS: VoiceProvider[] = [
  { id: "cartesia", name: "Cartesia", voices: ["Gabriel (fr-FR)", "Sophie (fr-FR)", "Marie (fr-FR)"], latencyMs: 148, costPerMin: 0.015, enabled: true, apiConfigured: true },
  { id: "elevenlabs", name: "ElevenLabs", voices: ["Antoine (fr-FR)", "Emma (fr-FR)"], latencyMs: 210, costPerMin: 0.022, enabled: true, apiConfigured: true },
  { id: "deepgram", name: "Deepgram Aura", voices: ["Luna (fr-FR)"], latencyMs: 95, costPerMin: 0.008, enabled: false, apiConfigured: false },
];

const PLAN_COLORS: Record<string, string> = {
  Starter: "bg-white/10 text-on-surface-variant",
  Pro: "bg-primary/10 text-primary",
  Agency: "bg-secondary/10 text-secondary",
  Enterprise: "bg-orange-400/10 text-orange-400",
};

export function AdminConfig() {
  const [models, setModels] = useState(INITIAL_MODELS);
  const [voiceProviders, setVoiceProviders] = useState(INITIAL_VOICE_PROVIDERS);
  const [limits, setLimits] = useState({
    maxAgentsStarter: 2,
    maxAgentsPro: 10,
    maxAgentsAgency: 50,
    maxConcurrentCalls: 5,
    apiRateLimitPerMin: 100,
    webhookRetries: 3,
    dataRetentionDays: 90,
    trialDays: 14,
  });
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const setDefault = (id: string) => setModels((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  const toggleVoice = (id: string) => setVoiceProviders((prev) => prev.map((v) => v.id === id ? { ...v, enabled: !v.enabled } : v));

  const save = (section: string) => {
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2000);
  };

  return (
    <div className="space-y-7">
      {/* LLM Models */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Modèles LLM</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Configurer les LLMs disponibles par plan</p>
          </div>
        </div>
        <div className="space-y-3">
          {models.map((m) => (
            <div key={m.id} className="rounded-2xl border border-white/5 bg-card p-5">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-on-surface">{m.name}</p>
                    <span className="text-[10px] text-on-surface-variant">{m.provider}</span>
                    {m.isDefault && <span className="rounded-full bg-tertiary/10 px-2 py-0.5 text-[10px] font-bold text-tertiary">Défaut</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-5 text-xs text-on-surface-variant">
                    <span>Latence <span className="text-on-surface font-bold">{m.latencyMs}ms</span></span>
                    <span>Coût <span className="text-on-surface font-bold">{m.costPer1kTokens.toFixed(3)} €/1k tokens</span></span>
                    <span>Ctx max <span className="text-on-surface font-bold">{(m.maxTokens / 1000).toFixed(0)}k tokens</span></span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Starter", "Pro", "Agency", "Enterprise"].map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setModels((prev) => prev.map((mm) => mm.id === m.id ? {
                        ...mm,
                        enabledPlans: mm.enabledPlans.includes(plan) ? mm.enabledPlans.filter((p) => p !== plan) : [...mm.enabledPlans, plan]
                      } : mm))}
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition-all ${m.enabledPlans.includes(plan) ? PLAN_COLORS[plan] : "bg-white/5 text-on-surface-variant/30"}`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setDefault(m.id)}
                  disabled={m.isDefault}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${m.isDefault ? "bg-tertiary/10 text-tertiary" : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"}`}
                >
                  {m.isDefault ? "Défaut ✓" : "Définir défaut"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Voice Providers */}
      <section>
        <div className="mb-4">
          <h3 className="font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Providers TTS</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">Synthèse vocale disponible sur la plateforme</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {voiceProviders.map((v) => (
            <div key={v.id} className={`rounded-2xl border p-5 transition-all ${v.enabled ? "border-white/5 bg-card" : "border-white/[0.03] bg-surface-container-lowest opacity-60"}`}>
              <div className="mb-4 flex items-center justify-between">
                <p className="font-bold text-on-surface">{v.name}</p>
                <button
                  onClick={() => toggleVoice(v.id)}
                  className={`relative h-5.5 w-10 rounded-full transition-colors ${v.enabled ? "bg-primary" : "bg-surface-container-high"}`}
                >
                  <span className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-transform ${v.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="space-y-1.5 text-xs text-on-surface-variant">
                <div className="flex justify-between"><span>Latence</span><span className="text-on-surface font-bold">{v.latencyMs}ms</span></div>
                <div className="flex justify-between"><span>Coût</span><span className="text-on-surface font-bold">{v.costPerMin.toFixed(3)} €/min</span></div>
                <div className="flex justify-between"><span>API</span>
                  <span className={v.apiConfigured ? "text-tertiary font-bold" : "text-orange-400 font-bold"}>
                    {v.apiConfigured ? "Configurée ✓" : "Non configurée"}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {v.voices.map((vv) => <span key={vv} className="rounded-md bg-surface-container-low px-1.5 py-0.5 text-[10px] text-on-surface-variant">{vv}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform limits */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Limites globales</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Paramètres techniques de la plateforme</p>
          </div>
          <button
            onClick={() => save("limits")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${savedSection === "limits" ? "bg-tertiary/10 text-tertiary" : "bg-gradient-to-r from-primary to-secondary text-white"}`}
          >
            {savedSection === "limits" ? "Sauvegardé ✓" : "Sauvegarder"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(Object.entries(limits) as [keyof typeof limits, number][]).map(([key, val]) => {
            const labels: Record<string, string> = {
              maxAgentsStarter: "Agents max — Starter",
              maxAgentsPro: "Agents max — Pro",
              maxAgentsAgency: "Agents max — Agency",
              maxConcurrentCalls: "Appels simultanés max / workspace",
              apiRateLimitPerMin: "Rate limit API (req/min)",
              webhookRetries: "Tentatives webhook max",
              dataRetentionDays: "Rétention données (jours)",
              trialDays: "Durée essai gratuit (jours)",
            };
            return (
              <div key={key} className="rounded-xl border border-white/5 bg-card p-4">
                <label className="text-xs font-semibold text-on-surface-variant">{labels[key]}</label>
                <input
                  type="number"
                  className="input-field mt-2"
                  value={val}
                  onChange={(e) => setLimits((prev) => ({ ...prev, [key]: parseInt(e.target.value) || 0 }))}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
