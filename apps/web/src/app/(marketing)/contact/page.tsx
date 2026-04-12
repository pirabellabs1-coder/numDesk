import { Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-20">
      {/* Header */}
      <div className="text-center">
        <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
          Contact
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface md:text-5xl">
          Parlons de votre <span className="text-gradient-primary">projet</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
          Une question sur Callpme ? Un projet d&apos;intégration ?
          Notre équipe vous répond sous 24h.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {/* Contact form */}
        <div className="rounded-2xl border border-white/5 bg-card p-8">
          <h2 className="font-display text-lg font-semibold text-on-surface">
            Envoyez-nous un message
          </h2>
          <form className="mt-6 space-y-4" action={`mailto:contact@callpme.ai`} method="POST" encType="text/plain">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Nom complet
              </label>
              <input type="text" name="name" className="input-field" placeholder="Jean Dupont" required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Email
              </label>
              <input type="email" name="email" className="input-field" placeholder="jean@entreprise.fr" required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Entreprise
              </label>
              <input type="text" name="company" className="input-field" placeholder="Nom de votre entreprise" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Message
              </label>
              <textarea name="message" rows={4} className="input-field resize-none" placeholder="Décrivez votre projet ou question..." required />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 font-nav text-sm font-bold text-white transition-all hover:brightness-110"
            >
              Envoyer le message
            </button>
          </form>
        </div>

        {/* Contact info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Mail size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-on-surface">Email</h3>
                <a href="mailto:contact@callpme.ai" className="font-body text-sm text-primary hover:underline">
                  contact@callpme.ai
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                <MessageCircle size={18} className="text-secondary" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-on-surface">Commercial</h3>
                <a href="mailto:sales@callpme.ai" className="font-body text-sm text-secondary hover:underline">
                  sales@callpme.ai
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary/10">
                <MapPin size={18} className="text-tertiary" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-on-surface">Pirabel Labs</h3>
                <p className="font-body text-sm text-on-surface-variant">Paris, France</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="font-display text-sm font-semibold text-on-surface">Enterprise</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-on-surface-variant">
              Pour les projets enterprise, déploiement on-premise
              ou intégrations personnalisées, contactez directement notre équipe commerciale.
            </p>
            <a
              href="mailto:enterprise@callpme.ai"
              className="mt-3 inline-block font-nav text-sm font-medium text-primary hover:underline"
            >
              enterprise@callpme.ai
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
