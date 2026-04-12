"use client";

export function ErrorState({
  message = "Une erreur est survenue",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10">
        <span className="material-symbols-outlined text-3xl text-error">error</span>
      </div>
      <p className="text-sm text-on-surface">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg border border-white/10 px-5 py-2 text-sm font-bold text-on-surface-variant transition-all hover:border-white/20 hover:text-on-surface"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
