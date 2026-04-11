import Link from "next/link";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "0.05€",
    unit: "/min",
    features: [
      "2 Voix Standards",
      "Accès API REST",
      "Support Communauté",
    ],
    cta: "Démarrer gratuitement",
    ctaHref: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "0.12€",
    unit: "/min",
    badge: "Plus populaire",
    features: [
      "Toutes les Voix Premium",
      "Analyse de Sentiment Live",
      "Connecteur Twilio/SIP",
      "Support Prioritaire 24/7",
    ],
    cta: "Choisir Pro",
    ctaHref: "/register?plan=pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Sur mesure",
    unit: "",
    features: [
      "Modèles de voix personnalisées",
      "Déploiement On-Premise",
      "SLA de 99.99%",
      "Key Account Manager",
    ],
    cta: "Contacter Ventes",
    ctaHref: "mailto:sales@vocalia.app",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-on-surface md:text-4xl">
          Investissez dans l&apos;Excellence
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
          Des tarifs transparents conçus pour la mise à l&apos;échelle, de la
          startup à l&apos;entreprise globale.
        </p>
      </div>

      {/* Pricing grid */}
      <div className="mt-14 grid items-center gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl border p-8 transition-all ${
              tier.highlighted
                ? "border-secondary/30 bg-surface-container-low scale-[1.03] md:scale-105"
                : "border-white/5 bg-card"
            }`}
          >
            {/* Badge */}
            {tier.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-secondary px-4 py-1.5 font-nav text-[10px] font-bold tracking-wider text-white uppercase">
                  {tier.badge}
                </span>
              </div>
            )}

            <h3 className="font-display text-lg font-semibold text-on-surface">
              {tier.name}
            </h3>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-on-surface">
                {tier.price}
              </span>
              {tier.unit && (
                <span className="font-body text-sm text-on-surface-variant">
                  {tier.unit}
                </span>
              )}
            </div>

            <ul className="mt-6 space-y-3">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 font-body text-sm text-on-surface-variant"
                >
                  <Check
                    size={16}
                    className={
                      tier.highlighted ? "text-secondary" : "text-tertiary"
                    }
                  />
                  {feature}
                </li>
              ))}
            </ul>

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
        ))}
      </div>
    </section>
  );
}
