import Link from "next/link";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-3xl bg-gradient-to-br from-surface-container-low to-surface-container px-8 py-16 text-center md:px-16">
        <h2 className="font-display text-3xl font-bold text-on-surface md:text-4xl">
          Prêt à réinventer votre voix ?
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-body text-sm leading-relaxed text-on-surface-variant">
          Rejoignez les leaders du marché qui utilisent déjà Vocalia pour
          orchestrer leur relation client.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-xl border border-white/10 px-8 py-3.5 font-nav text-sm text-on-surface-variant transition-colors hover:border-white/20 hover:text-on-surface"
          >
            Lancer la Console
          </Link>
          <Link
            href="mailto:sales@vocalia.app"
            className="glow-primary rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-3.5 font-nav text-sm font-medium text-white transition-all hover:brightness-110"
          >
            Parler à un expert
          </Link>
        </div>
      </div>
    </section>
  );
}
