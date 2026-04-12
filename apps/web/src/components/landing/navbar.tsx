"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Fonctionnalités", href: "#platform" },
  { label: "Solutions", href: "#solutions" },
  { label: "Développeurs", href: "#developers" },
  { label: "Tarifs", href: "#pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass fixed top-0 z-40 w-full border-b border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <span className="font-display text-sm font-bold text-white">C</span>
          </div>
          <span className="font-display text-lg font-bold text-on-surface">
            Callpme
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-nav text-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="font-nav text-sm text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="group glow-primary flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2 font-nav text-sm font-medium text-white transition-all"
          >
            Essai gratuit
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-on-surface-variant md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="glass border-t border-white/5 md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 font-nav text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-white/5" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 font-nav text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="glow-primary mt-1 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-3 text-center font-nav text-sm font-medium text-white"
            >
              Essai gratuit
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
