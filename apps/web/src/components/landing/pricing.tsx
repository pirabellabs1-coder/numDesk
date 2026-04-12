import Link from "next/link";
import { Check, X, Zap, Crown, Building2 } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const tiers = [
  {
    name: "Starter",
    icon: Zap,
    price: "0.05€",
    unit: "/min",
    description: "Pour tester et lancer votre premier agent vocal IA.",
    features: [
      { text: "2 agents IA", included: true },
      { text: "2 voix standard", included: true },
      { text: "API REST", included: true },
      { text: "Webhooks (2 events)", included: true },
      { text: "Support communauté", included: true },
      { text: "Analytics de base", included: true },
      { text: "Campagnes outbound", included: false },
      { text: "Voice Studio custom", included: false },
      { text: "Base de connaissances RAG", included: false },
      { text: "SLA garanti", included: false },
    ],
    cta: "Choisir Starter",
    ctaHref: "/register?plan=starter",
    highlighted: false,
  },
  {
    name: "Pro",
    icon: Crown,
    price: "0.12€",
    unit: "/min",
    badge: "Plus populaire",
    description: "La solution complète pour les équipes ambitieuses.",
    features: [
      { text: "Agents illimités", included: true },
      { text: "50+ voix premium", included: true },
      { text: "API REST complète", included: true },
      { text: "Webhooks (tous events)", included: true },
      { text: "Support prioritaire 24/7", included: true },
      { text: "Analytics avancés + sentiment", included: true },
      { text: "Campagnes outbound", included: true },
      { text: "Voice Studio custom", included: true },
      { text: "Base de connaissances RAG", included: true },
      { text: "SLA 99.9%", included: true },
    ],
    cta: "Choisir Pro",
    ctaHref: "/register?plan=pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Sur mesure",
    unit: "",
    description: "Déploiement dédié avec accompagnement personnalisé.",
    features: [
      { text: "Tout de Pro +", included: true },
      { text: "Voix custom entraînées", included: true },
      { text: "Déploiement on-premise", included: true },
      { text: "SLA 99.99%", included: true },
      { text: "Key Account Manager", included: true },
      { text: "Intégration CRM dédiée", included: true },
      { text: "Blanc-label complet", included: true },
      { text: "Audit sécurité RGPD", included: true },
      { text: "Formation équipe", included: true },
      { text: "Accès API illimité", included: true },
    ],
    cta: "Contacter les ventes",
    ctaHref: "mailto:contact@callpme.com",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <ScrollReveal>
        <div className="text-center">
          <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            Tarifs
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-on-surface md:text-5xl">
            Transparent et <span className="text-gradient-primary">sans surprise</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
            Achetez des minutes à l&apos;avance. Pas d&apos;engagement, pas de
            frais cachés. Scalez de la startup à l&apos;entreprise globale.
          </p>
          <p className="mt-3 font-body text-xs text-tertiary">
            Essai gratuit : 5 minutes offertes sans carte bancaire
          </p>
        </div>
      </ScrollReveal>

      {/* Pricing cards */}
      <div className="mt-16 grid items-stretch gap-6 md:grid-cols-3">
        {tiers.map((tier, i) => (
          <ScrollReveal key={tier.name} delay={i * 120}>
            <div
              className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all ${
                tier.highlighted
                  ? "border-primary/30 bg-surface-container-low scale-[1.02] md:scale-105 animate-glow-pulse"
                  : "border-white/5 bg-card hover:border-white/10"
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1.5 font-nav text-[10px] font-bold tracking-wider text-white uppercase">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Icon + Name */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    tier.highlighted ? "bg-primary/15" : "bg-white/5"
                  }`}
                >
                  <tier.icon
                    size={20}
                    className={tier.highlighted ? "text-primary" : "text-on-surface-variant"}
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-on-surface">
                  {tier.name}
                </h3>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold text-on-surface">
                  {tier.price}
                </span>
                {tier.unit && (
                  <span className="font-body text-sm text-on-surface-variant">{tier.unit}</span>
                )}
              </div>
              <p className="mt-2 font-body text-xs text-on-surface-variant">{tier.description}</p>

              {/* Features */}
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check size={14} className={tier.highlighted ? "text-primary" : "text-tertiary"} />
                    ) : (
                      <X size={14} className="text-on-surface-variant/30" />
                    )}
                    <span
                      className={`font-body text-sm ${
                        feature.included ? "text-on-surface-variant" : "text-on-surface-variant/30"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={tier.ctaHref}
                className={`mt-8 block rounded-xl px-6 py-3 text-center font-nav text-sm font-medium transition-all ${
                  tier.highlighted
                    ? "glow-primary bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110"
                    : "border border-white/10 text-on-surface-variant hover:border-white/20 hover:text-on-surface"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
