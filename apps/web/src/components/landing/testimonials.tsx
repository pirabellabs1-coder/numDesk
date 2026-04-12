import { Star } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const testimonials = [
  {
    name: "Julien Moreau",
    role: "CEO, AutoPilot Agency",
    quote:
      "Callpme a transformé notre offre. Nos clients sont bluffés par la qualité des voix. Le ROI est immédiat.",
    rating: 5,
  },
  {
    name: "Sophie Laurent",
    role: "Directrice Ops, ImmoConnect",
    quote:
      "La latence de 200ms change tout. Nos leads qualifiés par l'agent IA convertissent 3x mieux qu'avant.",
    rating: 5,
  },
  {
    name: "Marc Dubois",
    role: "CTO, TechVoice Solutions",
    quote:
      "L'API est excellente. Intégration en 2h avec notre CRM. Les webhooks nous donnent tout en temps réel.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <ScrollReveal>
        <div className="text-center">
          <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">
            Témoignages
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-on-surface md:text-5xl">
            Ils nous font <span className="text-gradient-primary">confiance</span>
          </h2>
        </div>
      </ScrollReveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <ScrollReveal key={t.name} delay={i * 120}>
            <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-card p-8 transition-all hover:border-white/10">
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-[#FFB800] text-[#FFB800]" />
                ))}
              </div>

              {/* Quote */}
              <p className="mt-4 flex-1 font-body text-sm leading-relaxed text-on-surface-variant italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                  <span className="font-display text-sm font-bold text-primary">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-on-surface">{t.name}</p>
                  <p className="font-body text-xs text-on-surface-variant">{t.role}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
