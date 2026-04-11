import { AgentCard } from "@/components/dashboard/agent-card";
import { mockAgents } from "@/lib/mock-data";

export default function AgentsPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="text-4xl font-bold tracking-tight text-on-surface"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Mes Agents
          </h1>
          <p className="mt-2 text-on-surface-variant">
            {mockAgents.filter((a) => a.isActive).length} agents actifs sur{" "}
            {mockAgents.length} configurés
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-surface-container-low px-4 py-2.5">
            <span className="material-symbols-outlined text-sm text-on-surface-variant">
              search
            </span>
            <input
              placeholder="Rechercher un agent..."
              className="bg-transparent text-sm text-on-surface placeholder-on-surface-variant/40 outline-none"
            />
          </div>
        </div>
      </div>

      {mockAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-card py-24 text-center">
          <span className="material-symbols-outlined mb-4 text-6xl text-on-surface-variant/20">
            smart_toy
          </span>
          <h3
            className="mb-2 text-xl font-bold text-on-surface"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Aucun agent configuré
          </h3>
          <p className="mb-6 max-w-xs text-sm text-on-surface-variant">
            Créez votre premier agent IA pour commencer à automatiser vos
            appels.
          </p>
          <a
            href="/agents/new"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-bold text-white"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Créer votre premier agent
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockAgents.map((agent) => (
            <AgentCard key={agent.id} {...agent} />
          ))}
        </div>
      )}
    </section>
  );
}
