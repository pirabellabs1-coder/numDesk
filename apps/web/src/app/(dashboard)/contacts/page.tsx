"use client";

import { useState } from "react";
import { useContacts, useCreateContact, useDeleteContact } from "@/hooks/use-contacts";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

const sentimentIcons: Record<string, string> = {
  positive: "sentiment_satisfied",
  neutral: "sentiment_neutral",
  negative: "sentiment_dissatisfied",
};
const sentimentColors: Record<string, string> = {
  positive: "text-tertiary",
  neutral: "text-on-surface-variant",
  negative: "text-error",
};

export default function ContactsPage() {
  const { workspaceId } = useWorkspace();
  const [search, setSearch] = useState("");
  const { data: contacts, isLoading, error, refetch } = useContacts(workspaceId, search || undefined);
  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();
  const { toast } = useToast();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({ firstName: "", lastName: "", phone: "", email: "", tags: "" });

  const handleCreate = async () => {
    if (!newContact.firstName.trim() || !newContact.lastName.trim() || !workspaceId) return;
    try {
      await createContact.mutateAsync({
        workspaceId,
        firstName: newContact.firstName,
        lastName: newContact.lastName,
        phone: newContact.phone,
        email: newContact.email || undefined,
        tags: newContact.tags ? newContact.tags.split(",").map((t) => t.trim()) : [],
      });
      toast("Contact créé avec succès");
      setShowAddModal(false);
      setNewContact({ firstName: "", lastName: "", phone: "", email: "", tags: "" });
    } catch (e: any) {
      toast(e.message || "Erreur lors de la création", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact.mutateAsync(id);
      toast("Contact supprimé");
      if (selectedId === id) setSelectedId(null);
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const handleExportCSV = () => {
    if (!contactList.length) return;
    const header = "Prénom,Nom,Téléphone,Email,Tags\n";
    const rows = contactList.map((c: any) =>
      `${c.firstName},${c.lastName},${c.phone || ""},${c.email || ""},${(c.tags || []).join(";")}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast("Export CSV téléchargé");
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les contacts" onRetry={() => refetch()} />;

  const contactList = contacts ?? [];
  const selected = contactList.find((c: any) => c.id === selectedId);

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Contacts</h1>
          <p className="mt-2 text-on-surface-variant">{contactList.length} contacts enregistrés</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-on-surface-variant transition-all hover:border-white/20 hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">download</span>
            Exporter
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white">
            <span className="material-symbols-outlined text-sm">add</span>
            Nouveau contact
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, téléphone ou email..."
          className="w-full rounded-lg bg-surface-container-lowest py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {contactList.length === 0 ? (
        <EmptyState icon="contacts" title="Aucun contact" description="Ajoutez votre premier contact." actionLabel="Nouveau contact" onAction={() => setShowAddModal(true)} />
      ) : (
        <div className="flex gap-6">
          {/* Table */}
          <div className="flex-1 overflow-hidden rounded-2xl border border-white/5 bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Téléphone</th>
                  <th className="px-5 py-3">Tags</th>
                  <th className="px-5 py-3">Appels</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactList.map((contact: any) => (
                  <tr
                    key={contact.id}
                    onClick={() => setSelectedId(contact.id)}
                    className={`cursor-pointer border-b border-white/5 transition-colors last:border-0 ${selectedId === contact.id ? "bg-primary/5" : "hover:bg-white/[0.02]"}`}
                  >
                    <td className="px-5 py-3">
                      <p className="text-sm font-bold text-on-surface">{contact.firstName} {contact.lastName}</p>
                      <p className="text-[11px] text-on-surface-variant">{contact.email}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-on-surface-variant">{contact.phone}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(contact.tags || []).map((tag: string) => (
                          <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-on-surface-variant">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm font-bold text-on-surface">{contact.totalCalls ?? 0}</td>
                    <td className="px-5 py-3">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }} className="text-on-surface-variant hover:text-error">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-80 shrink-0 space-y-5 rounded-2xl border border-white/5 bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white">
                  {selected.firstName?.[0]}{selected.lastName?.[0]}
                </div>
                <div>
                  <p className="text-lg font-bold text-on-surface">{selected.firstName} {selected.lastName}</p>
                  <p className="text-xs text-on-surface-variant">{selected.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">call</span>
                  {selected.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">history</span>
                  {selected.totalCalls ?? 0} appels au total
                </div>
              </div>
              {selected.sentiment && (
                <span className={`material-symbols-outlined text-2xl ${sentimentColors[selected.sentiment]}`}>
                  {sentimentIcons[selected.sentiment]}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-8">
            <h2 className="mb-6 text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Nouveau contact</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input value={newContact.firstName} onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })} placeholder="Prénom" className="rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
                <input value={newContact.lastName} onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })} placeholder="Nom" className="rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <input value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} placeholder="Téléphone (+33...)" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              <input value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} placeholder="Email" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              <input value={newContact.tags} onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })} placeholder="Tags (séparés par des virgules)" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button onClick={handleCreate} disabled={createContact.isPending || !newContact.firstName.trim() || !newContact.lastName.trim()} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {createContact.isPending ? "Création..." : "Créer le contact"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
