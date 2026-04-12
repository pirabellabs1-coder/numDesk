import { Cable, Webhook, Phone, Code, Shield, Clock, Cpu, Globe } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const integrations = [
  {
    icon: Cable,
    title: "SIP Trunking",
    subtitle: "Connexion directe PBX",
    color: "primary",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    subtitle: "Events temps réel signés",
    color: "secondary",
  },
  {
    icon: Phone,
    title: "Twilio / Telnyx",
    subtitle: "Intégration certifiée",
    color: "tertiary",
  },
  {
    icon: Code,
    title: "SDK Node/Python",
    subtitle: "Déploiement rapide",
    color: "primary",
  },
  {
    icon: Shield,
    title: "HMAC-SHA256",
    subtitle: "Sécurité webhook",
    color: "secondary",
  },
  {
    icon: Clock,
    title: "Latence < 200ms",
    subtitle: "Réponse instantanée",
    color: "tertiary",
  },
  {
    icon: Cpu,
    title: "Gemini / GPT-4o",
    subtitle: "LLM au choix",
    color: "primary",
  },
  {
    icon: Globe,
    title: "Multi-langue",
    subtitle: "FR, EN, ES, DE...",
    color: "secondary",
  },
];

const colorMap: Record<string, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

export function Ecosystem() {
  return (
    <section className="border-y border-white/5 bg-surface/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-tertiary uppercase">
              Écosystème
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-on-surface md:text-5xl">
              Connectez <span className="text-gradient-secondary">tout</span> votre stack
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
              Intégrez Callpme dans votre workflow existant en quelques minutes
              via nos connecteurs natifs et notre API REST complète.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {integrations.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 80}>
              <div className="group flex flex-col items-center rounded-2xl border border-white/5 bg-card px-6 py-8 text-center transition-all hover:border-white/10 hover:bg-surface-container-low">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-white/10">
                  <item.icon size={22} className={colorMap[item.color]} />
                </div>
                <h4 className="mt-4 font-display text-sm font-semibold text-on-surface">
                  {item.title}
                </h4>
                <p className="mt-1 font-body text-xs text-on-surface-variant">
                  {item.subtitle}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
