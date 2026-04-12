import { ScrollReveal } from "./scroll-reveal";

const technologies = [
  { name: "Vapi", label: "Orchestration" },
  { name: "Cartesia", label: "TTS Premium" },
  { name: "ElevenLabs", label: "Voix IA" },
  { name: "Google Cloud", label: "TTS Cloud" },
  { name: "Twilio", label: "Telecom" },
  { name: "Stripe", label: "Paiement" },
  { name: "Gemini", label: "LLM" },
  { name: "Supabase", label: "Backend" },
];

export function TrustBar() {
  return (
    <section className="border-y border-white/5 bg-surface/50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <p className="text-center font-nav text-[10px] font-bold tracking-[0.2em] text-on-surface-variant/50 uppercase">
            Technologies de pointe intégrées
          </p>
        </ScrollReveal>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {technologies.map((tech, i) => (
            <ScrollReveal key={tech.name} delay={i * 80}>
              <div className="flex flex-col items-center gap-2 opacity-60 transition-opacity hover:opacity-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                  <span className="font-display text-xs font-bold text-on-surface-variant">
                    {tech.name.charAt(0)}
                  </span>
                </div>
                <span className="font-nav text-[10px] font-medium tracking-wider text-on-surface-variant/60 uppercase">
                  {tech.name}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
