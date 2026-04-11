"use client";

import { useState } from "react";

interface TabApiProps {
  agent: { id: string; name: string };
}

const IDS = [
  { label: "Company ID", value: "comp_callpme_prod" },
  { label: "Workspace ID", value: "ws_1a2b3c4d5e" },
];

export function TabApi({ agent }: TabApiProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const entries = [...IDS, { label: "Agent ID", value: agent.id }];

  const config = JSON.stringify(
    {
      agentId: agent.id,
      name: agent.name,
      voice: { provider: "cartesia", voiceId: "gabriel-fr" },
      llm: { model: "gemini-2.5-flash", temperature: 0.4 },
      language: "fr-FR",
    },
    null,
    2
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
          Identifiants
        </h3>
        <div className="space-y-3">
          {entries.map((e) => (
            <div key={e.label} className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {e.label}
                </p>
                <p className="font-mono text-sm text-on-surface">{e.value}</p>
              </div>
              <button
                onClick={() => copy(e.label, e.value)}
                className="ml-4 flex items-center gap-1 rounded-lg bg-surface-container-high px-3 py-1.5 text-xs font-bold text-on-surface-variant transition-all hover:text-primary"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied === e.label ? "check" : "content_copy"}
                </span>
                {copied === e.label ? "Copié !" : "Copier"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
            Configuration JSON
          </h3>
          <button
            onClick={() => copy("config", config)}
            className="flex items-center gap-1 rounded-lg bg-surface-container-high px-3 py-1.5 text-xs font-bold text-on-surface-variant transition-all hover:text-primary"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            Copier
          </button>
        </div>
        <pre className="overflow-x-auto rounded-xl bg-surface-container-lowest p-4 font-mono text-xs leading-relaxed text-on-surface-variant">
          {config}
        </pre>
      </div>
    </div>
  );
}
