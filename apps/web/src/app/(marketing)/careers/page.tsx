import Link from "next/link";
import { MapPin, Clock, ArrowRight, Rocket } from "lucide-react";

const openings = [
  {
    title: "Ingénieur Full-Stack Senior",
    department: "Engineering",
    location: "Paris / Remote",
    type: "CDI",
    description: "Rejoignez l'équipe core pour développer la plateforme Next.js + Supabase. Expérience en temps réel et voix IA appréciée.",
  },
  {
    title: "ML Engineer — Voix & NLP",
    department: "IA",
    location: "Paris / Remote",
    type: "CDI",
    description: "Optimisation des modèles TTS, fine-tuning de voix custom, amélioration de la latence STT-LLM-TTS.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Paris",
    type: "CDI",
    description: "Concevoir l'expérience utilisateur de la console Callpme. Expertise Figma et design system requis.",
  },
  {
    title: "Customer Success Manager",
    department: "Business",
    location: "Paris",
    type: "CDI",
    description: "Accompagner nos clients agences dans le déploiement et l'optimisation de leurs agents vocaux IA.",
  },
];

const perks = [
  "Remote-first avec bureaux à Paris",
  "Équipement de pointe (MacBook, écran 4K)",
  "Formation continue et conférences",
  "Stock options pour les premiers arrivés",
  "Mutuelle premium prise en charge à 100%",
  "RTT et flexibilité horaire",
];

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-20">
      {/* Header */}
      <div className="text-center">
        <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-tertiary uppercase">
          Carrières
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface md:text-5xl">
          Rejoignez <span className="text-gradient-primary">l&apos;aventure</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
          Callpme est un produit de <strong className="text-on-surface">Pirabel Labs</strong>.
          Nous construisons le futur de la relation client en France. Envie de nous rejoindre ?
        </p>
      </div>

      {/* Perks */}
      <div className="mt-16 rounded-2xl border border-white/5 bg-card p-8">
        <div className="flex items-center gap-3">
          <Rocket size={20} className="text-secondary" />
          <h2 className="font-display text-lg font-semibold text-on-surface">Pourquoi nous rejoindre</h2>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {perks.map((perk) => (
            <div key={perk} className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-tertiary" />
              <span className="font-body text-sm text-on-surface-variant">{perk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Openings */}
      <div className="mt-16">
        <h2 className="font-display text-2xl font-bold text-on-surface">
          Postes ouverts
        </h2>
        <div className="mt-8 space-y-4">
          {openings.map((job) => (
            <Link
              key={job.title}
              href={`mailto:careers@pirabel.com?subject=Candidature : ${job.title}`}
              className="group block rounded-2xl border border-white/5 bg-card p-6 transition-all hover:border-primary/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-on-surface group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-nav text-[9px] font-bold tracking-wider text-primary uppercase">
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1 font-body text-xs text-on-surface-variant">
                      <MapPin size={12} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 font-body text-xs text-on-surface-variant">
                      <Clock size={12} /> {job.type}
                    </span>
                  </div>
                  <p className="mt-3 font-body text-sm text-on-surface-variant">{job.description}</p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-on-surface-variant/30 transition-all group-hover:text-primary group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Spontaneous */}
      <div className="mt-16 text-center">
        <p className="font-body text-sm text-on-surface-variant">
          Votre profil ne correspond pas ? Envoyez une candidature spontanée à{" "}
          <a href="mailto:careers@pirabel.com" className="text-primary hover:underline">
            careers@pirabel.com
          </a>
        </p>
      </div>
    </div>
  );
}
