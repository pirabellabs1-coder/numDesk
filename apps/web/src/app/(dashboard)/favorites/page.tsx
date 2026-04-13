"use client";

import Link from "next/link";
import { useFavorites, useRemoveFavorite } from "@/hooks/use-favorites";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";

const typeColors: Record<string, string> = {
  agent: "bg-primary/10 text-primary",
  contact: "bg-secondary/10 text-secondary",
  campaign: "bg-orange-400/10 text-orange-400",
  conversation: "bg-tertiary/10 text-tertiary",
};

export default function FavoritesPage() {
  const { data: favorites, isLoading, error, refetch } = useFavorites();
  const removeFavorite = useRemoveFavorite();
  const { toast } = useToast();

  const handleRemove = async (id: string) => {
    try {
      await removeFavorite.mutateAsync(id);
      toast("Favori retiré");
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les favoris" onRetry={() => refetch()} />;

  const favList = favorites ?? [];

  return (
    <section className="mx-auto max-w-3xl space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Favoris</h1>
        <p className="mt-2 text-on-surface-variant">{favList.length} éléments épinglés</p>
      </div>

      {favList.length === 0 ? (
        <div className="py-16 text-center">
          <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant/30">star</span>
          <p className="text-on-surface-variant">Aucun favori pour le moment</p>
          <p className="mt-1 text-xs text-on-surface-variant/50">Épinglez des agents, contacts ou conversations pour y accéder rapidement</p>
        </div>
      ) : (
        <div className="space-y-2">
          {favList.map((fav: any) => (
            <div key={fav.id} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-card px-3 py-3 sm:px-4 md:px-6 md:py-4 transition-all hover:border-white/10">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeColors[fav.type] || "bg-white/5 text-on-surface-variant"}`}>
                <span className="material-symbols-outlined">{fav.icon || "star"}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-on-surface">{fav.name}</p>
                <p className="text-[10px] capitalize text-on-surface-variant">{fav.type}</p>
              </div>
              <Link href={fav.href} className="text-xs font-bold text-primary hover:underline">Ouvrir</Link>
              <button onClick={() => handleRemove(fav.id)} className="text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
