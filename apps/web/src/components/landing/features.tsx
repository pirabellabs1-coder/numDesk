import { Zap, User } from "lucide-react";
import { Waveform } from "./waveform";

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance IA */}
        <div className="rounded-2xl border border-white/5 bg-card p-8">
          <div className="flex items-start justify-between">
            <h3 className="font-display text-xl font-semibold text-on-surface">
              Performance IA
            </h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap size={20} className="text-primary" />
            </div>
          </div>

          <p className="mt-4 font-body text-sm leading-relaxed text-on-surface-variant">
            Réduction de la latence à moins de 200ms. Vos clients ne sauront
            jamais qu&apos;ils parlent à une intelligence artificielle.
          </p>

          <div className="mt-5 flex gap-2">
            <span className="rounded-full bg-tertiary/10 px-3 py-1 font-nav text-[10px] font-bold tracking-wider text-tertiary uppercase">
              Live State
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 font-nav text-[10px] font-bold tracking-wider text-primary uppercase">
              Ultra Low Latency
            </span>
          </div>

          {/* Mini waveform / spectre */}
          <div className="mt-6 overflow-hidden rounded-xl bg-surface-container-lowest p-4">
            <Waveform className="h-10" />
          </div>
        </div>

        {/* Voix Naturelles */}
        <div className="rounded-2xl border border-white/5 bg-card p-8">
          <h3 className="font-display text-xl font-semibold text-on-surface">
            Voix Naturelles
          </h3>

          <p className="mt-4 font-body text-sm leading-relaxed text-on-surface-variant">
            Plus de 50 modèles de voix premium avec intonations émotionnelles
            ajustables.
          </p>

          {/* Voice selector */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <User size={14} className="text-primary" />
              </div>
              <span className="font-body text-sm font-medium text-primary">
                Modèle: Gabriel (FR)
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <User size={14} className="text-on-surface-variant" />
              </div>
              <span className="font-body text-sm text-on-surface-variant">
                Modèle: Sophie (FR)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
