"use client";

import { Mic2, Play, Pause, Volume2, Sparkles, Globe, Loader2 } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { useState, useRef, useEffect } from "react";

const voices = [
  { name: "Sophie", provider: "Google", gender: "Femme", lang: "fr-FR", color: "primary" },
  { name: "Gabriel", provider: "Google", gender: "Homme", lang: "fr-FR", color: "secondary" },
  { name: "Marie", provider: "Google", gender: "Femme", lang: "fr-FR", color: "tertiary" },
  { name: "Wavenet-A", provider: "Google", gender: "Femme", lang: "fr-FR", color: "primary" },
];

const waveHeights = [12, 28, 20, 36, 16, 44, 24, 32, 18, 40, 14, 30, 22, 38, 10, 34, 26, 42, 20, 28, 16, 36, 24, 30, 18];

export function VoiceShowcase() {
  const [activeVoice, setActiveVoice] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, []);

  const handlePlay = async () => {
    // If already playing, pause
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // If we have a paused audio, resume
    if (audioRef.current && audioRef.current.paused && audioRef.current.currentTime > 0) {
      audioRef.current.play();
      setIsPlaying(true);
      startProgressTracking();
      return;
    }

    // Synthesize new audio
    setIsLoading(true);
    setProgress(0);
    try {
      const res = await fetch("/api/demo/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voice: voices[activeVoice]!.name }),
      });

      if (!res.ok) {
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      if (!data.audio) { setIsLoading(false); return; }

      // Create audio element
      if (audioRef.current) { audioRef.current.pause(); }
      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };

      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
      startProgressTracking();
    } catch {
      setIsLoading(false);
    }
  };

  const startProgressTracking = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    }, 100);
  };

  const handleVoiceSelect = (i: number) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveVoice(i);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left — Text */}
        <ScrollReveal direction="left">
          <div>
            <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">
              Voice Studio
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-on-surface md:text-5xl">
              Des voix <span className="text-gradient-primary">indiscernables</span>
              <br />
              de l&apos;humain
            </h2>
            <p className="mt-4 max-w-lg font-body text-sm leading-relaxed text-on-surface-variant">
              Accédez à 50+ voix premium en français via Cartesia, ElevenLabs et
              Google Cloud. Entraînez vos propres voix custom avec notre studio
              professionnel.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/5 bg-card p-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-secondary" />
                  <span className="font-display text-sm font-semibold text-on-surface">
                    Hésitations naturelles
                  </span>
                </div>
                <p className="mt-1 font-body text-xs text-on-surface-variant">
                  Euh, ah, bien, alors...
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-card p-4">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-tertiary" />
                  <span className="font-display text-sm font-semibold text-on-surface">
                    Multi-langue
                  </span>
                </div>
                <p className="mt-1 font-body text-xs text-on-surface-variant">
                  FR, EN, ES, DE, IT...
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-card p-4">
                <div className="flex items-center gap-2">
                  <Volume2 size={16} className="text-primary" />
                  <span className="font-display text-sm font-semibold text-on-surface">
                    Effets audio
                  </span>
                </div>
                <p className="mt-1 font-body text-xs text-on-surface-variant">
                  Vitesse, pitch, volume
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-card p-4">
                <div className="flex items-center gap-2">
                  <Mic2 size={16} className="text-error" />
                  <span className="font-display text-sm font-semibold text-on-surface">
                    Voix custom
                  </span>
                </div>
                <p className="mt-1 font-body text-xs text-on-surface-variant">
                  Entraînez la vôtre
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Right — Voice Player UI */}
        <ScrollReveal direction="right">
          <div className="rounded-2xl border border-white/5 bg-card p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <Mic2 size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-on-surface">
                    Voice Studio
                  </h4>
                  <p className="font-body text-[10px] text-on-surface-variant">
                    Sélectionnez une voix puis appuyez sur Play
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-tertiary/10 px-3 py-1 font-nav text-[9px] font-bold tracking-wider text-tertiary uppercase">
                Live
              </span>
            </div>

            {/* Voice list */}
            <div className="mt-5 space-y-2">
              {voices.map((voice, i) => (
                <button
                  key={voice.name}
                  onClick={() => handleVoiceSelect(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                    activeVoice === i
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-white/3 border border-transparent hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      activeVoice === i ? "bg-primary/20" : "bg-white/10"
                    }`}
                  >
                    <span className="font-display text-xs font-bold text-on-surface">
                      {voice.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className={`font-body text-sm font-medium ${activeVoice === i ? "text-primary" : "text-on-surface"}`}>
                      {voice.name}
                    </span>
                    <span className="ml-2 font-body text-[10px] text-on-surface-variant">
                      {voice.provider} &middot; {voice.gender} &middot; {voice.lang}
                    </span>
                  </div>
                  {activeVoice === i && isPlaying && (
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((bar) => (
                        <div
                          key={bar}
                          className="w-0.5 animate-waveform-1 rounded-full bg-primary"
                          style={{ height: 12, animationDelay: `${bar * 0.1}s` }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Waveform preview */}
            <div className="mt-5 rounded-xl bg-surface-container-lowest p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlay}
                  disabled={isLoading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white transition-transform hover:scale-105 disabled:opacity-60"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isPlaying ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} className="ml-0.5" />
                  )}
                </button>
                <div className="flex flex-1 items-end gap-[2px]" style={{ height: 44 }}>
                  {waveHeights.map((h, i) => {
                    const barProgress = duration > 0 ? (progress / duration) * waveHeights.length : 0;
                    const isPast = i < barProgress;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          isPlaying && isPast
                            ? "bg-gradient-to-t from-primary via-secondary to-tertiary"
                            : isPlaying
                              ? "bg-white/20"
                              : "bg-white/10"
                        }`}
                        style={{
                          height: isPlaying ? h : h * 0.4,
                          opacity: isPlaying ? (isPast ? 1 : 0.4) : 0.5,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-body text-[10px] text-on-surface-variant">
                  {formatTime(progress)}
                </span>
                <span className="font-body text-[10px] text-on-surface-variant">
                  {voices[activeVoice]!.name} — {voices[activeVoice]!.provider}
                </span>
                <span className="font-body text-[10px] text-on-surface-variant">
                  {duration > 0 ? formatTime(duration) : "0:05"}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
