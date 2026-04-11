import Link from "next/link";
import { mockStats, mockConversations, mockWorkspace } from "@/lib/mock-data";

const statusStyles: Record<string, string> = {
  success: "bg-tertiary/10 text-tertiary",
  missed: "bg-white/5 text-on-surface-variant",
  interrupted: "bg-error/10 text-error",
  voicemail: "bg-secondary/10 text-secondary",
};

export default function DashboardPage() {
  const quotaPercent = Math.round(
    (mockWorkspace.minutesUsed / mockWorkspace.minutesIncluded) * 100
  );
  const recent = mockConversations.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1
            className="text-4xl font-bold tracking-tight text-on-surface lg:text-5xl"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Bonjour, Alex
          </h1>
          <p className="mt-2 max-w-md text-on-surface-variant">
            L&apos;activité de vos agents est stable. 24 appels en cours
            actuellement.
          </p>
        </div>

        {/* Quota card */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/5 bg-card p-5 md:w-80">
          <div className="absolute -mr-10 -mt-10 right-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Usage Quota
            </span>
            <span className="text-xs font-bold text-primary">{quotaPercent}%</span>
          </div>
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-low">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-on-surface">
              {mockWorkspace.minutesUsed.toLocaleString("fr-FR")} /{" "}
              {mockWorkspace.minutesIncluded.toLocaleString("fr-FR")} min
            </span>
            <span className="text-on-surface-variant/60">
              {mockWorkspace.daysRemaining} jours restants
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: "timer",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
            label: "Minutes utilisées",
            value: mockStats.minutesUsed.toLocaleString("fr-FR"),
            unit: "min",
            trend: `+${mockStats.minutesTrend}%`,
            trendColor: "text-tertiary",
            trendIcon: "trending_up",
          },
          {
            icon: "hourglass_empty",
            iconBg: "bg-secondary/10",
            iconColor: "text-secondary",
            label: "Minutes restantes",
            value: mockStats.minutesRemaining.toLocaleString("fr-FR"),
            unit: "min",
            trend: "Plan Pro",
            trendColor: "text-on-surface-variant/40",
            trendIcon: null,
          },
          {
            icon: "call",
            iconBg: "bg-tertiary/10",
            iconColor: "text-tertiary",
            label: "Total Appels",
            value: mockStats.totalCalls.toLocaleString("fr-FR"),
            unit: "",
            trend: `+${mockStats.callsTrend}%`,
            trendColor: "text-tertiary",
            trendIcon: "trending_up",
          },
          {
            icon: "percent",
            iconBg: "bg-orange-400/10",
            iconColor: "text-orange-400",
            label: "Taux de décroché",
            value: mockStats.answerRate,
            unit: "%",
            trend: `${mockStats.answerTrend}%`,
            trendColor: "text-error",
            trendIcon: "trending_down",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-card p-6 transition-colors duration-300 hover:bg-surface-container-low"
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`rounded-lg p-2 ${stat.iconBg} ${stat.iconColor}`}
              >
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-bold ${stat.trendColor}`}
              >
                {stat.trendIcon && (
                  <span className="material-symbols-outlined text-sm">
                    {stat.trendIcon}
                  </span>
                )}
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {stat.label}
              </p>
              <h3
                className="text-3xl font-bold text-on-surface"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {stat.value}{" "}
                {stat.unit && (
                  <span className="text-sm font-normal text-on-surface-variant/50">
                    {stat.unit}
                  </span>
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent conversations */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between px-2">
            <h2
              className="text-xl font-bold text-on-surface"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Conversations Récentes
            </h2>
            <Link
              href="/conversations"
              className="text-xs font-bold uppercase tracking-widest text-primary transition-all hover:underline"
            >
              Voir tout
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/5 bg-card">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    {["Appelant", "Agent IA", "Durée", "Statut", "Date"].map(
                      (h) => (
                        <th
                          key={h}
                          className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ${
                            h === "Date" ? "text-right" : ""
                          }`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recent.map((conv) => (
                    <tr
                      key={conv.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                            <span className="material-symbols-outlined text-sm">
                              person
                            </span>
                          </div>
                          <span className="text-sm font-medium text-on-surface">
                            {conv.callerNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${conv.agentColor}`}
                          />
                          <span className="text-sm text-on-surface">
                            {conv.agentName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono text-xs text-on-surface-variant">
                        {conv.duration}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[conv.status]}`}
                        >
                          {conv.statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right text-xs text-on-surface-variant">
                        {conv.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-6">
          {/* Live activity */}
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-card p-6">
            <div className="mb-8 flex items-center justify-between">
              <h3
                className="font-bold text-on-surface"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Activité en direct
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-tertiary opacity-75" />
                  <span className="relative block h-2 w-2 rounded-full bg-tertiary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                  Live
                </span>
              </div>
            </div>

            {/* Waveform */}
            <div className="mb-8 flex h-32 items-end justify-center gap-1.5">
              {[40, 60, 80, 50, 90, 70, 85, 45, 30, 65].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full ${
                    i % 3 === 0
                      ? "bg-primary"
                      : i % 3 === 1
                        ? "bg-secondary"
                        : "bg-tertiary"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-4">
                <div className="rounded-full bg-white/5 p-2">
                  <span className="material-symbols-outlined text-primary">
                    call
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                    En cours
                  </p>
                  <p className="text-sm font-bold text-on-surface">
                    Appel vers +33 6 •••• 45
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-4">
                <div className="rounded-full bg-white/5 p-2">
                  <span className="material-symbols-outlined text-secondary">
                    smart_toy
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Traitement AI
                  </p>
                  <p className="text-sm font-bold text-on-surface">
                    Transcription vocale...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Optimize card */}
          <Link
            href="/knowledge"
            className="block rounded-3xl border border-white/5 bg-gradient-to-br from-surface-container-low to-card p-6 transition-all hover:border-primary/20"
          >
            <span className="material-symbols-outlined mb-2 text-3xl text-primary">
              auto_awesome
            </span>
            <h4
              className="mb-2 text-lg font-bold text-on-surface"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Optimisez vos agents
            </h4>
            <p className="mb-4 text-xs leading-relaxed text-on-surface-variant">
              Ajoutez des documents PDF ou des URLs pour enrichir la base de
              connaissances de vos agents.
            </p>
            <div className="w-full rounded-xl border border-white/5 bg-white/5 py-3 text-center text-xs font-bold text-on-surface transition-all hover:bg-white/10">
              Configurer le savoir
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
