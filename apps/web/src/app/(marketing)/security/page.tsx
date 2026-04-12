import { Shield, Lock, Server, Eye, Key, Globe } from "lucide-react";

const measures = [
  {
    icon: Lock,
    title: "Chiffrement",
    items: [
      "TLS 1.3 sur tous les endpoints",
      "Credentials SIP/Twilio chiffrés AES-256 au repos",
      "Tokens API stockés en hash SHA-256",
      "Communications inter-services chiffrées",
    ],
  },
  {
    icon: Key,
    title: "Authentification",
    items: [
      "Authentification Supabase Auth avec JWT",
      "RBAC strict : membre / admin",
      "Sessions sécurisées avec refresh token",
      "Rate limiting : 100 req/min par token",
    ],
  },
  {
    icon: Server,
    title: "Infrastructure",
    items: [
      "Hébergement EU (Frankfurt) — conformité RGPD",
      "Supabase Pro avec Row Level Security",
      "Déploiement Vercel avec CDN global",
      "Monitoring Sentry + alertes temps réel",
    ],
  },
  {
    icon: Eye,
    title: "Données",
    items: [
      "Numéros de téléphone pseudonymisés dans les logs",
      "Enregistrements audio désactivables par workspace",
      "Rétention configurable (défaut : 90 jours)",
      "Export et suppression sur demande",
    ],
  },
  {
    icon: Shield,
    title: "Webhooks",
    items: [
      "Signature HMAC-SHA256 sur chaque webhook",
      "Header X-Vocalia-Signature pour validation",
      "Retry automatique avec backoff exponentiel",
      "Logs de livraison avec statut HTTP",
    ],
  },
  {
    icon: Globe,
    title: "Conformité",
    items: [
      "RGPD : résidence des données EU",
      "Mention IA obligatoire (aiTransparencyPrompt)",
      "DPA disponible sur demande",
      "Audit de sécurité annuel",
    ],
  },
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-20">
      <div className="text-center">
        <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-tertiary uppercase">
          Sécurité
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface md:text-5xl">
          La sécurité au <span className="text-gradient-primary">coeur</span> de Callpme
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
          Nous prenons la sécurité de vos données très au sérieux.
          Voici les mesures en place pour protéger votre plateforme.
        </p>
      </div>

      {/* Security badge */}
      <div className="mt-12 flex items-center justify-center gap-6">
        {["TLS 1.3", "AES-256", "HMAC-SHA256", "RGPD", "EU Hosting"].map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-tertiary/20 bg-tertiary/5 px-4 py-1.5 font-nav text-[10px] font-bold tracking-wider text-tertiary uppercase"
          >
            {badge}
          </span>
        ))}
      </div>

      {/* Measures grid */}
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {measures.map((measure) => (
          <div key={measure.title} className="rounded-2xl border border-white/5 bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary/10">
                <measure.icon size={20} className="text-tertiary" />
              </div>
              <h2 className="font-display text-base font-semibold text-on-surface">{measure.title}</h2>
            </div>
            <ul className="mt-4 space-y-2">
              {measure.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary/50" />
                  <span className="font-body text-sm text-on-surface-variant">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Report */}
      <div className="mt-16 text-center">
        <p className="font-body text-sm text-on-surface-variant">
          Vous avez découvert une vulnérabilité ? Contactez-nous :{" "}
          <a href="mailto:security@callpme.ai" className="text-primary hover:underline">
            security@callpme.ai
          </a>
        </p>
      </div>
    </div>
  );
}
