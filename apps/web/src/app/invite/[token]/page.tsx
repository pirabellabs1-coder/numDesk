"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export default function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = React.use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "accepting" | "success" | "error" | "login">("loading");
  const [message, setMessage] = useState("");
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // User not logged in — redirect to login with return URL
      setStatus("login");
      return;
    }

    // Accept invitation
    setStatus("accepting");
    fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error?.message || "Erreur lors de l'acceptation");
          return;
        }
        setStatus("success");
        setMessage(data.data?.message || "Invitation acceptée !");
        setWorkspaceId(data.data?.workspaceId);
      })
      .catch(() => {
        setStatus("error");
        setMessage("Erreur de connexion au serveur");
      });
  }, [user, authLoading, token]);

  const goToWorkspace = () => {
    if (workspaceId) {
      localStorage.setItem("active-workspace", workspaceId);
    }
    router.push("/dashboard");
  };

  const goToLogin = () => {
    router.push(`/login?redirect=/invite/${token}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-10 text-center">
        <div className="mb-6">
          <span className="text-3xl font-bold" style={{ background: "linear-gradient(135deg, #4F7FFF, #7B5CFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Callpme
          </span>
        </div>

        {(status === "loading" || status === "accepting") && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">sync</span>
            </div>
            <p className="text-sm text-on-surface-variant">
              {status === "loading" ? "Vérification..." : "Acceptation de l'invitation..."}
            </p>
          </>
        )}

        {status === "login" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
              <span className="material-symbols-outlined text-3xl text-secondary">person</span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-on-surface">Connexion requise</h2>
            <p className="mb-6 text-sm text-on-surface-variant">
              Connectez-vous ou créez un compte pour accepter l&apos;invitation.
            </p>
            <button
              onClick={goToLogin}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-bold text-white"
            >
              Se connecter
            </button>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-tertiary/10">
              <span className="material-symbols-outlined text-3xl text-tertiary">check_circle</span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-on-surface">Bienvenue !</h2>
            <p className="mb-6 text-sm text-on-surface-variant">{message}</p>
            <button
              onClick={goToWorkspace}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-bold text-white"
            >
              Accéder au workspace
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10">
              <span className="material-symbols-outlined text-3xl text-error">error</span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-on-surface">Oups !</h2>
            <p className="mb-6 text-sm text-on-surface-variant">{message}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-xl bg-surface-container-high py-3 text-sm font-bold text-on-surface"
            >
              Retour au dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
