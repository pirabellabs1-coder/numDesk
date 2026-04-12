"use client";

import Link from "next/link";
import { Lock, Crown, ArrowRight } from "lucide-react";

interface UpgradeGateProps {
  feature: string;
  requiredPlan?: "pro" | "starter";
  children: React.ReactNode;
  allowed: boolean;
}

/**
 * Wraps a page/section. If `allowed` is false, shows a full upgrade overlay.
 */
export function UpgradeGate({ feature, requiredPlan = "pro", children, allowed }: UpgradeGateProps) {
  if (allowed) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred content behind */}
      <div className="pointer-events-none select-none opacity-20 blur-[2px]">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-surface/95 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
            <Lock size={28} className="text-secondary" />
          </div>

          <h3 className="mt-5 font-display text-xl font-bold text-on-surface">
            Fonctionnalité réservée au plan {requiredPlan === "pro" ? "Pro" : "Starter"}
          </h3>

          <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">
            <strong className="text-on-surface">{feature}</strong> n&apos;est pas disponible
            avec votre plan actuel. Passez au plan{" "}
            <span className="font-bold text-secondary">
              {requiredPlan === "pro" ? "Pro (0.12€/min)" : "Starter (0.05€/min)"}
            </span>{" "}
            pour y accéder.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/billing"
              className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-3 font-nav text-sm font-bold text-white transition-all hover:brightness-110"
            >
              <Crown size={16} />
              Changer de plan
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <p className="mt-4 font-body text-[10px] text-on-surface-variant/50">
            {requiredPlan === "pro"
              ? "Le plan Pro inclut : agents illimités, campagnes, Voice Studio, RAG, analytics avancés"
              : "Le plan Starter inclut : 2 agents, API REST, webhooks basiques"
            }
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline badge to show on sidebar items / buttons that require upgrade
 */
export function ProBadge() {
  return (
    <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-[7px] font-bold tracking-wider text-secondary uppercase">
      Pro
    </span>
  );
}
