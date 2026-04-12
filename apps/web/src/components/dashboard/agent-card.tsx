"use client";

import Link from "next/link";
import { useState } from "react";

interface AgentCardProps {
  id: string;
  name: string;
  isActive: boolean;
  totalCalls: number;
  avgDuration: string;
  voiceId: string;
  color: string;
  publishedAt: string;
}

export function AgentCard({
  id,
  name,
  isActive: initialActive,
  totalCalls,
  avgDuration,
  voiceId,
  color,
  publishedAt,
}: AgentCardProps) {
  const [active, setActive] = useState(initialActive);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-card p-6 transition-all hover:border-white/10">
      {/* Gradient glow */}
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl`}
      />

      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        {/* Avatar */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}
        >
          <span className="material-symbols-outlined">smart_toy</span>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setActive(!active)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            active ? "bg-tertiary/80" : "bg-surface-container-high"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
              active ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Name */}
      <Link href={`/agents/${id}`}>
        <h3
          className="mb-1 text-base font-bold text-on-surface group-hover:text-primary transition-colors"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {name}
        </h3>
      </Link>
      <p className="mb-4 text-xs text-on-surface-variant">{voiceId}</p>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-surface-container-low p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Appels
          </p>
          <p
            className="text-lg font-bold text-on-surface"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {totalCalls.toLocaleString("fr-FR")}
          </p>
        </div>
        <div className="rounded-lg bg-surface-container-low p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Durée moy.
          </p>
          <p
            className="text-lg font-bold text-on-surface"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {avgDuration}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
            active
              ? "bg-tertiary/10 text-tertiary"
              : "bg-white/5 text-on-surface-variant"
          }`}
        >
          {active && (
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
          )}
          {active ? "Actif" : "Inactif"}
        </span>
        <span className="text-[10px] text-on-surface-variant/50">
          Publié le {publishedAt}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/agents/${id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-surface-container-low py-2 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
          Modifier
        </Link>
        <button className="flex items-center justify-center rounded-lg bg-surface-container-low px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary">
          <span className="material-symbols-outlined text-sm">content_copy</span>
        </button>
        <button className="flex items-center justify-center rounded-lg bg-surface-container-low px-3 py-2 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error">
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    </div>
  );
}
