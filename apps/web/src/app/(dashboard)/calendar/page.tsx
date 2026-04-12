"use client";

import { useState } from "react";
import { useCampaigns } from "@/hooks/use-campaigns";
import { useWorkspace } from "@/providers/workspace-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  campaign: { bg: "bg-primary/10", text: "text-primary", label: "Campagne" },
  scheduled: { bg: "bg-secondary/10", text: "text-secondary", label: "Planifié" },
  test: { bg: "bg-tertiary/10", text: "text-tertiary", label: "Test" },
};

const statusColors: Record<string, string> = {
  active: "bg-tertiary/10 text-tertiary",
  pending: "bg-primary/10 text-primary",
  completed: "bg-white/5 text-on-surface-variant",
};

const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

// Generate current week dynamically
function getCurrentWeek() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { label: `${dayNames[d.getDay()]} ${d.getDate()}`, date: d, dayNum: d.getDate() };
  });
}

export default function CalendarPage() {
  const { workspaceId } = useWorkspace();
  const { data: campaigns, isLoading } = useCampaigns(workspaceId);
  const [view, setView] = useState<"week" | "list">("week");

  if (isLoading) return <PageSkeleton />;

  // Build calendar events from campaigns
  const campList = campaigns ?? [];
  const calendarEvents = campList.map((c: any) => ({
    id: c.id,
    title: c.name,
    type: "campaign" as const,
    date: c.scheduledAt ? new Date(c.scheduledAt).toISOString().split("T")[0] : new Date(c.createdAt).toISOString().split("T")[0],
    startTime: c.callWindowStart || "09:00",
    endTime: c.callWindowEnd || "18:00",
    agent: "Agent",
    status: c.status,
  }));
  const week = getCurrentWeek();
  const days = week.map((d) => d.label);

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
          <div className="flex rounded-lg border border-white/5">
            <button onClick={() => setView("week")} className={`px-4 py-2 text-xs font-bold ${view === "week" ? "bg-primary/10 text-primary" : "text-on-surface-variant"}`}>Semaine</button>
            <button onClick={() => setView("list")} className={`px-4 py-2 text-xs font-bold ${view === "list" ? "bg-primary/10 text-primary" : "text-on-surface-variant"}`}>Liste</button>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold text-white">
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
            {days.map((d) => (
              <div key={d} className={`border-l border-white/5 p-3 text-center text-xs font-bold ${
                d.includes("11") ? "bg-primary/5 text-primary" : "text-on-surface-variant"
              }`}>{d}</div>
            ))}
          </div>
          {/* Grid */}
          <div className="grid grid-cols-8">
            {hours.map((hour) => (
              <div key={hour} className="contents">
                <div className="border-b border-white/5 p-2 text-right text-[10px] text-on-surface-variant/50">{hour}</div>
                {days.map((day, di) => {
                  const dayDate = week[di]?.date;
                  const event = calendarEvents.find((e: any) => {
                    if (!dayDate) return false;
                    const eDate = new Date(e.date);
                    return eDate.toDateString() === dayDate.toDateString() && e.startTime === hour;
                  });
                  return (
                    <div key={day + hour} className="relative h-12 border-b border-l border-white/5">
                      {event && (
                        <div className={`absolute inset-x-1 top-1 rounded-md px-1.5 py-0.5 ${typeColors[event.type]!.bg}`}>
                          <p className={`truncate text-[9px] font-bold ${typeColors[event.type]!.text}`}>{event.title}</p>
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
          {calendarEvents.map((evt) => {
            const type = typeColors[evt.type]!;
            return (
              <div key={evt.id} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-card px-6 py-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${type.bg}`}>
                  <span className={`material-symbols-outlined ${type.text}`}>
                    {evt.type === "campaign" ? "campaign" : evt.type === "test" ? "play_circle" : "event"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-on-surface">{evt.title}</p>
                  <p className="text-xs text-on-surface-variant">{evt.agent} · {evt.startTime} — {evt.endTime}</p>
                </div>
                <span className="text-xs text-on-surface-variant">{evt.date}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[evt.status]}`}>
                  {evt.status === "active" ? "Actif" : evt.status === "pending" ? "Planifié" : "Terminé"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
