import {
  Bot,
  Mic2,
  BarChart3,
  Phone,
  Megaphone,
  BookOpen,
} from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const features = [
  {
    icon: Bot,
    title: "Agents IA Avancés",
    description:
      "Créez des agents vocaux intelligents avec prompt personnalisé, gestion du silence, relance automatique et messagerie vocale.",
    color: "primary",
    badge: "Core",
  },
  {
    icon: Mic2,
    title: "Voice Studio",
    description:
      "50+ voix premium Cartesia, ElevenLabs, Google. Entrainez vos propres voix custom avec notre studio professionnel.",
    color: "secondary",
    badge: "Premium",
  },
  {
    icon: Megaphone,
    title: "Campagnes d'Appels",
    description:
      "Lancez des campagnes outbound massives avec planification horaire, retry automatique et suivi temps réel.",
    color: "tertiary",
    badge: "Outbound",
  },
  {
    icon: BarChart3,
    title: "Analytics & Sentiment",
    description:
      "Analyse de sentiment en temps réel, KPIs par agent, taux de complétion, durée moyenne et rapports détaillés.",
    color: "primary",
    badge: "Insights",
  },
  {
    icon: Phone,
    title: "Téléphonie Multi-Provider",
    description:
      "SIP Trunking, Twilio, Telnyx. Numéros français +33, assignation par agent, configuration en 2 clics.",
    color: "secondary",
    badge: "Telecom",
  },
  {
    icon: BookOpen,
    title: "Base de Connaissances",
    description:
      "Upload PDF, DOCX, TXT. Mode Full Context ou RAG vectoriel. Vos agents répondent avec les bonnes informations.",
    color: "tertiary",
    badge: "RAG",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badgeBg: string }> = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    badgeBg: "bg-primary/10",
  },
  secondary: {
    bg: "bg-secondary/10",
    text: "text-secondary",
    border: "border-secondary/20",
    badgeBg: "bg-secondary/10",
  },
  tertiary: {
    bg: "bg-tertiary/10",
    text: "text-tertiary",
    border: "border-tertiary/20",
    badgeBg: "bg-tertiary/10",
  },
};

export function Features() {
  return (
    <section id="platform" className="mx-auto max-w-7xl px-6 py-24">
      <ScrollReveal>
        <div className="text-center">
          <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">
            Fonctionnalités
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-on-surface md:text-5xl">
            Tout ce dont vous avez besoin
            <br />
            <span className="text-gradient-primary">en une seule plateforme</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
            De la création d&apos;agents IA aux campagnes d&apos;appels massives,
            Callpme couvre l&apos;intégralité de votre stratégie vocale.
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => {
          const colors = colorMap[feature.color] ?? colorMap["primary"]!;
          return (
            <ScrollReveal key={feature.title} delay={i * 100}>
              <div className="group relative h-full rounded-2xl border border-white/5 bg-card p-8 transition-all hover:border-white/10 hover:bg-surface-container-low">
                {/* Icon + Badge */}
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} transition-transform group-hover:scale-110`}
                  >
                    <feature.icon size={22} className={colors.text} />
                  </div>
                  <span
                    className={`rounded-full ${colors.badgeBg} px-3 py-1 font-nav text-[9px] font-bold tracking-wider ${colors.text} uppercase`}
                  >
                    {feature.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mt-5 font-display text-lg font-semibold text-on-surface">
                  {feature.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">
                  {feature.description}
                </p>

                {/* Hover gradient line */}
                <div
                  className={`mt-6 h-0.5 w-0 rounded-full bg-gradient-to-r from-${feature.color} to-transparent transition-all duration-500 group-hover:w-full`}
                />
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
