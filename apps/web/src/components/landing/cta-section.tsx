import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <ScrollReveal direction="scale">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high px-8 py-20 text-center md:px-16">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px]" />
            <div className="absolute -bottom-20 -right-20 h-[300px] w-[300px] rounded-full bg-secondary/5 blur-[80px]" />
          </div>

          <div className="relative z-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
              <Headphones size={28} className="text-white" />
            </div>

            <h2 className="mt-8 font-display text-3xl font-bold text-on-surface md:text-5xl">
              Pr&ecirc;t &agrave; transformer
              <br />
              <span className="text-gradient-primary">vos appels clients ?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg font-body text-sm leading-relaxed text-on-surface-variant">
              Rejoignez les entreprises qui utilisent d&eacute;j&agrave; Callpme pour
              offrir une exp&eacute;rience vocale d&apos;exception. Essai gratuit, sans
              engagement.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group glow-primary flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-3.5 font-nav text-sm font-medium text-white transition-all hover:brightness-110"
              >
                Commencer gratuitement
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="mailto:contact@callpme.ai"
                className="rounded-xl border border-white/10 px-8 py-3.5 font-nav text-sm text-on-surface-variant transition-colors hover:border-white/20 hover:text-on-surface"
              >
                Parler &agrave; un expert
              </Link>
            </div>

            <p className="mt-6 font-body text-xs text-on-surface-variant/50">
              Pas de carte bancaire requise &middot; Setup en 2 minutes &middot; Support francophone
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
