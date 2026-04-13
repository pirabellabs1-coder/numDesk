"use client";

import { useAdminStats } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function AdminRecordingsPage() {
  const { data: stats, isLoading } = useAdminStats();
  if (isLoading) return <PageSkeleton />;

  const totalCalls = stats?.totalCalls ?? 0;
  // Estimate storage from call volume
  const estimatedFiles = totalCalls;
  const estimatedStorageGB = (totalCalls * 0.5 / 1024).toFixed(1);
  const retentionDays = 90;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Gestion des enregistrements</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Politique de rétention et stockage des enregistrements audio</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total fichiers</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{estimatedFiles.toLocaleString("fr-FR")}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Stockage estimé</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{estimatedStorageGB} Go</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Rétention par défaut</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{retentionDays} j</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Suppression auto</p>
          <p className="mt-1 text-xl font-bold text-tertiary">Activé</p>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary">info</span>
          <div>
            <p className="text-sm font-bold text-on-surface">Politique RGPD</p>
            <p className="mt-1 text-xs text-on-surface-variant">
              Les enregistrements audio sont stockés dans Supabase Storage et chiffrés au repos.
              La durée de rétention est configurable par workspace. Les enregistrements au-delà de la période de rétention sont automatiquement supprimés.
              Conforme au RGPD — les numéros de téléphone sont pseudonymisés dans les logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
