"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/hooks/api-client";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const providerConfig: Record<string, { label: string; icon: string; color: string }> = {
  cartesia: { label: "Cartesia", icon: "graphic_eq", color: "text-tertiary" },
  elevenlabs: { label: "ElevenLabs", icon: "record_voice_over", color: "text-secondary" },
  google: { label: "Google TTS", icon: "cloud", color: "text-primary" },
  custom: { label: "Custom", icon: "auto_awesome", color: "text-orange-400" },
};

const qualityConfig: Record<string, { label: string; style: string }> = {
  premium: { label: "Premium", style: "bg-tertiary/10 text-tertiary" },
  standard: { label: "Standard", style: "bg-primary/10 text-primary" },
  custom: { label: "Custom", style: "bg-orange-400/10 text-orange-400" },
};

const trainingConfig: Record<string, { label: string; style: string }> = {
  ready: { label: "Prêt", style: "bg-white/5 text-on-surface-variant" },
  uploading: { label: "Upload...", style: "bg-primary/10 text-primary" },
  training: { label: "Entraînement...", style: "bg-orange-400/10 text-orange-400" },
  completed: { label: "Terminé", style: "bg-tertiary/10 text-tertiary" },
  failed: { label: "Échoué", style: "bg-error/10 text-error" },
};

