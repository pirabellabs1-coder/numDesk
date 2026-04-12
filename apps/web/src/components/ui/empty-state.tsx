"use client";

import Link from "next/link";

export function EmptyState({
  icon = "inbox",
  title = "Aucun élément",
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  icon?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  return (
    <div className="py-20 text-center">
      <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant/30">{icon}</span>
      <p className="text-sm font-bold text-on-surface">{title}</p>
      {description && <p className="mt-1 text-xs text-on-surface-variant">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
