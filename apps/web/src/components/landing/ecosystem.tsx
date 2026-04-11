import Link from "next/link";
import { Cable, Webhook, Phone, Code } from "lucide-react";

const integrations = [
  {
    icon: Cable,
    title: "SIP Trunking",
    subtitle: "Connexion directe PBX",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    subtitle: "Events temps-réel",
  },
  {
    icon: Phone,
    title: "Twilio",
    subtitle: "Intégration certifiée",
  },
  {
    icon: Code,
    title: "SDK Node/Python",
    subtitle: "Déploiement rapide",
  },
];

export function Ecosystem() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-3xl font-bold text-on-surface md:text-4xl">
            Écosystème Ouvert
          </h2>
          <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
            Intégrez Vocalia dans votre workflow existant en quelques minutes via
            nos connecteurs natifs.
          </p>
        </div>
        <Link
          href="/docs"
          className="rounded-xl border border-white/10 px-6 py-2.5 font-nav text-sm text-on-surface-variant transition-colors hover:border-white/20 hover:text-on-surface"
        >
          Documentation API
        </Link>
      </div>

      {/* Integration cards */}
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {integrations.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center rounded-2xl border border-white/5 bg-surface-container px-6 py-8 text-center transition-colors hover:bg-surface-container-high"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
              <item.icon size={24} className="text-on-surface-variant" />
            </div>
            <h4 className="mt-4 font-display text-sm font-semibold text-on-surface">
              {item.title}
            </h4>
            <p className="mt-1 font-body text-xs text-on-surface-variant">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
