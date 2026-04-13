import Link from "next/link";

const footerSections = [
  {
    title: "Produit",
    links: [
      { label: "Agents IA", href: "#platform" },
      { label: "Voice Studio", href: "#platform" },
      { label: "Campagnes", href: "#platform" },
      { label: "Analytics", href: "#platform" },
      { label: "Tarifs", href: "#pricing" },
    ],
  },
  {
    title: "Développeurs",
    links: [
      { label: "API REST", href: "#developers" },
      { label: "Webhooks", href: "#developers" },
      { label: "SDK Node.js", href: "#developers" },
      { label: "SDK Python", href: "#developers" },
      { label: "Documentation", href: "#developers" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Carrières", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Statut", href: "/status" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Confidentialité", href: "/privacy" },
      { label: "CGU", href: "/terms" },
      { label: "Sécurité", href: "/security" },
      { label: "RGPD", href: "/rgpd" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface/50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-6">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="font-display text-xl font-bold text-primary">
              Callpme
            </Link>
            <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-on-surface-variant">
              Plateforme d&apos;agents vocaux IA pour le marché français.
              Un produit <strong className="text-on-surface">Pirabel Labs</strong>.
            </p>
            <div className="mt-6 flex gap-3">
              {["X", "Li", "Gh"].map((social) => (
                <div
                  key={social}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 font-nav text-[10px] font-bold text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
                >
                  {social}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-xs font-semibold tracking-wider text-on-surface uppercase">
                {section.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-on-surface-variant transition-colors hover:text-on-surface"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="font-body text-xs text-on-surface-variant/50">
            &copy; 2026 Callpme by Pirabel Labs. Tous droits réservés.
          </p>
          <p className="font-body text-xs text-on-surface-variant/50">
            Fait avec passion en France
          </p>
        </div>
      </div>
    </footer>
  );
}