export default function VoiceStudioPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState("library");

  // Fetch voices
  const { data: voicesData, isLoading } = useQuery({
    queryKey: ["voices"],
    queryFn: () => apiFetch<any[]>("/admin/voices"),
  });

  // Create voice
  const createVoice = useMutation({
    mutationFn: (input: any) => apiFetch<any>("/admin/voices", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["voices"] }); toast("Voix créée"); },
    onError: (e: any) => toast(e.message || "Erreur", "error"),
  });

  // Delete voice
  const deleteVoice = useMutation({
    mutationFn: (id: string) => apiFetch<any>(`/admin/voices/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["voices"] }); toast("Voix supprimée"); },
  });

  // Train voice
  const trainVoice = useMutation({
    mutationFn: (id: string) => apiFetch<any>(`/admin/voices/${id}/train`, { method: "POST" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["voices"] }); toast("Entraînement lancé !"); },
    onError: (e: any) => toast(e.message || "Erreur", "error"),
  });

  // Synthesize
  const [synthText, setSynthText] = useState("Bonjour, je suis votre assistant Callpme. Comment puis-je vous aider aujourd'hui ?");
  const [synthProvider, setSynthProvider] = useState("cartesia");
  const [synthVoiceId, setSynthVoiceId] = useState("");
  const [synthSpeed, setSynthSpeed] = useState(1.0);
  const [synthPitch, setSynthPitch] = useState(0);
  const [synthVolume, setSynthVolume] = useState(100);
  const [synthLoading, setSynthLoading] = useState(false);
  const [synthAudio, setSynthAudio] = useState<string | null>(null);

  const handleSynthesize = async () => {
    setSynthLoading(true);
    setSynthAudio(null);
    const hasEffects = synthSpeed !== 1.0 || synthPitch !== 0 || synthVolume !== 100;
    const provider = hasEffects ? "google" : synthProvider;
    const voiceId = provider === "google" ? (synthVoiceId || "fr-FR-Wavenet-A") : (synthVoiceId || undefined);
    try {
      const result = await apiFetch<any>("/admin/voices/synthesize", {
        method: "POST",
        body: JSON.stringify({ text: synthText, provider, voiceId, speed: synthSpeed, pitch: synthPitch, volume: synthVolume }),
      });
      setSynthAudio(`data:audio/mp3;base64,${result.audio}`);
      toast(`${provider === "google" ? "Google TTS" : synthProvider} · ${synthSpeed}x · pitch ${synthPitch}`);
    } catch (e: any) {
      toast(e.message || "Erreur de synthèse", "error");
    }
    setSynthLoading(false);
  };

  // Studio training controls (connected to synthesis)
  const [studioQuality, setStudioQuality] = useState(2);
  const [studioNoise, setStudioNoise] = useState(50);
  const [studioLatency, setStudioLatency] = useState(2);
  const [studioTestText, setStudioTestText] = useState("Bonjour, je suis votre nouvel assistant vocal Callpme. Je suis là pour vous aider.");
  const [studioTestAudio, setStudioTestAudio] = useState<string | null>(null);
  const [studioTestLoading, setStudioTestLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [waveAnimFrame, setWaveAnimFrame] = useState(0);

  // Animate waveform during playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setWaveAnimFrame((prev) => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Test synthesis — uses Google TTS when effects are modified (only provider that supports speed/pitch/volume)
  const handleStudioTest = async () => {
    setStudioTestLoading(true);
    setStudioTestAudio(null);
    setIsPlaying(false);
    setPlayProgress(0);

    // Force Google TTS when effects are used (only provider supporting speed/pitch/volume)
    const hasEffects = synthSpeed !== 1.0 || synthPitch !== 0 || synthVolume !== 100;
    const effectiveProvider = hasEffects ? "google" : synthProvider;
    // When forcing Google, use a Google voice ID, not a Cartesia UUID
    const effectiveVoiceId = effectiveProvider === "google" ? "fr-FR-Wavenet-A" : (synthVoiceId || undefined);

    try {
      const result = await apiFetch<any>("/admin/voices/synthesize", {
        method: "POST",
        body: JSON.stringify({
          text: studioTestText,
          provider: effectiveProvider,
          voiceId: effectiveVoiceId,
          speed: synthSpeed,
          pitch: synthPitch,
          volume: synthVolume,
        }),
      });
      const audioUrl = `data:audio/mp3;base64,${result.audio}`;
      setStudioTestAudio(audioUrl);
      toast(`${effectiveProvider === "google" ? "Google TTS" : "Cartesia"} · Vitesse ${synthSpeed}x · Pitch ${synthPitch > 0 ? "+" : ""}${synthPitch} · Volume ${synthVolume}%`);

      // Auto-play with animation
      const audio = new Audio(audioUrl);
      setAudioRef(audio);
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => { setIsPlaying(false); setPlayProgress(100); };
      audio.ontimeupdate = () => {
        if (audio.duration) setPlayProgress((audio.currentTime / audio.duration) * 100);
      };
      audio.play();
    } catch (e: any) {
      toast(e.message || `Erreur ${effectiveProvider}`, "error");
    }
    setStudioTestLoading(false);
  };

  const handleStudioStop = () => {
    if (audioRef) { audioRef.pause(); audioRef.currentTime = 0; }
    setIsPlaying(false);
    setPlayProgress(0);
  };

  const handleStudioReplay = () => {
    if (audioRef) { audioRef.currentTime = 0; audioRef.play(); }
  };

  // New custom voice form
  const [showCreate, setShowCreate] = useState(false);
  const [newVoice, setNewVoice] = useState({ name: "", language: "fr-FR", gender: "female" });

  // Preview audio per voice
  const [previewLoading, setPreviewLoading] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<Record<string, string>>({});

  const handlePreview = async (voice: any) => {
    // If already previewed, just play
    if (previewAudio[voice.id]) {
      const audio = new Audio(previewAudio[voice.id]);
      audio.play();
      return;
    }

    setPreviewLoading(voice.id);
    try {
      const result = await apiFetch<any>("/admin/voices/synthesize", {
        method: "POST",
        body: JSON.stringify({
          text: `Bonjour, je suis ${voice.name}. Je suis disponible pour vos appels sur Callpme.`,
          provider: voice.provider,
          voiceId: voice.voiceId || undefined,
        }),
      });
      const audioUrl = `data:audio/mp3;base64,${result.audio}`;
      setPreviewAudio((prev) => ({ ...prev, [voice.id]: audioUrl }));
      const audio = new Audio(audioUrl);
      audio.play();
      toast(`Preview de ${voice.name}`);
    } catch (e: any) {
      toast(`Clé API ${voice.provider} requise pour la preview`, "error");
    }
    setPreviewLoading(null);
  };

  // Import voice by ID
  const [showImport, setShowImport] = useState(false);
  const [importVoice, setImportVoice] = useState({ name: "", provider: "cartesia" as string, voiceId: "", language: "fr-FR", gender: "female" });

  const handleImport = async () => {
    if (!importVoice.name.trim() || !importVoice.voiceId.trim()) return;
    try {
      await createVoice.mutateAsync({
        name: importVoice.name,
        provider: importVoice.provider,
        voiceId: importVoice.voiceId,
        language: importVoice.language,
        gender: importVoice.gender,
        quality: importVoice.provider === "google" ? "standard" : "premium",
      });
      setShowImport(false);
      setImportVoice({ name: "", provider: "cartesia", voiceId: "", language: "fr-FR", gender: "female" });
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  // Filter
  const [filterProvider, setFilterProvider] = useState<string | null>(null);

  if (isLoading) return <PageSkeleton />;
  const voiceList = voicesData ?? [];
  const filteredVoices = filterProvider ? voiceList.filter((v: any) => v.provider === filterProvider) : voiceList;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl sm:text-3xl text-secondary">graphic_eq</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Voice Studio</h1>
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">{voiceList.length} voix disponibles · Gérez vos voix TTS</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 overflow-x-auto border-b border-white/5">
        {[
          { id: "library", label: "Bibliothèque", icon: "library_music" },
          { id: "studio", label: "Studio", icon: "mic" },
          { id: "test", label: "Test", icon: "play_circle" },
          { id: "providers", label: "Providers", icon: "settings_suggest" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-2 border-b-2 px-4 sm:px-6 py-3 text-sm font-bold transition-all ${tab === t.id ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>
            <span className="material-symbols-outlined text-sm">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── BIBLIOTHÈQUE ── */}
      {tab === "library" && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header + Import button */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">{filteredVoices.length} voix affichées</p>
            <button onClick={() => setShowImport(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold text-white">
              <span className="material-symbols-outlined text-sm">add</span>Importer une voix
            </button>
          </div>

          {/* Import form */}
          {showImport && (
            <div className="rounded-2xl border border-primary/20 bg-card p-4 sm:p-6">
              <h3 className="mb-4 text-sm font-bold text-on-surface">Importer une voix par ID</h3>
              <p className="mb-4 text-xs text-on-surface-variant">Ajoutez une voix depuis Cartesia, ElevenLabs ou Google Cloud TTS en utilisant son Voice ID.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Provider</label>
                  <select value={importVoice.provider} onChange={(e) => setImportVoice({ ...importVoice, provider: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="cartesia">Cartesia (Premium FR)</option>
                    <option value="elevenlabs">ElevenLabs (Premium)</option>
                    <option value="google">Google Cloud TTS (Standard)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nom de la voix</label>
                  <input value={importVoice.name} onChange={(e) => setImportVoice({ ...importVoice, name: e.target.value })} placeholder="Ex: Sophie, Gabriel..." className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Voice ID</label>
                  <input value={importVoice.voiceId} onChange={(e) => setImportVoice({ ...importVoice, voiceId: e.target.value })} placeholder={importVoice.provider === "cartesia" ? "a0e99841-438c-..." : importVoice.provider === "elevenlabs" ? "EXAVITQu4vr4xn..." : "fr-FR-Wavenet-A"} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 font-mono text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Langue</label>
                    <select value={importVoice.language} onChange={(e) => setImportVoice({ ...importVoice, language: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                      <option value="fr-FR">Français</option>
                      <option value="en-US">Anglais</option>
                      <option value="es-ES">Espagnol</option>
                      <option value="de-DE">Allemand</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Genre</label>
                    <select value={importVoice.gender} onChange={(e) => setImportVoice({ ...importVoice, gender: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                      <option value="female">Femme</option>
                      <option value="male">Homme</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Provider help */}
              <div className="mt-4 rounded-lg border border-white/5 bg-surface-container-lowest p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Où trouver le Voice ID ?</p>
                {importVoice.provider === "cartesia" && (
                  <p className="mt-1 text-xs text-on-surface-variant">Connectez-vous sur <strong className="text-on-surface">play.cartesia.ai</strong> → Choisissez une voix → Copiez l&apos;ID (format UUID : a0e99841-...)</p>
                )}
                {importVoice.provider === "elevenlabs" && (
                  <p className="mt-1 text-xs text-on-surface-variant">Connectez-vous sur <strong className="text-on-surface">elevenlabs.io</strong> → Voice Library → Cliquez sur une voix → Copiez le Voice ID</p>
                )}
                {importVoice.provider === "google" && (
                  <p className="mt-1 text-xs text-on-surface-variant">Utilisez les noms de voix Google : <code className="text-primary">fr-FR-Wavenet-A</code>, <code className="text-primary">fr-FR-Neural2-B</code>, etc. Voir la <strong className="text-on-surface">liste complète</strong> sur cloud.google.com/text-to-speech/docs/voices</p>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button onClick={() => setShowImport(false)} className="text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
                <button onClick={handleImport} disabled={createVoice.isPending || !importVoice.name.trim() || !importVoice.voiceId.trim()} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                  <span className="material-symbols-outlined text-sm">add</span>
                  {createVoice.isPending ? "Import..." : "Importer la voix"}
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2">
            <button onClick={() => setFilterProvider(null)} className={`rounded-lg px-4 py-2 text-xs font-bold ${!filterProvider ? "bg-primary/10 text-primary" : "text-on-surface-variant"}`}>Toutes ({voiceList.length})</button>
            {Object.entries(providerConfig).map(([key, cfg]) => (
              <button key={key} onClick={() => setFilterProvider(filterProvider === key ? null : key)} className={`flex items-center gap-1 rounded-lg px-4 py-2 text-xs font-bold ${filterProvider === key ? "bg-primary/10 text-primary" : "text-on-surface-variant"}`}>
                <span className={`material-symbols-outlined text-xs ${cfg.color}`}>{cfg.icon}</span>
                {cfg.label} ({voiceList.filter((v: any) => v.provider === key).length})
              </button>
            ))}
          </div>

          {filteredVoices.length === 0 ? (
            <EmptyState icon="graphic_eq" title="Aucune voix" description="Ajoutez des voix depuis l'onglet Studio ou configurez vos providers." />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredVoices.map((voice: any) => {
                const provider = providerConfig[voice.provider as string] ?? providerConfig["custom"]!;
                const quality = qualityConfig[voice.quality as string] ?? qualityConfig["standard"]!;
                const training = trainingConfig[voice.trainingStatus as string] ?? trainingConfig["ready"]!;
                return (
                  <div key={voice.id} className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5 transition-all hover:border-white/10">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-high">
                          <span className={`material-symbols-outlined text-xl ${provider.color}`}>{provider.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{voice.name}</p>
                          <p className="text-[10px] text-on-surface-variant">{provider.label} · {voice.language} · {voice.gender === "female" ? "Femme" : "Homme"}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${quality.style}`}>{quality.label}</span>
                    </div>

                    {voice.provider === "custom" && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={`font-bold ${training.style.split(" ")[1]}`}>{training.label}</span>
                          {voice.trainingStatus === "training" && <span className="text-on-surface-variant">{voice.trainingProgress}%</span>}
                        </div>
                        {voice.trainingStatus === "training" && (
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                            <div className="h-full rounded-full bg-orange-400 transition-all" style={{ width: `${voice.trainingProgress}%` }} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Audio preview */}
                    {previewAudio[voice.id] && (
                      <div className="mb-3">
                        <audio controls src={previewAudio[voice.id]} className="h-8 w-full" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(voice)}
                        disabled={previewLoading === voice.id}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 py-2 text-xs font-bold text-on-surface-variant transition-all hover:border-primary/30 hover:text-primary disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">{previewLoading === voice.id ? "hourglass_empty" : previewAudio[voice.id] ? "replay" : "play_arrow"}</span>
                        {previewLoading === voice.id ? "Synthèse..." : previewAudio[voice.id] ? "Réécouter" : "Écouter"}
                      </button>
                      {voice.provider === "custom" && voice.trainingStatus === "ready" && (
                        <button onClick={() => trainVoice.mutate(voice.id)} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-primary to-secondary py-2 text-xs font-bold text-white">
                          <span className="material-symbols-outlined text-sm">model_training</span>Entraîner
                        </button>
                      )}
                      <button onClick={() => deleteVoice.mutate(voice.id)} className="rounded-lg border border-white/10 px-3 py-2 text-on-surface-variant hover:text-error">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── STUDIO ── */}
      {tab === "studio" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Studio de création vocale</h2>
              <p className="mt-1 text-xs text-on-surface-variant">Entraînez vos propres voix à partir d&apos;échantillons audio</p>
            </div>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white">
              <span className="material-symbols-outlined text-sm">add</span>Nouvelle voix
            </button>
          </div>

          {/* Pipeline steps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { step: 1, icon: "settings", label: "Configurer", desc: "Nom, langue, genre" },
              { step: 2, icon: "cloud_upload", label: "Uploader", desc: "3-30 min d'audio" },
              { step: 3, icon: "model_training", label: "Entraîner", desc: "IA apprend la voix" },
              { step: 4, icon: "check_circle", label: "Utiliser", desc: "Disponible partout" },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3 rounded-xl border border-white/5 bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">{s.step}</div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{s.label}</p>
                  <p className="text-[10px] text-on-surface-variant">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {showCreate && (
            <div className="rounded-2xl border border-primary/20 bg-card p-4 sm:p-6">
              <h3 className="mb-2 text-sm font-bold text-on-surface">Étape 1 — Configuration</h3>
              <p className="mb-4 text-xs text-on-surface-variant">Définissez les caractéristiques de votre voix</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nom de la voix</label>
                  <input value={newVoice.name} onChange={(e) => setNewVoice({ ...newVoice, name: e.target.value })} placeholder="Ex: Marie FR, Assistant Pro..." className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Langue</label>
                  <select value={newVoice.language} onChange={(e) => setNewVoice({ ...newVoice, language: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="fr-FR">Français (France)</option>
                    <option value="fr-BE">Français (Belgique)</option>
                    <option value="en-US">Anglais (US)</option>
                    <option value="en-GB">Anglais (UK)</option>
                    <option value="es-ES">Espagnol</option>
                    <option value="de-DE">Allemand</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Genre</label>
                  <select value={newVoice.gender} onChange={(e) => setNewVoice({ ...newVoice, gender: e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="female">Femme</option>
                    <option value="male">Homme</option>
                  </select>
                </div>
              </div>

              {/* Step 2 — Upload */}
              <div className="mt-6">
                <h3 className="mb-2 text-sm font-bold text-on-surface">Étape 2 — Échantillons audio</h3>
                <p className="mb-3 text-xs text-on-surface-variant">Uploadez des fichiers audio clairs de la voix à cloner. Plus vous fournissez d&apos;audio, meilleure sera la qualité.</p>

                <div className="rounded-xl border-2 border-dashed border-white/10 bg-surface-container-lowest p-6 transition-all hover:border-primary/30">
                  <div className="flex items-start gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                      <span className="material-symbols-outlined text-2xl text-primary">cloud_upload</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-on-surface">Glissez vos fichiers audio ici</p>
                      <p className="mt-1 text-xs text-on-surface-variant">Formats acceptés : .wav, .mp3, .ogg, .flac</p>
                      <input type="file" accept=".wav,.mp3,.ogg,.flac" multiple className="mt-3 text-xs text-on-surface-variant file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-primary" onChange={(e) => { const count = e.target.files?.length ?? 0; toast(`${count} fichier(s) sélectionné(s) — prêt pour l'upload`, "info"); }} />
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: "timer", label: "Durée", value: "3-30 min", desc: "d'audio total" },
                    { icon: "mic", label: "Qualité", value: "Voix claire", desc: "sans bruit de fond" },
                    { icon: "volume_up", label: "Volume", value: "Constant", desc: "pas de variations" },
                    { icon: "person", label: "Locuteur", value: "Un seul", desc: "même personne" },
                  ].map((r) => (
                    <div key={r.label} className="rounded-lg bg-surface-container-lowest p-3">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant">{r.icon}</span>
                      <p className="mt-1 text-[10px] font-bold text-on-surface">{r.value}</p>
                      <p className="text-[9px] text-on-surface-variant">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3 — Audio Editor (CapCut Style) */}
              <div className="mt-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-secondary">movie_edit</span>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">Étape 3 — Éditeur Audio {(synthSpeed !== 1.0 || synthPitch !== 0 || synthVolume !== 100) && <span className="ml-2 text-[9px] font-normal text-primary">(effets → Google TTS)</span>}</h3>
                    <p className="text-[10px] text-on-surface-variant">Studio de traitement professionnel</p>
                  </div>
                </div>

                {/* ── EDITOR CONTAINER (Dark editor look) ── */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D0E12]">

                  {/* Top toolbar */}
                  <div className="flex items-center justify-between border-b border-white/5 bg-[#121317] px-4 py-2">
                    <div className="flex items-center gap-3">
                      {/* Provider selector */}
                      {[
                        { id: "cartesia", label: "Cartesia", icon: "graphic_eq" },
                        { id: "google", label: "Google", icon: "cloud" },
                      ].map((p) => (
                        <button key={p.id} onClick={() => setSynthProvider(p.id)} className={`flex items-center gap-1.5 rounded px-3 py-1 text-[10px] font-bold transition-all ${synthProvider === p.id ? "bg-primary/20 text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>
                          <span className="material-symbols-outlined text-xs">{p.icon}</span>{p.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-on-surface-variant/50">
                        {synthSpeed.toFixed(1)}x · {synthPitch > 0 ? "+" : ""}{synthPitch}st · {synthVolume}%
                      </span>
                      <button onClick={() => { setSynthSpeed(1.0); setSynthPitch(0); setSynthVolume(100); }} className="rounded px-2 py-0.5 text-[9px] text-on-surface-variant hover:text-on-surface">Reset</button>
                    </div>
                  </div>

                  {/* Waveform / Timeline area — REACTIVE to sliders */}
                  <div className="relative h-32 bg-[#0A0B0F] px-4 py-3">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((y) => (
                      <div key={y} className="absolute left-4 right-4 border-t border-white/[0.03]" style={{ top: `${y}%` }} />
                    ))}

                    {/* Volume meter (left side) */}
                    <div className="absolute left-1 top-2 bottom-2 w-1.5 overflow-hidden rounded-full bg-white/5">
                      <div className="absolute bottom-0 w-full rounded-full bg-gradient-to-t from-tertiary to-primary transition-all duration-300" style={{ height: `${synthVolume}%` }} />
                    </div>

                    {/* Waveform — ANIMATED during playback, reactive to sliders */}
                    <div className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 items-center gap-[1px]">
                      {Array.from({ length: 100 }, (_, i) => {
                        const freq = i * 0.15 * synthSpeed;
                        const pitchShift = synthPitch * 0.1;
                        const baseWave = Math.sin(freq + pitchShift) * 25 + Math.sin(freq * 2.7 + pitchShift * 2) * 15 + Math.sin(freq * 0.5) * 10;

                        // During playback: add live animation based on position
                        const playPos = (playProgress / 100) * 100;
                        const distFromPlayhead = Math.abs(i - playPos);
                        const liveBoost = isPlaying && distFromPlayhead < 15 ? Math.sin(waveAnimFrame * 0.3 + i * 0.5) * 12 * (1 - distFromPlayhead / 15) : 0;

                        // Bars that have been "played" glow brighter
                        const isPlayed = i < playPos;
                        const glowFactor = isPlayed ? 1.2 : 0.6;

                        const h = Math.abs(baseWave + liveBoost) * (synthVolume / 100) * glowFactor;
                        const intensity = Math.min(1, h / 50);

                        const r = Math.round(79 + synthPitch * 3);
                        const g = Math.round(127 - Math.abs(synthPitch) * 5);
                        const b = 255;
                        const alpha = isPlayed ? 0.8 : 0.35;

                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-[1px]">
                            <div className="w-full rounded-t-sm" style={{ height: `${Math.max(1, h)}px`, background: `linear-gradient(to top, rgba(${r},${g},${b},${alpha}), rgba(123,92,250,${alpha * 0.7}))`, transition: isPlaying ? "height 0.05s" : "all 0.3s ease" }} />
                            <div className="w-full rounded-b-sm" style={{ height: `${Math.max(1, h * 0.7)}px`, background: `linear-gradient(to bottom, rgba(${r},${g},${b},${alpha * 0.6}), rgba(0,212,170,${alpha * 0.4}))`, transition: isPlaying ? "height 0.05s" : "all 0.3s ease" }} />
                          </div>
                        );
                      })}
                    </div>

                    {/* Playhead — moves with progress */}
                    <div className="absolute top-0 bottom-0 transition-all duration-100" style={{ left: `${Math.max(2, 2 + playProgress * 0.96)}%` }}>
                      <div className="h-full w-px bg-primary shadow-[0_0_6px_rgba(79,127,255,0.6)]" />
                      <div className="absolute -left-1.5 -top-0.5 h-3 w-3 rounded-full bg-primary shadow-lg" />
                    </div>

                    {/* Status */}
                    <div className="absolute right-6 top-2 flex items-center gap-2">
                      {isPlaying && (
                        <div className="flex items-center gap-1 rounded bg-tertiary/20 px-1.5 py-0.5 text-[8px] font-bold text-tertiary">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-tertiary" />
                          </span>
                          LIVE
                        </div>
                      )}
                      <div className="rounded bg-black/40 px-1.5 py-0.5 text-[8px] text-on-surface-variant/60">{synthSpeed.toFixed(1)}x · {synthPitch > 0 ? "+" : ""}{synthPitch}st · {synthVolume}%</div>
                    </div>

                    {/* Playhead */}
                    {studioTestAudio && (
                      <div className="absolute top-0 bottom-0 left-1/3 w-px bg-primary shadow-[0_0_8px_rgba(79,127,255,0.5)]">
                        <div className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-primary" />
                      </div>
                    )}

                    {/* Time markers */}
                    <div className="absolute bottom-1 left-4 text-[8px] text-on-surface-variant/30">0:00</div>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-on-surface-variant/30">0:03</div>
                    <div className="absolute bottom-1 right-4 text-[8px] text-on-surface-variant/30">0:06</div>
                  </div>

                  {/* Transport controls */}
                  <div className="flex items-center justify-center gap-4 border-t border-white/5 bg-[#121317] py-3">
                    <button className="rounded-full p-1.5 text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined text-lg">skip_previous</span></button>
                    <button onClick={handleStudioTest} disabled={studioTestLoading || !studioTestText.trim()} className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 disabled:opacity-50">
                      <span className="material-symbols-outlined text-xl">{studioTestLoading ? "hourglass_empty" : "play_arrow"}</span>
                    </button>
                    <button className="rounded-full p-1.5 text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined text-lg">skip_next</span></button>
                    <button onClick={handleStudioStop} className="rounded-full p-1.5 text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined text-lg">stop</span></button>
                    {studioTestAudio && (
                      <button onClick={handleStudioReplay} className="rounded-full p-1.5 text-tertiary hover:text-on-surface"><span className="material-symbols-outlined text-lg">replay</span></button>
                    )}
                  </div>

                  {/* Audio result player */}
                  {studioTestAudio && (
                    <div className="border-t border-white/5 bg-[#0F1117] px-4 py-2">
                      <audio controls src={studioTestAudio} className="h-8 w-full" />
                    </div>
                  )}

                  {/* Effects panel */}
                  <div className="border-t border-white/5 bg-[#121317]">
                    <div className="flex items-center gap-1 border-b border-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      <span className="material-symbols-outlined text-xs">tune</span>Effets
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:divide-x divide-white/5">
                      {/* Speed */}
                      <div className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs text-primary">speed</span><span className="text-[10px] font-bold text-on-surface">Vitesse</span></div>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">{synthSpeed.toFixed(1)}x</span>
                        </div>
                        <input type="range" min="0.5" max="2.0" step="0.1" value={synthSpeed} onChange={(e) => setSynthSpeed(+e.target.value)} className="w-full accent-primary" />
                        <div className="mt-1 flex justify-between text-[8px] text-on-surface-variant/40"><span>0.5x</span><span>1.0x</span><span>2.0x</span></div>
                      </div>

                      {/* Pitch */}
                      <div className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs text-secondary">music_note</span><span className="text-[10px] font-bold text-on-surface">Pitch</span></div>
                          <span className="rounded bg-secondary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-secondary">{synthPitch > 0 ? "+" : ""}{synthPitch}st</span>
                        </div>
                        <input type="range" min="-10" max="10" step="1" value={synthPitch} onChange={(e) => setSynthPitch(+e.target.value)} className="w-full accent-secondary" />
                        <div className="mt-1 flex justify-between text-[8px] text-on-surface-variant/40"><span>-10</span><span>0</span><span>+10</span></div>
                      </div>

                      {/* Volume */}
                      <div className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs text-tertiary">volume_up</span><span className="text-[10px] font-bold text-on-surface">Volume</span></div>
                          <span className="rounded bg-tertiary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-tertiary">{synthVolume}%</span>
                        </div>
                        <input type="range" min="10" max="100" step="5" value={synthVolume} onChange={(e) => setSynthVolume(+e.target.value)} className="w-full accent-tertiary" />
                        <div className="mt-1 flex justify-between text-[8px] text-on-surface-variant/40"><span>10%</span><span>50%</span><span>100%</span></div>
                      </div>
                    </div>

                    {/* Second row effects */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:divide-x divide-white/5 border-t border-white/5">
                      {/* Noise */}
                      <div className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs text-error">noise_aware</span><span className="text-[10px] font-bold text-on-surface">Bruit</span></div>
                          <span className="rounded bg-error/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-error">-{studioNoise}%</span>
                        </div>
                        <input type="range" min="0" max="100" step="10" value={studioNoise} onChange={(e) => setStudioNoise(+e.target.value)} className="w-full accent-error" />
                        <div className="mt-1 flex justify-between text-[8px] text-on-surface-variant/40"><span>Off</span><span>Modéré</span><span>Max</span></div>
                      </div>

                      {/* Quality */}
                      <div className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs text-orange-400">hd</span><span className="text-[10px] font-bold text-on-surface">Qualité</span></div>
                          <span className="rounded bg-orange-400/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-orange-400">{studioQuality === 1 ? "Draft" : studioQuality === 2 ? "Std" : "HD"}</span>
                        </div>
                        <input type="range" min="1" max="3" step="1" value={studioQuality} onChange={(e) => setStudioQuality(+e.target.value)} className="w-full accent-orange-400" />
                        <div className="mt-1 flex justify-between text-[8px] text-on-surface-variant/40"><span>Draft</span><span>Standard</span><span>HD</span></div>
                      </div>

                      {/* Model */}
                      <div className="p-4">
                        <div className="mb-3 flex items-center gap-1.5"><span className="material-symbols-outlined text-xs text-on-surface-variant">psychology</span><span className="text-[10px] font-bold text-on-surface">Modèle</span></div>
                        <select className="w-full rounded bg-[#0A0B0F] px-2 py-1.5 text-[10px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                          <option>XTTS v2</option>
                          <option>Fish Speech</option>
                          <option>Bark</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Text input area */}
                  <div className="border-t border-white/5 bg-[#0F1117] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      <span className="material-symbols-outlined text-xs">text_fields</span>Texte à synthétiser
                    </div>
                    <textarea value={studioTestText} onChange={(e) => setStudioTestText(e.target.value)} rows={2} className="w-full rounded-lg bg-[#0A0B0F] px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Tapez votre texte ici..." />
                  </div>

                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex items-center justify-between">
                <button onClick={() => setShowCreate(false)} className="text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      if (!newVoice.name.trim()) return;
                      await createVoice.mutateAsync({ ...newVoice, provider: "custom", quality: "custom" });
                      toast("Voix créée — uploadez des échantillons puis lancez l'entraînement");
                      setShowCreate(false);
                      setNewVoice({ name: "", language: "fr-FR", gender: "female" });
                    }}
                    disabled={createVoice.isPending || !newVoice.name.trim()}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    {createVoice.isPending ? "Création..." : "Créer et configurer"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Custom voices list with detail */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-on-surface">Vos voix custom ({voiceList.filter((v: any) => v.provider === "custom").length})</h3>
            {voiceList.filter((v: any) => v.provider === "custom").length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-card p-8 text-center">
                <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant/20">auto_awesome</span>
                <p className="text-sm text-on-surface-variant">Aucune voix custom</p>
                <p className="mt-1 text-xs text-on-surface-variant/50">Cliquez sur &quot;Nouvelle voix&quot; pour commencer</p>
              </div>
            ) : (
              <div className="space-y-3">
                {voiceList.filter((v: any) => v.provider === "custom").map((v: any) => (
                  <div key={v.id} className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-400/10">
                        <span className="material-symbols-outlined text-xl text-orange-400">auto_awesome</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-on-surface">{v.name}</p>
                        <p className="text-[10px] text-on-surface-variant">{v.language} · {v.gender === "female" ? "Femme" : "Homme"}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${(trainingConfig[v.trainingStatus as string] ?? trainingConfig["ready"]!).style}`}>
                        {(trainingConfig[v.trainingStatus as string] ?? trainingConfig["ready"]!).label}
                      </span>
                      {v.trainingStatus === "training" && (
                        <div className="w-24">
                          <div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full bg-orange-400 transition-all" style={{ width: `${v.trainingProgress}%` }} /></div>
                          <p className="mt-1 text-center text-[9px] text-on-surface-variant">{v.trainingProgress}%</p>
                        </div>
                      )}
                      {v.trainingStatus === "ready" && (
                        <button onClick={() => trainVoice.mutate(v.id)} disabled={trainVoice.isPending} className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">
                          <span className="material-symbols-outlined text-sm">model_training</span>Lancer l&apos;entraînement
                        </button>
                      )}
                      {v.trainingStatus === "completed" && (
                        <button onClick={() => handlePreview(v)} disabled={previewLoading === v.id} className="flex items-center gap-1 rounded-lg border border-tertiary/30 px-3 py-1.5 text-xs font-bold text-tertiary">
                          <span className="material-symbols-outlined text-sm">{previewLoading === v.id ? "hourglass_empty" : "play_arrow"}</span>Tester
                        </button>
                      )}
                      <button onClick={() => deleteVoice.mutate(v.id)} className="rounded-lg border border-white/10 px-2 py-1.5 text-on-surface-variant hover:text-error">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>

                    {/* Training detail for in-progress */}
                    {v.trainingStatus === "training" && (
                      <div className="mt-3 rounded-lg bg-surface-container-lowest p-3">
                        <div className="flex items-center gap-2 text-xs text-orange-400">
                          <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                          Entraînement en cours — ne fermez pas cette page
                        </div>
                      </div>
                    )}

                    {v.trainingStatus === "completed" && previewAudio[v.id] && (
                      <div className="mt-3">
                        <audio controls src={previewAudio[v.id]} className="h-8 w-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary">tips_and_updates</span>
              <div>
                <p className="text-sm font-bold text-on-surface">Conseils pour un meilleur résultat</p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-on-surface-variant">
                  <div className="flex items-start gap-2"><span className="material-symbols-outlined text-xs text-tertiary">check</span>Utilisez un micro de qualité (USB ou XLR)</div>
                  <div className="flex items-start gap-2"><span className="material-symbols-outlined text-xs text-tertiary">check</span>Enregistrez dans un environnement silencieux</div>
                  <div className="flex items-start gap-2"><span className="material-symbols-outlined text-xs text-tertiary">check</span>Parlez naturellement, pas comme un robot</div>
                  <div className="flex items-start gap-2"><span className="material-symbols-outlined text-xs text-tertiary">check</span>Variez les phrases et les intonations</div>
                  <div className="flex items-start gap-2"><span className="material-symbols-outlined text-xs text-error">close</span>Évitez la musique de fond</div>
                  <div className="flex items-start gap-2"><span className="material-symbols-outlined text-xs text-error">close</span>Pas de plusieurs locuteurs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TEST ── */}
      {tab === "test" && (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Test de synthèse vocale</h2>
            <p className="mt-1 text-xs text-on-surface-variant">Testez n&apos;importe quelle voix avec votre texte</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Texte à synthétiser</label>
                <textarea value={synthText} onChange={(e) => setSynthText(e.target.value)} rows={3} className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Provider</label>
                  <select value={synthProvider} onChange={(e) => setSynthProvider(e.target.value)} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="cartesia">Cartesia (Premium FR)</option>
                    <option value="elevenlabs">ElevenLabs (Premium)</option>
                    <option value="google">Google Cloud TTS (Standard)</option>
                    <option value="custom">Custom (Entraîné)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Voice ID (optionnel)</label>
                  <input value={synthVoiceId} onChange={(e) => setSynthVoiceId(e.target.value)} placeholder="Laisser vide pour la voix par défaut" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              {/* Voice controls */}
              <div className="rounded-xl border border-white/5 bg-surface-container-lowest p-4">
                <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Contrôles de voix</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-xs text-on-surface-variant">Vitesse</label>
                      <span className="text-xs font-bold text-on-surface">{synthSpeed.toFixed(1)}x</span>
                    </div>
                    <input type="range" min="0.5" max="2.0" step="0.1" value={synthSpeed} onChange={(e) => setSynthSpeed(+e.target.value)} className="w-full accent-primary" />
                    <div className="flex justify-between text-[9px] text-on-surface-variant/50"><span>Lent</span><span>Normal</span><span>Rapide</span></div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-xs text-on-surface-variant">Pitch</label>
                      <span className="text-xs font-bold text-on-surface">{synthPitch > 0 ? "+" : ""}{synthPitch}</span>
                    </div>
                    <input type="range" min="-10" max="10" step="1" value={synthPitch} onChange={(e) => setSynthPitch(+e.target.value)} className="w-full accent-secondary" />
                    <div className="flex justify-between text-[9px] text-on-surface-variant/50"><span>Grave</span><span>Normal</span><span>Aigu</span></div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-xs text-on-surface-variant">Volume</label>
                      <span className="text-xs font-bold text-on-surface">{synthVolume}%</span>
                    </div>
                    <input type="range" min="0" max="100" step="5" value={synthVolume} onChange={(e) => setSynthVolume(+e.target.value)} className="w-full accent-tertiary" />
                    <div className="flex justify-between text-[9px] text-on-surface-variant/50"><span>Muet</span><span>Normal</span><span>Max</span></div>
                  </div>
                </div>
              </div>

              {/* Select voice from library */}
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Ou sélectionnez une voix de la bibliothèque</label>
                <div className="flex flex-wrap gap-2">
                  {voiceList.slice(0, 8).map((v: any) => (
                    <button key={v.id} onClick={() => { setSynthProvider(v.provider); setSynthVoiceId(v.voiceId || ""); }} className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${synthVoiceId === (v.voiceId || "") && synthProvider === v.provider ? "border-primary bg-primary/10 text-primary" : "border-white/5 text-on-surface-variant hover:border-white/10"}`}>
                      <span className="material-symbols-outlined text-xs">{v.gender === "male" ? "face" : "face_3"}</span>
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleSynthesize} disabled={synthLoading || !synthText.trim()} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-bold text-white disabled:opacity-50">
                <span className="material-symbols-outlined text-lg">{synthLoading ? "hourglass_empty" : "play_arrow"}</span>
                {synthLoading ? "Synthèse en cours..." : "Synthétiser"}
              </button>
            </div>

            {/* Audio player */}
            {synthAudio && (
              <div className="mt-6 rounded-xl border border-tertiary/20 bg-tertiary/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">check_circle</span>
                  <span className="text-sm font-bold text-tertiary">Synthèse réussie</span>
                </div>
                <audio controls src={synthAudio} className="w-full" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PROVIDERS ── */}
      {tab === "providers" && (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Configuration des providers TTS</h2>
            <p className="mt-1 text-xs text-on-surface-variant">Configurez les clés API pour chaque fournisseur de voix</p>
          </div>

          {[
            { id: "cartesia", name: "Cartesia", desc: "Voix française premium — latence ultra-faible (~150ms)", env: "CARTESIA_API_KEY", placeholder: "sk_cart_..." },
            { id: "elevenlabs", name: "ElevenLabs", desc: "Voix multilingue premium — clonage vocal natif", env: "ELEVENLABS_API_KEY", placeholder: "sk_..." },
            { id: "google", name: "Google Cloud TTS", desc: "Voix Wavenet standard — grande variété de langues", env: "GOOGLE_TTS_API_KEY", placeholder: "AIza..." },
          ].map((provider) => {
            const cfg = providerConfig[provider.id]!;
            return (
              <div key={provider.id} className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high">
                      <span className={`material-symbols-outlined text-xl ${cfg.color}`}>{cfg.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">{provider.name}</h3>
                      <p className="text-xs text-on-surface-variant">{provider.desc}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold text-on-surface-variant">
                    Variable: {provider.env}
                  </span>
                </div>
                <p className="mt-3 text-[10px] text-on-surface-variant">
                  Configurez la clé dans votre fichier <code className="text-primary">.env.local</code> : <code className="text-primary">{provider.env}={provider.placeholder}</code>
                </p>
              </div>
            );
          })}

          <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">info</span>
              <div>
                <p className="text-sm font-bold text-on-surface">Provider par défaut</p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Callpme utilise <strong className="text-on-surface">Cartesia</strong> comme provider par défaut pour les voix françaises.
                  Si Cartesia n&apos;est pas disponible, le système bascule automatiquement vers Google Cloud TTS.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
