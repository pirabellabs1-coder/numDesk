"use client";

import { useState } from "react";
import { useCampaigns, useCreateCampaign } from "@/hooks/use-campaigns";
import { useAgents } from "@/hooks/use-agents";
import { usePhoneNumbers } from "@/hooks/use-phone-numbers";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  campaign: { bg: "bg-primary/10", text: "text-primary", label: "Campagne" },
  scheduled: { bg: "bg-secondary/10", text: "text-secondary", label: "Planifié" },
  test: { bg: "bg-tertiary/10", text: "text-tertiary", label: "Test" },
};

const statusColors: Record<string, string> = {
  draft: "bg-white/5 text-on-surface-variant",
  active: "bg-tertiary/10 text-tertiary",
  paused: "bg-orange-400/10 text-orange-400",
  completed: "bg-white/5 text-on-surface-variant",
  failed: "bg-error/10 text-error",
};

const statusLabels: Record<string, string> = {
  draft: "Brouillon",
  active: "Actif",
  paused: "En pause",
  completed: "Terminé",
  failed: "Échoué",
};

const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

function getWeek(offset: number) {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { label: `${dayNames[d.getDay()]} ${d.getDate()}`, date: d, dayNum: d.getDate() };
  });
}

export default function CalendarPage() {
  const { workspaceId } = useWorkspace();
  const { data: campaigns, isLoading } = useCampaigns(workspaceId);
  const { data: agentsData } = useAgents(workspaceId);
  const { data: phonesData } = usePhoneNumbers(workspaceId);
  const createCampaign = useCreateCampaign();
  const { toast } = useToast();

  const [view, setView] = useState<"week" | "list">("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    agentId: "",
    phoneNumberId: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    callWindowStart: "09:00",
    callWindowEnd: "18:00",
    contacts: "",
  });

  const agentList = agentsData ?? [];
  const phoneList = phonesData ?? [];

  const handleSchedule = async () => {
    if (!newEvent.name.trim() || !newEvent.agentId || !workspaceId) return;

    // Parse contacts (one per line: name,phone)
    const contactLines = newEvent.contacts.split("\n").filter((l) => l.trim());
    const contacts = contactLines.map((line) => {
      const parts = line.split(",").map((p) => p.trim());
      return { name: parts[0] || "", phone: parts[1] || parts[0] || "", variables: {} };
    });

    try {
      await createCampaign.mutateAsync({
        workspaceId,
        agentId: newEvent.agentId,
        name: newEvent.name,
        phoneNumberId: newEvent.phoneNumberId || undefined,
        contacts: contacts.length > 0 ? contacts : [{ name: "Test", phone: "+33000000000", variables: {} }],
        scheduledAt: new Date(`${newEvent.scheduledDate}T${newEvent.callWindowStart}:00`).toISOString(),
        callWindowStart: newEvent.callWindowStart,
        callWindowEnd: newEvent.callWindowEnd,
      });
      toast("Campagne planifiée avec succès");
      setShowSchedule(false);
      setNewEvent({ name: "", agentId: "", phoneNumberId: "", scheduledDate: new Date().toISOString().split("T")[0], callWindowStart: "09:00", callWindowEnd: "18:00", contacts: "" });
    } catch (e: any) {
      toast(e.message || "Erreur lors de la planification", "error");
    }
  };

  if (isLoading) return <PageSkeleton />;

  const campList = campaigns ?? [];
  const calendarEvents = campList.map((c: any) => {
    const agent = agentList.find((a: any) => a.id === c.agentId);
    return {
      id: c.id,
      title: c.name,
      type: "campaign" as const,
      date: c.scheduledAt ? new Date(c.scheduledAt).toISOString().split("T")[0] : new Date(c.createdAt).toISOString().split("T")[0],
      startTime: c.callWindowStart || "09:00",
      endTime: c.callWindowEnd || "18:00",
      agent: agent?.name || "Agent",
      status: c.status,
      totalContacts: c.totalContacts || 0,
      calledCount: c.calledCount || 0,
    };
  });

  const week = getWeek(weekOffset);
  const today = new Date();

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
            Calendrier
          </h1>
          <p className="mt-2 text-on-surface-variant">Semaine du {week[0]?.date.toLocaleDateString("fr-FR")} — {week[6]?.date.toLocaleDateString("fr-FR")}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Week navigation */}
          <div className="flex items-center gap-1">
            <button onClick={() => setWeekOffset((o) => o - 1)} className="rounded-lg p-2 text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button onClick={() => setWeekOffset(0)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface">
              Aujourd&apos;hui
            </button>
            <button onClick={() => setWeekOffset((o) => o + 1)} className="rounded-lg p-2 text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
          <div className="flex rounded-lg border border-white/5">
            <button onClick={() => setView("week")} className={`px-4 py-2 text-xs font-bold ${view === "week" ? "bg-primary/10 text-primary" : "text-on-surface-variant"}`}>Semaine</button>
            <button onClick={() => setView("list")} className={`px-4 py-2 text-xs font-bold ${view === "list" ? "bg-primary/10 text-primary" : "text-on-surface-variant"}`}>Liste</button>
          </div>
          <button onClick={() => setShowSchedule(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold text-white">
            <span className="material-symbols-outlined text-sm">add</span>
            Planifier
          </button>
        </div>
      </div>

      {view === "week" ? (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
          {/* Days header */}
          <div className="grid grid-cols-8 border-b border-white/5">
            <div className="p-3" />
            {week.map((d) => {
              const isToday = d.date.toDateString() === today.toDateString();
              return (
                <div key={d.label} className={`border-l border-white/5 p-3 text-center text-xs font-bold ${
                  isToday ? "bg-primary/5 text-primary" : d.date.getDay() === 0 || d.date.getDay() === 6 ? "text-on-surface-variant/50" : "text-on-surface-variant"
                }`}>{d.label}</div>
              );
            })}
          </div>
          {/* Grid */}
          <div className="grid grid-cols-8">
            {hours.map((hour) => (
              <div key={hour} className="contents">
                <div className="border-b border-white/5 p-2 text-right text-[10px] text-on-surface-variant/50">{hour}</div>
                {week.map((d) => {
                  const event = calendarEvents.find((e: any) => {
                    const eDate = new Date(e.date);
                    return eDate.toDateString() === d.date.toDateString() && e.startTime === hour;
                  });
                  return (
                    <div key={d.label + hour} className="relative h-12 border-b border-l border-white/5">
                      {event && (
                        <div className={`absolute inset-x-1 top-1 rounded-md px-1.5 py-0.5 ${typeColors[event.type]?.bg || "bg-primary/10"}`}>
                          <p className={`truncate text-[9px] font-bold ${typeColors[event.type]?.text || "text-primary"}`}>{event.title}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {calendarEvents.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-card px-6 py-12 text-center">
              <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant/30">event_busy</span>
              <p className="text-sm text-on-surface-variant">Aucune campagne planifiée</p>
              <button onClick={() => setShowSchedule(true)} className="mt-4 rounded-lg bg-primary/10 px-4 py-2 text-xs font-bold text-primary">
                Planifier une campagne
              </button>
            </div>
          ) : (
            calendarEvents.map((evt) => {
              const type = typeColors[evt.type] || typeColors.campaign!;
              return (
                <div key={evt.id} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-card px-6 py-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${type.bg}`}>
                    <span className={`material-symbols-outlined ${type.text}`}>campaign</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-on-surface">{evt.title}</p>
                    <p className="text-xs text-on-surface-variant">{evt.agent} · {evt.startTime} — {evt.endTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant">{evt.date}</p>
                    <p className="text-[10px] text-on-surface-variant">{evt.calledCount}/{evt.totalContacts} contacts</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[evt.status] || statusColors.draft}`}>
                    {statusLabels[evt.status] || evt.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Schedule Modal */}
      {showSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-8">
            <h2 className="mb-6 text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Planifier une campagne</h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nom de la campagne</label>
                <input
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  placeholder="Ex: Relance prospects mars"
                  className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Agent */}
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Agent</label>
                <select
                  value={newEvent.agentId}
                  onChange={(e) => setNewEvent({ ...newEvent, agentId: e.target.value })}
                  className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Sélectionner un agent...</option>
                  {agentList.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              {/* Phone number */}
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Numéro émetteur (optionnel)</label>
                <select
                  value={newEvent.phoneNumberId}
                  onChange={(e) => setNewEvent({ ...newEvent, phoneNumberId: e.target.value })}
                  className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Aucun numéro sélectionné</option>
                  {phoneList.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.number} — {p.friendlyName || p.provider}</option>
                  ))}
                </select>
              </div>

              {/* Date + Time window */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Date</label>
                  <input
                    type="date"
                    value={newEvent.scheduledDate}
                    onChange={(e) => setNewEvent({ ...newEvent, scheduledDate: e.target.value })}
                    className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Début</label>
                  <input
                    type="time"
                    value={newEvent.callWindowStart}
                    onChange={(e) => setNewEvent({ ...newEvent, callWindowStart: e.target.value })}
                    className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Fin</label>
                  <input
                    type="time"
                    value={newEvent.callWindowEnd}
                    onChange={(e) => setNewEvent({ ...newEvent, callWindowEnd: e.target.value })}
                    className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Contacts (un par ligne : nom, téléphone)</label>
                <textarea
                  value={newEvent.contacts}
                  onChange={(e) => setNewEvent({ ...newEvent, contacts: e.target.value })}
                  rows={4}
                  placeholder={"Jean Dupont, +33612345678\nMarie Martin, +33698765432"}
                  className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                />
                <p className="mt-1 text-[10px] text-on-surface-variant">
                  {newEvent.contacts.split("\n").filter((l) => l.trim()).length} contact(s)
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowSchedule(false)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface">Annuler</button>
              <button
                onClick={handleSchedule}
                disabled={createCampaign.isPending || !newEvent.name.trim() || !newEvent.agentId}
                className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {createCampaign.isPending ? "Planification..." : "Planifier"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
