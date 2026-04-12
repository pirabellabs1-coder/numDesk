import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "lancement-callpme",
    title: "Callpme est en ligne : la plateforme d'appels IA made in France",
    excerpt: "Après des mois de R&D, nous lançons officiellement Callpme. Découvrez comment notre plateforme transforme les interactions téléphoniques grâce à l'IA.",
    date: "12 Avr 2026",
    readTime: "5 min",
    category: "Produit",
    categoryColor: "primary",
  },
  {
    slug: "latence-200ms",
    title: "Comment nous avons réduit la latence vocale à 200ms",
    excerpt: "La latence est l'ennemi #1 des callbots. Voici les techniques que nous utilisons pour offrir une expérience conversationnelle naturelle.",
    date: "10 Avr 2026",
    readTime: "8 min",
    category: "Technique",
    categoryColor: "secondary",
  },
  {
    slug: "voix-francaises-ia",
    title: "L'état de l'art des voix françaises IA en 2026",
    excerpt: "Comparatif des providers TTS pour le français : Cartesia, ElevenLabs, Google Wavenet. Quelle voix choisir pour vos agents ?",
    date: "8 Avr 2026",
    readTime: "6 min",
    category: "Guide",
    categoryColor: "tertiary",
  },
  {
    slug: "roi-agents-vocaux",
    title: "Le ROI des agents vocaux IA pour les PME françaises",
    excerpt: "Étude de cas : comment 3 entreprises ont réduit leurs coûts de support de 60% grâce aux agents vocaux intelligents.",
    date: "5 Avr 2026",
    readTime: "7 min",
    category: "Business",
    categoryColor: "primary",
  },
  {
    slug: "api-webhooks-guide",
    title: "Guide complet : intégrer Callpme via API et Webhooks",
    excerpt: "Tutoriel pas à pas pour connecter Callpme à votre CRM, ERP ou outil métier via notre API REST et nos webhooks signés.",
    date: "2 Avr 2026",
    readTime: "10 min",
    category: "Technique",
    categoryColor: "secondary",
  },
  {
    slug: "campagnes-outbound",
    title: "Campagnes d'appels sortants : bonnes pratiques et résultats",
    excerpt: "Optimisez vos campagnes outbound avec la planification horaire, le retry intelligent et l'analyse de sentiment en temps réel.",
    date: "28 Mar 2026",
    readTime: "6 min",
    category: "Guide",
    categoryColor: "tertiary",
  },
];

const colorMap: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  tertiary: "bg-tertiary/10 text-tertiary",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
      {/* Header */}
      <div className="text-center">
        <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">
          Blog
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface md:text-5xl">
          Actualités &amp; <span className="text-gradient-primary">ressources</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
          Guides techniques, études de cas et actualités sur l&apos;IA vocale
          et la relation client automatisée.
        </p>
      </div>

      {/* Posts grid */}
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group flex flex-col rounded-2xl border border-white/5 bg-card p-6 transition-all hover:border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 font-nav text-[9px] font-bold tracking-wider uppercase ${colorMap[post.categoryColor]}`}>
                {post.category}
              </span>
              <div className="flex items-center gap-1 text-on-surface-variant/50">
                <Clock size={12} />
                <span className="font-body text-[10px]">{post.readTime}</span>
              </div>
            </div>

            <h2 className="mt-4 font-display text-lg font-semibold text-on-surface group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-on-surface-variant">
              {post.excerpt}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-body text-xs text-on-surface-variant/50">{post.date}</span>
              <span className="flex items-center gap-1 font-nav text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Lire <ArrowRight size={12} />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
