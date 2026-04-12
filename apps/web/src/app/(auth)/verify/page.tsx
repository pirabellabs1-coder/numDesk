"use client";

import Link from "next/link";
import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();
  const supabase = createClient();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newCode = [...code];
      digits.forEach((d, i) => {
        if (index + i < 6) newCode[index + i] = d;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = code.join("");
    if (otp.length !== 6) {
      setError("Veuillez entrer le code à 6 chiffres.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });

      if (error) {
        setError(error.message === "Token has expired or is invalid"
          ? "Code invalide ou expiré. Veuillez réessayer."
          : error.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch {
      setError("Erreur de vérification. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    setResendLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        setError(error.message);
      } else {
        setResendCooldown(60);
      }
    } catch {
      setError("Erreur lors du renvoi. Veuillez réessayer.");
    } finally {
      setResendLoading(false);
    }
  };

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (code.every((d) => d !== "") && !loading && !success) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

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
          Vérifiez votre adresse email pour continuer.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/5 bg-card p-8 shadow-xl">
        {success ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tertiary/15">
              <svg className="h-8 w-8 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
              Email vérifié !
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Redirection vers votre tableau de bord...
            </p>
            <div className="mt-4 flex justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          </div>
        ) : (
          <>
            {/* Email icon */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail size={28} className="text-primary" />
              </div>
              <h1 className="text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
                Vérification par email
              </h1>
              <p className="mt-2 text-sm text-on-surface-variant">
                Nous avons envoyé un code à 6 chiffres à
              </p>
              {email && (
                <p className="mt-1 text-sm font-semibold text-primary">
                  {email}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}

            {/* OTP Input */}
            <div className="mb-6 flex justify-center gap-2.5">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-14 w-12 rounded-xl bg-surface-container-lowest text-center text-xl font-bold text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary/50 focus:bg-primary/5"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {/* Verify button */}
            <button
              onClick={handleVerify}
              disabled={loading || code.some((d) => d === "")}
              className="glow-primary block w-full rounded-lg bg-gradient-to-r from-primary to-secondary py-3 text-center text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Vérification...
                </span>
              ) : (
                "Vérifier mon email"
              )}
            </button>

            {/* Resend */}
            <div className="mt-5 text-center">
              <button
                onClick={handleResend}
                disabled={resendLoading || resendCooldown > 0}
                className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={resendLoading ? "animate-spin" : ""} />
                {resendCooldown > 0
                  ? `Renvoyer dans ${resendCooldown}s`
                  : "Renvoyer le code"
                }
              </button>
            </div>

            {/* Back to register */}
            <p className="mt-5 text-center">
              <Link href="/register" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                <ArrowLeft size={14} />
                Modifier l'adresse email
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
