import { ScrollReveal } from "./scroll-reveal";
import {
  BarChart3,
  TrendingUp,
  Phone,
  Clock,
  Users,
  Activity,
} from "lucide-react";

const kpis = [
  { icon: Phone, label: "Appels aujourd'hui", value: "1,247", trend: "+12%", color: "primary" },
  { icon: Clock, label: "Durée moyenne", value: "2m 34s", trend: "-8%", color: "tertiary" },
  { icon: Users, label: "Agents actifs", value: "18", trend: "+3", color: "secondary" },
  { icon: Activity, label: "Sentiment positif", value: "87%", trend: "+5%", color: "tertiary" },
];

const chartBars = [35, 52, 44, 68, 56, 72, 48, 82, 64, 90, 75, 85];

export function DashboardPreview() {
  return (
    <section id="solutions" className="mx-auto max-w-7xl px-6 py-24">
      <ScrollReveal>
        <div className="text-center">
          <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            Dashboard
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-on-surface md:text-5xl">
            Pilotez tout depuis{" "}
            <span className="text-gradient-secondary">un seul écran</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
            KPIs en temps réel, conversations, campagnes, analytics. Tout est centralisé
            pour une visibilité totale sur votre activité vocale.
          </p>
        </div>
      </ScrollReveal>

      {/* Dashboard mockup */}
      <ScrollReveal direction="scale" className="mt-16">
        <div className="rounded-2xl border border-white/5 bg-card p-1">
          {/* Window chrome */}
          <div className="flex items-center gap-2 rounded-t-xl bg-surface-container px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-error/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#FF7F3F]/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-tertiary/60" />
            </div>
            <div className="ml-4 flex-1 rounded-md bg-surface-container-lowest px-3 py-1">
              <span className="font-nav text-[10px] text-on-surface-variant/50">
                app.callpme.ai/dashboard
              </span>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-6">
            {/* KPI row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-xl border border-white/5 bg-surface-container-lowest p-4"
                >
                  <div className="flex items-center justify-between">
                    <kpi.icon size={16} className="text-on-surface-variant/50" />
                    <span className="font-nav text-[10px] font-bold text-tertiary">
                      {kpi.trend}
                    </span>
                  </div>
                  <p className="mt-3 font-display text-2xl font-bold text-on-surface">
                    {kpi.value}
                  </p>
                  <p className="mt-1 font-body text-xs text-on-surface-variant">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Bar chart */}
              <div className="rounded-xl border border-white/5 bg-surface-container-lowest p-5 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={14} className="text-on-surface-variant/50" />
                    <span className="font-display text-sm font-semibold text-on-surface">
                      Appels par jour
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-tertiary" />
                    <span className="font-nav text-[10px] font-bold text-tertiary">+23%</span>
                  </div>
                </div>
                <div className="mt-6 flex items-end gap-2" style={{ height: 120 }}>
                  {chartBars.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/40 to-primary/80 transition-all hover:from-primary/60 hover:to-primary"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="font-body text-[9px] text-on-surface-variant/40">01 Avr</span>
                  <span className="font-body text-[9px] text-on-surface-variant/40">12 Avr</span>
                </div>
              </div>

              {/* Conversations mini */}
              <div className="rounded-xl border border-white/5 bg-surface-container-lowest p-5">
                <span className="font-display text-sm font-semibold text-on-surface">
                  Conversations récentes
                </span>
                <div className="mt-4 space-y-3">
                  {[
                    { caller: "+33 6 12 **", status: "Terminée", sentiment: "positive", dur: "2m 12s" },
                    { caller: "+33 7 45 **", status: "Terminée", sentiment: "neutral", dur: "1m 41s" },
                    { caller: "+33 1 88 **", status: "Manqué", sentiment: "negative", dur: "0m 08s" },
                    { caller: "+33 6 98 **", status: "Terminée", sentiment: "positive", dur: "3m 22s" },
                  ].map((conv, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${
                            conv.sentiment === "positive"
                              ? "bg-tertiary"
                              : conv.sentiment === "neutral"
                                ? "bg-primary"
                                : "bg-error"
                          }`}
                        />
                        <span className="font-body text-xs text-on-surface-variant">
                          {conv.caller}
                        </span>
                      </div>
                      <span className="font-nav text-[10px] text-on-surface-variant/50">
                        {conv.dur}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
