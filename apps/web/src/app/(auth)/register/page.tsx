"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { PLANS, type PlanSlug } from "@vocalia/shared";
import { Zap, Crown, Building2 } from "lucide-react";

const planIcons: Record<string, typeof Zap> = { starter: Zap, pro: Crown, enterprise: Building2 };

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
      <RegisterContent />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") as PlanSlug | null;
  const selectedPlan = planParam && PLANS[planParam] ? planParam : null;
  const plan = selectedPlan ? PLANS[selectedPlan] : null;
  const PlanIcon = selectedPlan ? planIcons[selectedPlan] || Zap : null;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    agency: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signUp(form.email, form.password, {
      firstName: form.firstName,
      lastName: form.lastName,
      agencyName: form.agency,
      planSlug: selectedPlan || "trial",
    });
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-block font-display text-2xl font-bold text-primary"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Callpme
        </Link>
        <p className="mt-2 text-sm text-on-surface-variant">
          Créez votre espace en quelques secondes.
        </p>
      </div>

      {/* Plan banner */}
      {plan && PlanIcon && (
        <div className={`rounded-xl border p-4 ${
          selectedPlan === "pro"
            ? "border-secondary/30 bg-secondary/5"
            : "border-primary/30 bg-primary/5"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              selectedPlan === "pro" ? "bg-secondary/15" : "bg-primary/15"
            }`}>
              <PlanIcon size={18} className={selectedPlan === "pro" ? "text-secondary" : "text-primary"} />
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">
                Plan {plan.name} sélectionné
              </p>
              <p className="text-xs text-on-surface-variant">
                {plan.pricePerMinuteCents > 0
                  ? `${(plan.pricePerMinuteCents / 100).toFixed(2)}€ par minute — ${plan.maxAgents ? `${plan.maxAgents} agents max` : "agents illimités"}`
                  : "Sur mesure — contactez-nous"
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {!plan && (
        <div className="rounded-xl border border-white/10 bg-white/3 p-4 text-center">
          <p className="text-sm text-on-surface-variant">
            <span className="font-bold text-tertiary">Essai gratuit</span> — 5 minutes offertes, sans carte bancaire
          </p>
        </div>
      )}

      {/* Card */}
      <div className="rounded-2xl border border-white/5 bg-card p-8 shadow-xl">
        <h1
          className="mb-6 text-xl font-bold text-on-surface"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Créer mon compte
        </h1>

        {error && (
          <div className="mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="mb-5 flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 py-3 text-sm font-medium text-on-surface transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
        >
          {googleLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-on-surface border-t-transparent" />
          ) : (
            <GoogleIcon />
          )}
          S'inscrire avec Google
        </button>

        {/* Divider */}
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-on-surface-variant">ou par email</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
                required
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
                required
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
              required
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
              required
              minLength={6}
              className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="glow-primary mt-2 block w-full rounded-lg bg-gradient-to-r from-primary to-secondary py-3 text-center text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Création en cours..." : plan ? `Créer mon compte — Plan ${plan.name}` : "Créer mon compte — Essai gratuit"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          J&apos;ai déjà un compte ?{" "}
          <Link href={selectedPlan ? `/login?plan=${selectedPlan}` : "/login"} className="text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
