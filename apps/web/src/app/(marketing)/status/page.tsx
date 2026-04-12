import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";

const services = [
  { name: "Plateforme Web", status: "operational", uptime: "99.98%" },
  { name: "API REST", status: "operational", uptime: "99.95%" },
  { name: "Webhooks", status: "operational", uptime: "99.99%" },
  { name: "Orchestration Vapi", status: "operational", uptime: "99.90%" },
  { name: "TTS Cartesia", status: "operational", uptime: "99.85%" },
  { name: "TTS ElevenLabs", status: "operational", uptime: "99.80%" },
  { name: "TTS Google Cloud", status: "operational", uptime: "99.95%" },
  { name: "Base de données", status: "operational", uptime: "99.99%" },
  { name: "Stockage fichiers", status: "operational", uptime: "99.99%" },
  { name: "Authentification", status: "operational", uptime: "99.99%" },
];

const incidents = [
  {
    date: "10 Avr 2026",
    title: "Maintenance planifiée — Migration base de données",
    status: "resolved",
    description: "Migration vers Supabase Pro complétée. Aucun temps d'arrêt constaté.",
  },
  {
    date: "3 Avr 2026",
    title: "Latence élevée ElevenLabs",
    status: "resolved",
    description: "Latence temporaire sur le provider ElevenLabs (incident côté provider). Fallback automatique vers Cartesia activé.",
  },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  operational: { icon: CheckCircle2, color: "text-tertiary", label: "Opérationnel" },
  degraded: { icon: AlertTriangle, color: "text-[#FF7F3F]", label: "Dégradé" },
  maintenance: { icon: Clock, color: "text-primary", label: "Maintenance" },
};

export default function StatusPage() {
  const allOperational = services.every((s) => s.status === "operational");

  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      {/* Header */}
      <div className="text-center">
        <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-tertiary uppercase">
          Statut
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface md:text-5xl">
          État des services
        </h1>
      </div>

      {/* Overall status */}
      <div className={`mt-12 rounded-2xl border p-6 text-center ${
        allOperational ? "border-tertiary/20 bg-tertiary/5" : "border-[#FF7F3F]/20 bg-[#FF7F3F]/5"
      }`}>
        <div className="flex items-center justify-center gap-3">
          <CheckCircle2 size={24} className="text-tertiary" />
          <span className="font-display text-lg font-semibold text-on-surface">
            {allOperational ? "Tous les systèmes sont opérationnels" : "Incident en cours"}
          </span>
        </div>
        <p className="mt-2 font-body text-xs text-on-surface-variant">
          Dernière vérification : {new Date().toLocaleString("fr-FR")}
        </p>
      </div>

      {/* Services */}
      <div className="mt-10 space-y-2">
        {services.map((service) => {
          const cfg = statusConfig[service.status]!;
          return (
            <div key={service.name} className="flex items-center justify-between rounded-xl border border-white/5 bg-card px-5 py-3">
              <div className="flex items-center gap-3">
                <cfg.icon size={16} className={cfg.color} />
                <span className="font-body text-sm text-on-surface">{service.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-nav text-[10px] text-on-surface-variant/50">{service.uptime}</span>
                <span className={`font-nav text-[10px] font-bold ${cfg.color}`}>{cfg.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Incidents */}
      <div className="mt-16">
        <h2 className="font-display text-xl font-bold text-on-surface">Incidents récents</h2>
        <div className="mt-6 space-y-4">
          {incidents.map((incident) => (
            <div key={incident.title} className="rounded-xl border border-white/5 bg-card p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-on-surface">{incident.title}</h3>
                <span className="rounded-full bg-tertiary/10 px-2.5 py-1 font-nav text-[9px] font-bold text-tertiary uppercase">
                  Résolu
                </span>
              </div>
              <p className="mt-2 font-body text-sm text-on-surface-variant">{incident.description}</p>
              <p className="mt-2 font-body text-[10px] text-on-surface-variant/50">{incident.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
