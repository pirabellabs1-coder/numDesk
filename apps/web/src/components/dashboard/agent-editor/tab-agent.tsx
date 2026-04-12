"use client";

import { useState } from "react";
import { usePhoneNumbers } from "@/hooks/use-phone-numbers";
import { useWorkspace } from "@/providers/workspace-provider";

interface TabAgentProps {
  agent: any;
  onChange?: (field: string, value: any) => void;
}

export function TabAgent({ agent, onChange }: TabAgentProps) {
  const { workspaceId } = useWorkspace();
  const { data: phoneNumbers } = usePhoneNumbers(workspaceId);

  const [prompt, setPrompt] = useState(agent.prompt || "");
  const [firstMessage, setFirstMessage] = useState(agent.firstMessage || "");
  const [voicemailEnabled, setVoicemailEnabled] = useState(agent.voicemailEnabled || false);
  const [firstMsgEnabled, setFirstMsgEnabled] = useState(!!agent.firstMessage);
  const [silenceEnabled, setSilenceEnabled] = useState((agent.silenceTimeoutSec ?? 7) > 0);

  const numList = phoneNumbers ?? [];

  return (
    <div className="space-y-8">
      {/* Informations de base */}
      <Section title="Informations de base">
        <Field label="Nom de l'agent">
          <input
            defaultValue={agent.name}
            onChange={(e) => onChange?.("name", e.target.value)}
            className="input-field"
          />
        </Field>
        <Field label="Numéro de téléphone entrant">
          <select
            className="input-field"
            defaultValue={agent.phoneNumberId || ""}
            onChange={(e) => onChange?.("phoneNumberId", e.target.value)}
          >
            <option value="">Aucun numéro assigné</option>
            {numList.map((num: any) => (
              <option key={num.id} value={num.id}>
                {num.number}{num.friendlyName ? ` — ${num.friendlyName}` : ""}
              </option>
            ))}
          </select>
          {numList.length === 0 && (
            <p className="mt-1 text-[10px] text-on-surface-variant">
              Aucun numéro configuré. Ajoutez-en dans <strong className="text-on-surface">Numéros de téléphone</strong>.
            </p>
          )}
        </Field>
        <Field label="Prompt principal">
          <textarea
            value={prompt}
            onChange={(e) => { setPrompt(e.target.value); onChange?.("prompt", e.target.value); }}
            rows={6}
            className="input-field resize-none font-mono text-xs"
            placeholder="Tu es un agent de support professionnel..."
          />
          <p className="mt-1.5 text-right text-[10px] text-on-surface-variant/50">
            {prompt.length} / 8000 tokens
          </p>
        </Field>
      </Section>

      {/* Messagerie vocale */}
      <Section title="Messagerie vocale (appels sortants)">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-on-surface">
              Laisser un message vocal
            </p>
            <p className="text-xs text-on-surface-variant">
              Si l&apos;appelant ne décroche pas
            </p>
          </div>
          <Toggle value={voicemailEnabled} onChange={(v) => { setVoicemailEnabled(v); onChange?.("voicemailEnabled", v); }} />
        </div>
        {voicemailEnabled && (
          <Field label="Message vocal">
            <textarea
              rows={3}
              defaultValue={agent.voicemailMessage || ""}
              onChange={(e) => onChange?.("voicemailMessage", e.target.value)}
              placeholder="Bonjour, je vous contactais de la part de..."
              className="input-field resize-none"
            />
          </Field>
        )}
      </Section>

      {/* Première phrase */}
      <Section title="Première phrase">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-on-surface">
              Activer la première phrase
            </p>
            <p className="text-xs text-on-surface-variant">
              Message d&apos;accueil automatique
            </p>
          </div>
          <Toggle value={firstMsgEnabled} onChange={setFirstMsgEnabled} />
        </div>
        {firstMsgEnabled && (
          <>
            <Field label="Phrase d'accueil">
              <input
                value={firstMessage}
                onChange={(e) => { setFirstMessage(e.target.value); onChange?.("firstMessage", e.target.value); }}
                className="input-field"
              />
            </Field>
            <Field label="Délai avant première phrase (secondes)">
              <input type="number" defaultValue={0} min={0} max={10} className="input-field w-32" />
            </Field>
          </>
        )}
      </Section>

      {/* Relancer après silence */}
      <Section title="Relancer après silence">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-on-surface">
              Relancer après silence
            </p>
            <p className="text-xs text-on-surface-variant">
              Rappeler si plus de X secondes de silence
            </p>
          </div>
          <Toggle value={silenceEnabled} onChange={setSilenceEnabled} />
        </div>
        {silenceEnabled && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Délai (secondes)">
              <input
                type="number"
                defaultValue={agent.silenceTimeoutSec ?? 7}
                min={1} max={60}
                onChange={(e) => onChange?.("silenceTimeoutSec", parseInt(e.target.value))}
                className="input-field"
              />
            </Field>
            <Field label="Nb rappels max">
              <input
                type="number"
                defaultValue={agent.maxSilenceRetries ?? 2}
                min={0} max={10}
                onChange={(e) => onChange?.("maxSilenceRetries", parseInt(e.target.value))}
                className="input-field"
              />
            </Field>
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-card p-6">
      <h3
        className="mb-5 text-sm font-bold uppercase tracking-widest text-on-surface-variant"
      >
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-on-surface-variant">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? "bg-primary" : "bg-surface-container-high"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
