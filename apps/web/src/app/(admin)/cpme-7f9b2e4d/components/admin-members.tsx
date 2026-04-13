"use client";

import { useState } from "react";
import { useAdminMembers, useUpdateMember } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/providers/toast-provider";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-tertiary/10 text-tertiary",
  inactive: "bg-white/5 text-on-surface-variant",
  suspended: "bg-error/10 text-error",
  member: "bg-primary/10 text-primary",
  admin: "bg-secondary/10 text-secondary",
  trialing: "bg-orange-400/10 text-orange-400",
  past_due: "bg-error/10 text-error",
  canceled: "bg-white/5 text-on-surface-variant",
};
const STATUS_LABEL: Record<string, string> = { active: "Actif", inactive: "Inactif", suspended: "Suspendu", member: "Membre", admin: "Admin", trialing: "Essai", past_due: "Impayé", canceled: "Annulé" };
const PLAN_STYLE: Record<string, string> = {
  trial: "bg-white/5 text-on-surface-variant",
  starter: "bg-primary/10 text-primary",
  pro: "bg-secondary/10 text-secondary",
  enterprise: "bg-tertiary/10 text-tertiary",
};
const PLAN_LABEL: Record<string, string> = { trial: "Essai", starter: "Starter", pro: "Pro", enterprise: "Enterprise" };

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "A l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `Il y a ${diffD}j`;
  return date.toLocaleDateString("fr-FR");
}

function formatEuros(cents: number): string {
  return `${(cents / 100).toFixed(2)} \u20ac`;
}

