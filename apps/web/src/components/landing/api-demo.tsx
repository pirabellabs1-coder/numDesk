"use client";

import { ScrollReveal } from "./scroll-reveal";
import { Cable, Webhook, Code, Terminal, Copy, Check } from "lucide-react";
import { useState } from "react";

const codeExample = `// Lancer un appel sortant avec Callpme
const response = await fetch(
  "https://api.callpme.com/v1/calls",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer voc_xxxx...",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      agent_id: "ag_abc123",
      phone_number: "+33612345678",
      variables: {
        prenom: "Marie",
        entreprise: "Acme Corp"
      }
    })
  }
);

const { data } = await response.json();
console.log(data.call_id);
// → "call_9f8e7d6c..."`;

const webhookExample = `// Webhook: call.ended
{
  "event": "call.ended",
  "call_id": "call_9f8e7d6c",
  "agent_id": "ag_abc123",
  "direction": "outbound",
  "status": "ended",
  "duration_seconds": 92,
  "sentiment": "positive",
  "transcript": [
    {
      "role": "agent",
      "content": "Bonjour Marie..."
    },
    {
      "role": "user",
      "content": "Oui bonjour..."
    }
  ]
}`;

const integrations = [
  { icon: Cable, title: "SIP Trunking", desc: "Connexion PBX directe" },
  { icon: Webhook, title: "Webhooks", desc: "Events temps réel" },
  { icon: Code, title: "SDK Node/Python", desc: "Intégration rapide" },
  { icon: Terminal, title: "API REST", desc: "Endpoints complets" },
];

export function ApiDemo() {
  const [activeTab, setActiveTab] = useState<"api" | "webhook">("api");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab === "api" ? codeExample : webhookExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="mx-auto max-w-7xl px-6 py-24">
      <ScrollReveal>
        <div className="text-center">
          <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-tertiary uppercase">
            Pour les développeurs
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-on-surface md:text-5xl">
            API puissante,
            <br />
            <span className="text-gradient-secondary">intégration en minutes</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
            REST API complète, webhooks signés HMAC-SHA256, SDKs Node.js et
            Python. Connectez Callpme à votre stack en quelques lignes.
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-16 grid items-start gap-8 lg:grid-cols-5">
        {/* Left: Integration cards */}
        <div className="space-y-3 lg:col-span-2">
          {integrations.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 100}>
              <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-card p-4 transition-all hover:border-white/10 hover:bg-surface-container-low">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
                  <item.icon size={20} className="text-on-surface-variant" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-on-surface">
                    {item.title}
                  </h4>
                  <p className="font-body text-xs text-on-surface-variant">{item.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}

          <ScrollReveal delay={400}>
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="font-body text-xs leading-relaxed text-primary">
                Signature HMAC-SHA256 sur tous les webhooks. Rate limiting 100
                req/min. Tokens API en SHA-256.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Right: Code block */}
        <ScrollReveal direction="right" className="lg:col-span-3">
          <div className="code-block overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("api")}
                  className={`rounded-lg px-3 py-1.5 font-nav text-xs transition-all ${
                    activeTab === "api"
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  API Call
                </button>
                <button
                  onClick={() => setActiveTab("webhook")}
                  className={`rounded-lg px-3 py-1.5 font-nav text-xs transition-all ${
                    activeTab === "webhook"
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Webhook
                </button>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-nav text-xs text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {copied ? <Check size={14} className="text-tertiary" /> : <Copy size={14} />}
                {copied ? "Copié" : "Copier"}
              </button>
            </div>

            {/* Code content */}
            <div className="max-h-[420px] overflow-auto p-4">
              <pre className="text-xs leading-relaxed">
                <code>
                  {(activeTab === "api" ? codeExample : webhookExample)
                    .split("\n")
                    .map((line, i) => (
                      <div key={i} className="flex">
                        <span className="mr-4 inline-block w-6 select-none text-right text-on-surface-variant/30">
                          {i + 1}
                        </span>
                        <span
                          className={
                            line.includes("//")
                              ? "text-on-surface-variant/50"
                              : line.includes('"')
                                ? "text-tertiary"
                                : line.includes("const") || line.includes("await") || line.includes("method")
                                  ? "text-secondary"
                                  : "text-on-surface/80"
                          }
                        >
                          {line}
                        </span>
                      </div>
                    ))}
                </code>
              </pre>
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-tertiary" />
                <span className="font-nav text-[10px] text-on-surface-variant/50">
                  {activeTab === "api" ? "POST /v1/calls — 200 OK" : "Webhook payload — call.ended"}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
