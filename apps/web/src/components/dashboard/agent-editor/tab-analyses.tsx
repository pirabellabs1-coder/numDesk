export function TabAnalyses() {
  const metrics = [
    { label: "Total Appels", value: "1 284", icon: "call", color: "text-primary" },
    { label: "Durée Moyenne", value: "3:42", icon: "timer", color: "text-secondary" },
    { label: "Taux de complétion", value: "87.4%", icon: "check_circle", color: "text-tertiary" },
    { label: "Taux de décroché", value: "92.4%", icon: "percent", color: "text-orange-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-white/5 bg-card p-5">
            <div className={`mb-3 flex items-center gap-2 ${m.color}`}>
              <span className="material-symbols-outlined text-sm">{m.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {m.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Activity chart mock */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
            Appels par jour
          </h3>
          <div className="flex gap-2">
            {["7j", "30j", "90j"].map((p) => (
              <button
                key={p}
                className="rounded-md bg-surface-container-low px-3 py-1 text-xs font-bold text-on-surface-variant first:bg-primary/10 first:text-primary"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-32 items-end gap-1.5">
          {[28, 45, 38, 52, 41, 60, 35, 48, 55, 42, 38, 50, 44, 62].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-primary/20 to-primary/60 transition-all hover:to-primary"
              style={{ height: `${(v / 65) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