export function AdminMembers() {
  const { data: members, isLoading } = useAdminMembers();
  const updateMember = useUpdateMember();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);

  if (isLoading) return <PageSkeleton />;

  const memberList = members ?? [];
  const detail = memberList.find((m: any) => m.id === detailId);

  const filtered = memberList.filter((m: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (m.firstName || "").toLowerCase().includes(s) || (m.lastName || "").toLowerCase().includes(s) || (m.email || "").toLowerCase().includes(s) || (m.agencyName || "").toLowerCase().includes(s);
  });

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      await updateMember.mutateAsync({ id, role });
      toast(`Rôle mis à jour : ${role}`);
    } catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Gestion des membres</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{memberList.length} membre(s) inscrits</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom, email ou agence..." className="w-full rounded-lg bg-surface-container-lowest py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total membres</p>
          <p className="mt-1 text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{memberList.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Membres actifs</p>
          <p className="mt-1 text-3xl font-bold text-tertiary" style={{ fontFamily: "Inter, sans-serif" }}>{memberList.filter((m: any) => m.status === "active").length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Revenue total</p>
          <p className="mt-1 text-3xl font-bold text-primary" style={{ fontFamily: "Inter, sans-serif" }}>{formatEuros(memberList.reduce((a: number, m: any) => a + (m.totalSpentCents ?? 0), 0))}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Minutes totales</p>
          <p className="mt-1 text-3xl font-bold text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>{memberList.reduce((a: number, m: any) => a + (m.totalMinutesUsed ?? 0), 0)}</p>
        </div>
      </div>

      {memberList.length === 0 ? (
        <EmptyState icon="group" title="Aucun membre" description="Les membres apparaîtront ici après inscription." />
      ) : (
        <div className="flex gap-6">
          {/* Table */}
          <div className="flex-1 overflow-hidden rounded-2xl border border-white/5 bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  <th className="px-5 py-3">Membre</th>
                  <th className="px-5 py-3">Agence</th>
                  <th className="px-5 py-3">Plan</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Rôle</th>
                  <th className="px-5 py-3">Workspaces</th>
                  <th className="px-5 py-3">Minutes</th>
                  <th className="px-5 py-3">Agents</th>
                  <th className="px-5 py-3">Conversations</th>
                  <th className="px-5 py-3">Dépensé</th>
                  <th className="px-5 py-3">Dernière activité</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m: any) => (
                  <tr key={m.id} onClick={() => setDetailId(m.id)} className={`cursor-pointer border-b border-white/5 last:border-0 transition-colors ${detailId === m.id ? "bg-primary/5" : "hover:bg-white/[0.02]"}`}>
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm font-bold text-on-surface">{m.firstName || ""} {m.lastName || ""}</p>
                        <p className="text-[11px] text-on-surface-variant">{m.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-on-surface-variant">{m.agencyName || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PLAN_STYLE[m.planSlug] || PLAN_STYLE.trial}`}>{PLAN_LABEL[m.planSlug] || "Essai"}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[m.status] || STATUS_STYLE.inactive}`}>{STATUS_LABEL[m.status] || "Inactif"}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[m.role] || STATUS_STYLE.member}`}>{STATUS_LABEL[m.role] || m.role}</span>
                    </td>
                    <td className="px-5 py-3 text-sm font-bold text-on-surface">{m.workspaceCount ?? 0}</td>
                    <td className="px-5 py-3 text-sm text-on-surface">{m.totalMinutesUsed ?? 0}/{m.totalMinutesIncluded ?? 0}</td>
                    <td className="px-5 py-3 text-sm text-on-surface">{m.totalAgents ?? 0}{m.publishedAgents > 0 && <span className="text-tertiary"> ({m.publishedAgents} publiés)</span>}</td>
                    <td className="px-5 py-3 text-sm text-on-surface">{m.totalConversations ?? 0}</td>
                    <td className="px-5 py-3 text-sm text-on-surface">{formatEuros(m.totalSpentCents ?? 0)}</td>
                    <td className="px-5 py-3 text-sm text-on-surface-variant">{formatRelativeDate(m.lastActivity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {detail && (
            <div className="w-72 shrink-0 space-y-4 rounded-2xl border border-white/5 bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white">
                  {(detail.firstName?.[0] || "")}{(detail.lastName?.[0] || "")}
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{detail.firstName} {detail.lastName}</p>
                  <p className="text-[11px] text-on-surface-variant">{detail.email}</p>
                </div>
              </div>

              <div className="mb-2 flex gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PLAN_STYLE[detail.planSlug] || PLAN_STYLE.trial}`}>{PLAN_LABEL[detail.planSlug] || "Essai"}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[detail.status] || STATUS_STYLE.inactive}`}>{STATUS_LABEL[detail.status] || "Inactif"}</span>
              </div>

              <div className="space-y-2 text-xs text-on-surface-variant">
                <div className="flex justify-between"><span>Agence</span><span className="font-bold text-on-surface">{detail.agencyName || "—"}</span></div>
                <div className="flex justify-between"><span>Rôle</span><span className="font-bold text-on-surface">{detail.role}</span></div>
                <div className="flex justify-between"><span>Plan</span><span className="font-bold text-on-surface">{PLAN_LABEL[detail.planSlug] || "Essai"}</span></div>
                <div className="flex justify-between"><span>Abonnement</span><span className="font-bold text-on-surface">{STATUS_LABEL[detail.subscriptionStatus] || "—"}</span></div>
                <div className="flex justify-between"><span>Workspaces</span><span className="font-bold text-on-surface">{detail.workspaceCount ?? 0}</span></div>
                <div className="flex justify-between"><span>Agents</span><span className="font-bold text-on-surface">{detail.totalAgents ?? 0} ({detail.publishedAgents ?? 0} publiés)</span></div>
                <div className="flex justify-between"><span>Conversations</span><span className="font-bold text-on-surface">{detail.totalConversations ?? 0}</span></div>
                <div className="flex justify-between"><span>Minutes</span><span className="font-bold text-on-surface">{detail.totalMinutesUsed ?? 0} / {detail.totalMinutesIncluded ?? 0}</span></div>
                <div className="flex justify-between"><span>Dépensé</span><span className="font-bold text-on-surface">{formatEuros(detail.totalSpentCents ?? 0)}</span></div>
                <div className="flex justify-between"><span>Dernière activité</span><span className="font-bold text-on-surface">{formatRelativeDate(detail.lastActivity)}</span></div>
                <div className="flex justify-between"><span>Inscrit le</span><span className="font-bold text-on-surface">{new Date(detail.createdAt).toLocaleDateString("fr-FR")}</span></div>
              </div>

              {/* Workspaces list */}
              {detail.workspaces && detail.workspaces.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Workspaces</p>
                  <div className="space-y-1">
                    {detail.workspaces.map((ws: any) => (
                      <div key={ws.id} className="rounded-lg bg-surface-container-lowest px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-on-surface">{ws.name}</span>
                          <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${PLAN_STYLE[ws.planSlug] || PLAN_STYLE.trial}`}>{PLAN_LABEL[ws.planSlug] || "Essai"}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-on-surface-variant">
                          <span>{ws.minutesUsed ?? 0}/{ws.minutesIncluded ?? 0} min</span>
                          <span>{ws.agentCount ?? 0} agents</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <select onChange={(e) => e.target.value && handleUpdateRole(detail.id, e.target.value)} defaultValue="" className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="" disabled>Changer le rôle...</option>
                  <option value="admin">Admin</option>
                  <option value="member">Membre</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
