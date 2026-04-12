"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAgent, useUpdateAgent } from "@/hooks/use-agents";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { TabAgent } from "@/components/dashboard/agent-editor/tab-agent";
import { TabParole } from "@/components/dashboard/agent-editor/tab-parole";
import { TabReglages } from "@/components/dashboard/agent-editor/tab-reglages";
import { TabAnalyses } from "@/components/dashboard/agent-editor/tab-analyses";
import { TabApi } from "@/components/dashboard/agent-editor/tab-api";
import { TabVersions } from "@/components/dashboard/agent-editor/tab-versions";
import { TabOutils } from "@/components/dashboard/agent-editor/tab-outils";

const TABS = [
  { id: "agent", label: "AGENT" },
  { id: "parole", label: "PAROLE" },
  { id: "outils", label: "OUTILS" },
  { id: "reglages", label: "RÉGLAGES" },
  { id: "analyses", label: "ANALYSES" },
  { id: "versions", label: "VERSIONS" },
  { id: "api", label: "API" },
];

export default function AgentEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [activeTab, setActiveTab] = useState("agent");
  const { id } = React.use(params);
  const { data: agent, isLoading, error, refetch } = useAgent(id);
  const updateAgent = useUpdateAgent();
  const { toast } = useToast();

  // Local editable state — synced from server data
  const [edits, setEdits] = useState<Record<string, any>>({});

  useEffect(() => {
    if (agent) {
      setEdits({
        name: agent.name,
        prompt: agent.prompt || "",
        firstMessage: agent.firstMessage || "",
        language: agent.language || "fr-FR",
        voiceProvider: agent.voiceProvider || "cartesia",
        voiceId: agent.voiceId || "",
        llmModel: agent.llmModel || "gemini-2.5-flash",
        temperature: Number(agent.temperature) || 0.4,
        topP: Number(agent.topP) || 1.0,
        silenceTimeoutSec: agent.silenceTimeoutSec || 7,
        maxSilenceRetries: agent.maxSilenceRetries || 2,
        silencePrompt: agent.silencePrompt || "",
        voicemailEnabled: agent.voicemailEnabled || false,
        voicemailMessage: agent.voicemailMessage || "",
        recordSession: agent.recordSession ?? true,
        recordAudio: agent.recordAudio ?? true,
      });
    }
  }, [agent]);

  const handleSave = async () => {
    try {
      await updateAgent.mutateAsync({ id, ...edits });
      toast("Agent sauvegardé avec succès");
    } catch (e: any) {
      toast(e.message || "Erreur lors de la sauvegarde", "error");
    }
  };

  const [publishing, setPublishing] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testLoading, setTestLoading] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      // Save agent first
      await updateAgent.mutateAsync({ id, ...edits });
      // Sync with Vapi
      const res = await fetch("/api/vapi/sync-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Erreur synchronisation Vapi");
      toast("Agent publié et synchronisé avec Vapi");
      refetch(); // Refresh agent data to show updated publish status
    } catch (e: any) {
      toast(e.message || "Erreur lors de la publication", "error");
    }
    setPublishing(false);
  };

  const handleTest = () => {
    setShowTestModal(true);
  };

  const handleLaunchTest = async () => {
    if (!testPhone.trim()) return;
    setTestLoading(true);
    try {
      const res = await fetch("/api/vapi/call-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: id, phoneNumber: testPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Erreur");
      toast(`Appel test lancé vers ${testPhone}`);
      setShowTestModal(false);
      setTestPhone("");
    } catch (e: any) {
      toast(e.message || "Erreur lors du lancement", "error");
    }
    setTestLoading(false);
  };

  if (isLoading) return <PageSkeleton />;
  if (error || !agent) return <ErrorState message="Agent introuvable" onRetry={() => refetch()} />;

  // Create an agent-like object combining server data with local edits for tab components
  const editableAgent = { ...agent, ...edits };

  return (
    <div className="-mx-8 -mt-24 flex min-h-screen flex-col">
      {/* Editor Topbar */}
      <header className="fixed left-[220px] right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-surface/70 px-8 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link href="/agents" className="flex items-center gap-1 text-on-surface-variant transition-colors hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </Link>
          <div>
            <p className="text-sm font-bold text-on-surface">{edits.name || agent.name}</p>
            <p className="text-[10px] text-on-surface-variant">
              Production : <span className={agent.isPublished ? "text-tertiary" : "text-on-surface-variant/50"}>
                {agent.isPublished ? "Publiée" : "Aucune version publiée"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={updateAgent.isPending}
            className="rounded-lg border border-white/10 px-4 py-2 text-xs font-bold text-on-surface transition-colors hover:border-white/20 disabled:opacity-50"
          >
            {updateAgent.isPending ? "SAUVEGARDE..." : "SAUVEGARDER"}
          </button>
          <button
            onClick={handleTest}
            className="flex items-center gap-1.5 rounded-lg border border-primary/30 px-4 py-2 text-xs font-bold text-primary transition-colors hover:border-primary"
          >
            <span className="material-symbols-outlined text-sm">play_circle</span>
            ESSAYER
          </button>
          <button
            onClick={handlePublish}
            disabled={updateAgent.isPending || publishing}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            {publishing ? "SYNC VAPI..." : "PUBLIER"}
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <div className="fixed left-[220px] right-0 top-16 z-30 border-b border-white/5 bg-surface px-8">
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
          {activeTab === "agent" && <TabAgent agent={editableAgent} onChange={(field: string, value: any) => setEdits((prev) => ({ ...prev, [field]: value }))} />}
          {activeTab === "parole" && <TabParole agent={editableAgent} onChange={(field: string, value: any) => setEdits((prev) => ({ ...prev, [field]: value }))} />}
          {activeTab === "outils" && <TabOutils agent={editableAgent} onChange={(field: string, value: any) => setEdits((prev) => ({ ...prev, [field]: value }))} />}
          {activeTab === "reglages" && <TabReglages agent={editableAgent} onChange={(field: string, value: any) => setEdits((prev) => ({ ...prev, [field]: value }))} />}
          {activeTab === "analyses" && <TabAnalyses />}
          {activeTab === "versions" && <TabVersions />}
          {activeTab === "api" && <TabApi agent={editableAgent} />}
        </div>
      </div>

      {/* Test call modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-8">
            <h2 className="mb-2 text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
              Tester l&apos;agent
            </h2>
            <p className="mb-6 text-sm text-on-surface-variant">
              {agent.vapiAgentId
                ? "Lancez un appel test vers un numéro réel."
                : "Vous devez d'abord publier l'agent pour pouvoir le tester."
              }
            </p>

            {agent.vapiAgentId ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Numéro de téléphone</label>
                  <input
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+33612345678"
                    className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowTestModal(false)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant">Annuler</button>
                  <button
                    onClick={handleLaunchTest}
                    disabled={testLoading || !testPhone.trim()}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    {testLoading ? "Lancement..." : "Lancer l'appel"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowTestModal(false)} className="rounded-lg px-5 py-2.5 text-sm text-on-surface-variant">Fermer</button>
                <button onClick={() => { setShowTestModal(false); handlePublish(); }} className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white">
                  Publier d&apos;abord
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
