"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "./scroll-reveal";

function Counter({
  target,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, decimals]);

  return (
    <div ref={ref} className="font-display text-4xl font-extrabold text-on-surface md:text-5xl">
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : count}
      {suffix}
    </div>
  );
}

const stats = [
  {
    target: 200,
    suffix: "ms",
    label: "Latence moyenne",
    description: "Temps de réponse bout-en-bout",
    color: "primary",
  },
  {
    target: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Uptime SLA",
    description: "Disponibilité garantie",
    color: "tertiary",
  },
  {
    target: 50,
    suffix: "+",
    label: "Voix Premium",
    description: "Cartesia, ElevenLabs, Google",
    color: "secondary",
  },
  {
    target: 10,
    suffix: "x",
    label: "Plus rapide",
    description: "Que les callbots traditionnels",
    color: "primary",
  },
];

export function Stats() {
  return (
    <section className="border-y border-white/5 bg-gradient-to-b from-surface/50 to-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 120}>
              <div className="text-center">
                <Counter
                  target={stat.target}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                />
                <h4 className="mt-3 font-display text-sm font-semibold text-on-surface">
                  {stat.label}
                </h4>
                <p className="mt-1 font-body text-xs text-on-surface-variant">
                  {stat.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
