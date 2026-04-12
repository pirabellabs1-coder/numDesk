import Link from "next/link";
import { ArrowRight, Rocket, Users, Globe, Zap, Award, Heart } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description: "Nous repoussons les limites de la voix IA pour créer des expériences naturelles et fluides.",
  },
  {
    icon: Users,
    title: "Accessibilité",
    description: "La technologie vocale IA doit être accessible à toutes les entreprises, pas seulement aux géants tech.",
  },
  {
    icon: Heart,
    title: "Excellence",
    description: "Chaque détail compte. De la latence de 200ms à la qualité de nos voix françaises.",
  },
  {
    icon: Globe,
    title: "Francophonie",
    description: "Conçu pour le marché français, avec des voix naturelles et une interface 100% en français.",
  },
];

const timeline = [
  { year: "2024", event: "Pirabel Labs identifie le besoin d'agents vocaux IA francophones" },
  { year: "2025", event: "R&D sur l'optimisation de la latence et les voix naturelles françaises" },
  { year: "2026", event: "Lancement de Callpme — la plateforme d'appels IA #1 en France" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-20">
      {/* Hero */}
      <div className="text-center">
        <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">
          À propos
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface md:text-5xl">
          Créé par{" "}
          <span className="text-gradient-primary">Pirabel Labs</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-on-surface-variant">
          Callpme est né de la vision de{" "}
          <strong className="text-on-surface">Pirabel Labs</strong>, agence spécialisée
          en web, marketing digital et automatisation. Notre mission : démocratiser
          les agents vocaux IA pour le marché francophone.
        </p>
      </div>

      {/* About Pirabel Labs */}
      <div className="mt-20 rounded-2xl border border-white/5 bg-card p-8 md:p-12">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
            <Rocket size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-on-surface">Pirabel Labs</h2>
            <p className="font-body text-sm text-on-surface-variant">Agence Web, Marketing &amp; Automatisation</p>
          </div>
        </div>

        <p className="mt-6 font-body text-sm leading-relaxed text-on-surface-variant">
          Pirabel Labs est une agence digitale qui conçoit des solutions technologiques
          sur mesure pour les entreprises ambitieuses. Spécialisée en développement web,
          marketing digital et automatisation des processus, notre équipe combine
          expertise technique et vision stratégique pour créer des produits qui transforment
          les industries.
        </p>
        <p className="mt-4 font-body text-sm leading-relaxed text-on-surface-variant">
          Callpme est notre produit phare dans le domaine de l&apos;IA vocale — une plateforme
          SaaS B2B qui permet aux agences et entreprises de déployer des agents d&apos;appels
          intelligents avec des voix indiscernables de l&apos;humain, une latence ultra-faible
          et une intégration complète dans leur stack existant.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-surface-container-lowest p-4 text-center">
            <p className="font-display text-2xl font-bold text-primary">50+</p>
            <p className="mt-1 font-body text-xs text-on-surface-variant">Projets livrés</p>
          </div>
          <div className="rounded-xl bg-surface-container-lowest p-4 text-center">
            <p className="font-display text-2xl font-bold text-secondary">3 ans</p>
            <p className="mt-1 font-body text-xs text-on-surface-variant">D&apos;expertise</p>
          </div>
          <div className="rounded-xl bg-surface-container-lowest p-4 text-center">
            <p className="font-display text-2xl font-bold text-tertiary">100%</p>
            <p className="mt-1 font-body text-xs text-on-surface-variant">Made in France</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mt-20">
        <h2 className="text-center font-display text-2xl font-bold text-on-surface">
          Nos valeurs
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-white/5 bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <v.icon size={20} className="text-primary" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-on-surface">{v.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-on-surface-variant">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-20">
        <h2 className="text-center font-display text-2xl font-bold text-on-surface">
          Notre histoire
        </h2>
        <div className="mt-10 space-y-6">
          {timeline.map((t, i) => (
            <div key={t.year} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                  <span className="font-display text-xs font-bold text-white">{t.year}</span>
                </div>
                {i < timeline.length - 1 && <div className="h-full w-px bg-white/10" />}
              </div>
              <div className="pb-6">
                <p className="font-body text-sm leading-relaxed text-on-surface-variant">{t.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <h2 className="font-display text-2xl font-bold text-on-surface">
          Prêt à commencer ?
        </h2>
        <p className="mt-3 font-body text-sm text-on-surface-variant">
          Essayez Callpme gratuitement et découvrez la puissance de l&apos;IA vocale.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/register"
            className="group glow-primary flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-3 font-nav text-sm font-medium text-white"
          >
            Essai gratuit
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-white/10 px-8 py-3 font-nav text-sm text-on-surface-variant hover:border-white/20 hover:text-on-surface"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
