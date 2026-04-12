"use client";

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-10 w-64 rounded-lg bg-white/5" />
        <div className="h-4 w-96 rounded bg-white/[0.03]" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-card p-6">
            <div className="mb-4 h-10 w-10 rounded-lg bg-white/5" />
            <div className="mb-2 h-3 w-20 rounded bg-white/[0.03]" />
            <div className="h-8 w-24 rounded bg-white/5" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 bg-card p-1">
        <div className="border-b border-white/5 px-6 py-4">
          <div className="h-3 w-48 rounded bg-white/[0.03]" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-white/5 px-6 py-4 last:border-0">
            <div className="h-8 w-8 rounded-full bg-white/5" />
            <div className="h-4 w-32 rounded bg-white/[0.03]" />
            <div className="flex-1" />
            <div className="h-4 w-20 rounded bg-white/[0.03]" />
            <div className="h-5 w-16 rounded-full bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/5 bg-card p-6">
      <div className="mb-4 h-10 w-10 rounded-lg bg-white/5" />
      <div className="mb-2 h-4 w-32 rounded bg-white/[0.03]" />
      <div className="h-3 w-full rounded bg-white/[0.03]" />
      <div className="mt-1 h-3 w-2/3 rounded bg-white/[0.03]" />
    </div>
  );
}
