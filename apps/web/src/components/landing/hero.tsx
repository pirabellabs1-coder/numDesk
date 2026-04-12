"use client";

import Link from "next/link";
import { Play, ArrowRight, Phone, Mic, Brain } from "lucide-react";
import { Waveform } from "./waveform";
import { useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden px-6 pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px] animate-float-slow" />
        <div className="absolute -right-20 top-20 h-[400px] w-[400px] rounded-full bg-secondary/6 blur-[100px] animate-float" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-tertiary/5 blur-[80px] animate-float-reverse" />
      </div>

      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-32 left-[10%] animate-float" style={{ animationDelay: "0s" }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20">
            <Phone size={20} className="text-primary" />
          </div>
        </div>
        <div className="absolute top-48 right-[12%] animate-float-slow" style={{ animationDelay: "1s" }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 backdrop-blur-sm border border-secondary/20">
            <Mic size={18} className="text-secondary" />
          </div>
        </div>
        <div className="absolute bottom-40 left-[15%] animate-float-reverse" style={{ animationDelay: "0.5s" }}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary/10 backdrop-blur-sm border border-tertiary/20">
            <Brain size={18} className="text-tertiary" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-tertiary" />
          </span>
          <span className="font-nav text-xs font-medium tracking-wider text-primary uppercase">
            Plateforme IA Vocale #1 en France
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-8 max-w-5xl font-display text-4xl font-extrabold leading-[1.1] text-on-surface md:text-6xl lg:text-7xl">
          Vos appels clients,
          <br />
          <span className="text-gradient-primary">
            propulsés par l&apos;IA
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
          Agents vocaux intelligents, voix naturelles indiscernables de
          l&apos;humain, latence ultra-faible. Transformez chaque appel en une
          expérience exceptionnelle.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="group glow-primary flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-3.5 font-nav text-sm font-medium text-white transition-all hover:brightness-110"
          >
            Essai gratuit
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 font-nav text-sm text-on-surface-variant transition-colors hover:border-white/20 hover:text-on-surface"
          >
            <Play size={16} className="fill-current" />
            Voir la plateforme
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-on-surface md:text-4xl">
              <AnimatedCounter target={200} suffix="ms" />
            </div>
            <p className="mt-1 font-body text-xs text-on-surface-variant">Latence moyenne</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-on-surface md:text-4xl">
              <AnimatedCounter target={50} suffix="+" />
            </div>
            <p className="mt-1 font-body text-xs text-on-surface-variant">Voix premium</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-on-surface md:text-4xl">
              99.9<span className="text-tertiary">%</span>
            </div>
            <p className="mt-1 font-body text-xs text-on-surface-variant">Uptime garanti</p>
          </div>
        </div>

        {/* Waveform */}
        <div className="mt-16 w-full max-w-2xl md:mt-20">
          <div className="rounded-2xl border border-white/5 bg-card/50 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-error/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#FF7F3F]/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-tertiary/60" />
              </div>
              <span className="font-nav text-[10px] tracking-wider text-on-surface-variant/50 uppercase">
                Agent vocal en direct
              </span>
              <span className="relative ml-auto flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-tertiary" />
              </span>
            </div>
            <Waveform className="h-16 md:h-20" />
          </div>
        </div>
      </div>
    </section>
  );
}
