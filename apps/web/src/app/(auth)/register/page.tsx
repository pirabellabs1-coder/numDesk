"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    agency: "",
    email: "",
    password: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

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
          Créez votre espace en quelques secondes.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/5 bg-card p-8 shadow-xl">
        <h1
          className="mb-6 text-xl font-bold text-on-surface"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Créer mon compte
        </h1>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                Prénom
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                placeholder="Jean"
                className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                Nom
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                placeholder="Dupont"
                className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Nom de l&apos;agence
            </label>
            <input
              type="text"
              value={form.agency}
              onChange={(e) => update("agency", e.target.value)}
              placeholder="Agence IA Pro"
              className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
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
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          <Link
            href="/dashboard"
            className="glow-primary mt-2 block w-full rounded-lg bg-gradient-to-r from-primary to-secondary py-3 text-center text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Créer mon compte
          </Link>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          J&apos;ai déjà un compte ?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
