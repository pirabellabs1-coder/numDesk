import { UserPlus, Bot, PhoneCall, BarChart3 } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Créez votre workspace",
    description:
      "Inscrivez-vous en 30 secondes. Créez un workspace pour chaque client et configurez les minutes et le cycle de facturation.",
  },
  {
    icon: Bot,
    step: "02",
    title: "Configurez votre agent",
    description:
      "Rédigez le prompt, choisissez la voix premium, ajoutez vos outils et bases de connaissances. Publiez en un clic.",
  },
  {
    icon: PhoneCall,
    step: "03",
    title: "Assignez un numéro",
    description:
      "Connectez un numéro SIP ou Twilio. Les appels entrants sont automatiquement routés vers votre agent IA.",
  },
  {
    icon: BarChart3,
    step: "04",
    title: "Analysez les résultats",
    description:
      "Suivez chaque conversation, analysez le sentiment, exportez les données. Optimisez en continu.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <ScrollReveal>
        <div className="text-center">
          <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-tertiary uppercase">
            Comment ça marche
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-on-surface md:text-5xl">
            Opérationnel en <span className="text-gradient-secondary">4 étapes</span>
          </h2>
        </div>
      </ScrollReveal>

      <div className="relative mt-16">
        {/* Connection line */}
        <div className="absolute top-24 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <ScrollReveal key={step.step} delay={i * 150}>
              <div className="relative flex flex-col items-center text-center">
                {/* Step number */}
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-surface-container transition-all hover:border-primary/30 hover:bg-surface-container-high">
                    <step.icon size={24} className="text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary font-display text-[10px] font-bold text-white">
                    {step.step}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-base font-semibold text-on-surface">
                  {step.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
