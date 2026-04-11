import Link from "next/link";
import { Play } from "lucide-react";
import { Waveform } from "./waveform";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center px-6 pt-32 pb-20 text-center md:pt-40 md:pb-28">
      {/* Surtitle */}
      <p className="font-nav text-xs font-medium tracking-[0.2em] text-secondary uppercase">
        The Sonic Architect
      </p>

      {/* Headline */}
      <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-tight text-on-surface md:text-6xl lg:text-7xl">
        L&apos;Architecture Sonore
        <br />
        <span className="text-gradient-primary">
          de votre Relation Client
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
        Transformez chaque interaction téléphonique en une expérience
        cinématographique. Une latence ultra-faible, une voix indiscernable de
        l&apos;humain.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/register"
          className="glow-primary rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-3.5 font-nav text-sm font-medium text-white transition-all hover:brightness-110"
        >
          Lancer la Console
        </Link>
        <Link
          href="/demo"
          className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 font-nav text-sm text-on-surface-variant transition-colors hover:border-white/20 hover:text-on-surface"
        >
          <Play size={16} className="fill-current" />
          Découvrir la démo
        </Link>
      </div>

      {/* Waveform */}
      <div className="mt-16 md:mt-20">
        <Waveform className="h-16 md:h-20" />
      </div>
    </section>
  );
}
