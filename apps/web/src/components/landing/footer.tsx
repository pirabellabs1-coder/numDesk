import Link from "next/link";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Security", href: "/security" },
  { label: "Status", href: "/status" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/"
            className="font-display text-lg font-bold text-primary"
          >
            Callpme
          </Link>
          <p className="mt-2 font-nav text-xs tracking-wider text-on-surface-variant/60 uppercase">
            © 2026 Callpme. Built for the Sonic Architect.
          </p>
        </div>

        <nav className="flex flex-wrap gap-6">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-nav text-xs tracking-wider text-on-surface-variant/60 uppercase transition-colors hover:text-on-surface-variant"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
