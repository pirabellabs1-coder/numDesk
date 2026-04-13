"use client";

const LLM_MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", latency: "~200ms", cost: "Bas", isDefault: true },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", latency: "~350ms", cost: "Moyen", isDefault: false },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", latency: "~250ms", cost: "Bas", isDefault: false },
  { id: "claude-3.5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", latency: "~300ms", cost: "Bas", isDefault: false },
];

const VOICE_PROVIDERS = [
  { id: "cartesia", name: "Cartesia", languages: "FR, EN", quality: "Premium", latency: "~150ms", isDefault: true },
  { id: "elevenlabs", name: "ElevenLabs", languages: "FR, EN, +20", quality: "Premium", latency: "~200ms", isDefault: false },
  { id: "deepgram", name: "Deepgram", languages: "FR, EN", quality: "Standard", latency: "~100ms", isDefault: false },
];

export function AdminConfig() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Configuration IA</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Modèles LLM, providers TTS et limites globales de la plateforme</p>
      </div>

      {/* LLM Models */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Modèles LLM disponibles</h3>
        <div className="space-y-3">
          {LLM_MODELS.map((model) => (
            <div key={model.id} className={`flex items-center gap-4 rounded-xl border p-4 ${model.isDefault ? "border-primary/20 bg-primary/[0.03]" : "border-white/5"}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high"><span className="material-symbols-outlined text-on-surface-variant">psychology</span></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><p className="text-sm font-bold text-on-surface">{model.name}</p>{model.isDefault && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Par défaut</span>}</div>
                <p className="text-xs text-on-surface-variant">{model.provider} · {model.latency} · Coût : {model.cost}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Providers */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Providers TTS</h3>
        <div className="space-y-3">
          {VOICE_PROVIDERS.map((provider) => (
            <div key={provider.id} className={`flex items-center gap-4 rounded-xl border p-4 ${provider.isDefault ? "border-tertiary/20 bg-tertiary/[0.03]" : "border-white/5"}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high"><span className="material-symbols-outlined text-on-surface-variant">record_voice_over</span></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><p className="text-sm font-bold text-on-surface">{provider.name}</p>{provider.isDefault && <span className="rounded-full bg-tertiary/10 px-2 py-0.5 text-[10px] font-bold text-tertiary">Par défaut</span>}</div>
                <p className="text-xs text-on-surface-variant">Langues : {provider.languages} · Qualité : {provider.quality} · {provider.latency}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Limits */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Limites globales de la plateforme</h3>
          <span className="rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-bold text-secondary uppercase tracking-wider">Référence</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Rate limit", value: "100 req/min", icon: "speed" },
            { label: "Agents max / workspace", value: "Selon plan", icon: "smart_toy" },
            { label: "Contacts max / workspace", value: "5 000", icon: "contacts" },
            { label: "Contacts max / campagne", value: "500", icon: "campaign" },
            { label: "Rétention audio", value: "90 jours", icon: "schedule" },
            { label: "Taille max fichier", value: "10 Mo", icon: "upload_file" },
          ].map((limit) => (
            <div key={limit.label} className="flex items-center gap-3 rounded-xl border border-white/5 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high">
                <span className="material-symbols-outlined text-sm text-on-surface-variant">{limit.icon}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{limit.label}</p>
                <p className="text-sm font-bold text-on-surface">{limit.value}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-on-surface-variant">Ces valeurs sont définies au niveau de la plateforme. Contactez l'équipe technique pour modifier ces limites.</p>
      </div>
    </div>
  );
}
