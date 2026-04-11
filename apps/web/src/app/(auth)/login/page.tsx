"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-8">
      {/* Logo */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-block font-display text-2xl font-bold text-primary"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Callpme
        </Link>
        <p className="mt-2 text-sm text-on-surface-variant">
          Bienvenue ! Connectez-vous à votre espace.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/5 bg-card p-8 shadow-xl">
        <h1
          className="mb-6 text-xl font-bold text-on-surface"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Connexion
        </h1>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@agence.fr"
              className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Link
            href="/dashboard"
            className="glow-primary block w-full rounded-lg bg-gradient-to-r from-primary to-secondary py-3 text-center text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Se connecter
          </Link>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
