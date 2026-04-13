"use client";

import { useAdminContacts } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function AdminContactsPage() {
  const { data: contacts, isLoading } = useAdminContacts();
  if (isLoading) return <PageSkeleton />;
  const list = contacts ?? [];
  const total = list.reduce((a: number, c: any) => a + c.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Gestion des contacts</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{total} contacts sur {list.length} workspaces</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
        <table className="w-full">
          <thead><tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <th className="px-6 py-3">Workspace</th><th className="px-6 py-3">Total contacts</th>
          </tr></thead>
          <tbody>{list.map((c: any) => (
            <tr key={c.workspaceId} className="border-b border-white/5 last:border-0">
              <td className="px-6 py-3 text-sm font-bold text-on-surface">{c.workspace}</td>
              <td className="px-6 py-3 text-sm text-on-surface">{c.total.toLocaleString("fr-FR")}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
