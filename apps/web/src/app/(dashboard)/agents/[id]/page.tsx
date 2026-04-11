"use client";

import { useState } from "react";
import Link from "next/link";
import { mockAgents } from "@/lib/mock-data";
import { TabAgent } from "@/components/dashboard/agent-editor/tab-agent";
import { TabParole } from "@/components/dashboard/agent-editor/tab-parole";
import { TabReglages } from "@/components/dashboard/agent-editor/tab-reglages";
import { TabAnalyses } from "@/components/dashboard/agent-editor/tab-analyses";
import { TabApi } from "@/components/dashboard/agent-editor/tab-api";

const TABS = [
  { id: "agent", label: "AGENT" },
  { id: "parole", label: "PAROLE" },
  { id: "outils", label: "OUTILS" },
  { id: "reglages", label: "RÉGLAGES" },
  { id: "analyses", label: "ANALYSES" },
  { id: "api", label: "API" },
];

export default function AgentEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState("agent");
  const agent = mockAgents.find((a) => a.id === params.id) ?? mockAgents[0]!;

  return (
    <div className="-mx-8 -mt-24 flex min-h-screen flex-col">
      {/* Editor Topbar */}
      <header className="fixed left-[240px] right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-surface/70 px-8 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/agents"
            className="flex items-center gap-1 text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </Link>
          <div>
            <p className="text-sm font-bold text-on-surface">{agent.name}</p>
            <p className="text-[10px] text-on-surface-variant">
              Production :{" "}
              <span className="text-on-surface-variant/50">
                Aucune version publiée
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-white/10 px-4 py-2 text-xs font-bold text-on-surface transition-colors hover:border-white/20">
            SAUVEGARDER
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-primary/30 px-4 py-2 text-xs font-bold text-primary transition-colors hover:border-primary">
            <span className="material-symbols-outlined text-sm">play_circle</span>
            ESSAYER
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-bold text-white transition-all hover:brightness-110">
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            PUBLIER
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <div className="fixed left-[240px] right-0 top-16 z-30 border-b border-white/5 bg-surface px-8">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-5 py-3.5 text-xs font-bold tracking-wider transition-all ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-32 flex-1 px-8 pb-12">
        <div className="mx-auto max-w-3xl">
          {activeTab === "agent" && <TabAgent agent={agent} />}
          {activeTab === "parole" && <TabParole />}
          {activeTab === "outils" && (
            <div className="py-8 text-center text-on-surface-variant">
              <span className="material-symbols-outlined mb-3 text-4xl">
                build
              </span>
              <p>Aucun outil externe configuré.</p>
            </div>
          )}
          {activeTab === "reglages" && <TabReglages />}
          {activeTab === "analyses" && <TabAnalyses />}
          {activeTab === "api" && <TabApi agent={agent} />}
        </div>
      </div>
    </div>
  );
}
