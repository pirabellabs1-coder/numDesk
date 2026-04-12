"use client";

import { useState, useRef } from "react";
import { useVoices } from "@/hooks/use-voices";
import { Play, Pause, Loader2, Volume2 } from "lucide-react";

const providerColors: Record<string, string> = {
  cartesia: "text-tertiary",
  elevenlabs: "text-secondary",
  google: "text-primary",
  custom: "text-orange-400",
};

const qualityBadge: Record<string, { label: string; style: string }> = {
  premium: { label: "PREMIUM", style: "bg-secondary/10 text-secondary" },
  standard: { label: "STANDARD", style: "bg-white/5 text-on-surface-variant" },
  custom: { label: "CUSTOM", style: "bg-orange-400/10 text-orange-400" },
};

const providerLabel: Record<string, string> = {
  cartesia: "Cartesia",
  elevenlabs: "ElevenLabs",
  google: "Google",
  custom: "Custom",
};

export function TabParole({ agent, onChange }: { agent?: any; onChange?: (field: string, value: any) => void }) {
  const { data: voicesData } = useVoices();
  const [selectedVoiceId, setSelectedVoiceId] = useState(agent?.voiceId || "");
  const [hesitations, setHesitations] = useState(true);
  const [frNumbers, setFrNumbers] = useState(true);

  // Audio preview state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [loadingVoiceId, setLoadingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const voiceList = voicesData ?? [];

  const handleSelectVoice = (voice: any) => {
    const voiceLabel = `${providerLabel[voice.provider] || "Custom"} — ${voice.name}`;
    setSelectedVoiceId(voice.voiceId || voice.id);
    onChange?.("voiceId", voiceLabel);
    onChange?.("voiceProvider", voice.provider);
  };

  const handlePreview = async (voice: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = voice.voiceId || voice.id;

    // If already playing this voice, stop it
    if (playingVoiceId === vid && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingVoiceId(null);
      return;
    }

    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingVoiceId(null);
    }

    setLoadingVoiceId(vid);

    try {
      const res = await fetch("/api/voices/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceId: voice.voiceId || voice.id,
          provider: voice.provider,
        }),
      });

      if (!res.ok) {
        setLoadingVoiceId(null);
        return;
      }

      const data = await res.json();
      if (!data.audio) { setLoadingVoiceId(null); return; }

      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingVoiceId(null);
        audioRef.current = null;
      };

      await audio.play();
      setPlayingVoiceId(vid);
      setLoadingVoiceId(null);
    } catch {
      setLoadingVoiceId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Langue */}
      <Section title="Langue de démarrage">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">Code langue ISO</label>
          <select
            value={agent?.language || "fr-FR"}
            onChange={(e) => onChange?.("language", e.target.value)}
            className="input-field"
          >
            <option value="fr-FR">fr-FR — Français (France)</option>
            <option value="fr-BE">fr-BE — Français (Belgique)</option>
            <option value="en-US">en-US — English (US)</option>
            <option value="en-GB">en-GB — English (UK)</option>
            <option value="es-ES">es-ES — Español</option>
            <option value="de-DE">de-DE — Deutsch</option>
          </select>
        </div>
      </Section>

      {/* Voix */}
      <Section title="Voix par défaut">
        {voiceList.length === 0 ? (
          <p className="text-xs text-on-surface-variant">Chargement des voix disponibles...</p>
        ) : (
          <div className="space-y-2">
            {voiceList.map((v: any) => {
              const vid = v.voiceId || v.id;
              const isSelected = selectedVoiceId === vid || agent?.voiceId?.includes(v.name);
              const quality = qualityBadge[v.quality as string] ?? qualityBadge["standard"]!;
              const isPlaying = playingVoiceId === vid;
              const isLoading = loadingVoiceId === vid;

              return (
                <button
                  key={v.id}
                  onClick={() => handleSelectVoice(v)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-primary/40 bg-primary/5"
                      : "border-white/5 bg-surface-container-low hover:border-white/10"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
                    v.gender === "male" ? "from-primary to-secondary" : "from-secondary to-tertiary"
                  }`}>
                    <span className="material-symbols-outlined text-sm text-white">person</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface">
                      <span className={providerColors[v.provider] ?? "text-on-surface-variant"}>
                        {providerLabel[v.provider] || "Custom"}
                      </span>
                      {" — "}{v.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {v.gender === "male" ? "Homme" : "Femme"} · {v.language}
                    </p>
                  </div>

                  {/* Play preview button */}
                  <button
                    onClick={(e) => handlePreview(v, e)}
                    disabled={isLoading}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                      isPlaying
                        ? "bg-primary text-white"
                        : "bg-white/5 text-on-surface-variant hover:bg-white/10 hover:text-primary"
                    }`}
                    title="Écouter la voix"
                  >
                    {isLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : isPlaying ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} className="ml-0.5" />
                    )}
                  </button>

                  {/* Quality badge */}
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${quality.style}`}>
                    {quality.label}
                  </span>

                  {/* Selected check */}
                  {isSelected && (
                    <span className="material-symbols-outlined shrink-0 text-primary">check_circle</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
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
    <div className="rounded-2xl border border-white/5 bg-card p-5">
      <h3 className="mb-4 text-sm font-bold text-on-surface">{title}</h3>
      {children}
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-primary" : "bg-surface-container-high"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
