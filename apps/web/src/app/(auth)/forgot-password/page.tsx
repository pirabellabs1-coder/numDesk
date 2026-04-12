"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Link
          href="/"
          className="inline-block font-display text-2xl font-bold text-primary"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Callpme
        </Link>
        <p className="mt-2 text-sm text-on-surface-variant">
          Réinitialisez votre mot de passe.
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-card p-8 shadow-xl">
        <h1
          className="mb-6 text-xl font-bold text-on-surface"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Mot de passe oublié
        </h1>

        {sent ? (
          <div className="rounded-xl bg-tertiary/10 p-4 text-center text-sm text-tertiary">
            <span className="material-symbols-outlined mr-2 align-middle">
              check_circle
            </span>
            Email envoyé ! Vérifiez votre boîte de réception.
          </div>
        ) : (
          <form className="space-y-5" onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/api/auth/callback`,
            });
            setLoading(false);
            if (error) { setError(error.message); } else { setSent(true); }
          }}>
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

            <button
              type="submit"
              className="glow-primary w-full rounded-lg bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Envoyer le lien de réinitialisation
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          <Link href="/login" className="text-primary hover:underline">
            ← Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
