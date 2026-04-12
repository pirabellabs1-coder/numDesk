"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Wrench, Play, GripVertical } from "lucide-react";

type ToolParam = {
  name: string;
  type: "string" | "number" | "boolean" | "enum";
  description: string;
  enum?: string;
  required: boolean;
};

type ExternalTool = {
  id: string;
  name: string;
  description: string;
  callType: "test" | "front" | "server" | "transfer";
  webhookUrl: string;
  apiKey: string;
  enabled: boolean;
  expanded: boolean;
  parameters: ToolParam[];
};

const CALL_TYPES = [
  { id: "test", label: "TEST" },
  { id: "front", label: "FRONT" },
  { id: "server", label: "SERVER / MAKE / N8N" },
  { id: "transfer", label: "CALL TRANSFER" },
];

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function TabOutils({ agent, onChange }: { agent?: any; onChange?: (field: string, value: any) => void }) {
  const [tools, setTools] = useState<ExternalTool[]>(
    agent?.tools?.map((t: any) => ({ ...t, expanded: false })) || []
  );
  const [hangupEnabled, setHangupEnabled] = useState(agent?.hangupToolEnabled ?? true);

  const updateTools = (newTools: ExternalTool[]) => {
    setTools(newTools);
    onChange?.("tools", newTools.map(({ expanded, ...rest }) => rest));
  };

  const addTool = () => {
    const newTool: ExternalTool = {
      id: generateId(),
      name: "",
      description: "",
      callType: "server",
      webhookUrl: "",
      apiKey: "",
      enabled: true,
      expanded: true,
      parameters: [],
    };
    updateTools([...tools, newTool]);
  };

  const removeTool = (id: string) => {
    updateTools(tools.filter((t) => t.id !== id));
  };

  const updateTool = (id: string, field: string, value: any) => {
    updateTools(tools.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const toggleExpand = (id: string) => {
    setTools(tools.map((t) => (t.id === id ? { ...t, expanded: !t.expanded } : t)));
  };

  const addParam = (toolId: string) => {
    updateTools(
      tools.map((t) =>
        t.id === toolId
          ? {
              ...t,
              parameters: [
                ...t.parameters,
                { name: "", type: "string" as const, description: "", required: false },
              ],
            }
          : t
      )
    );
  };

  const updateParam = (toolId: string, paramIndex: number, field: string, value: any) => {
    updateTools(
      tools.map((t) =>
        t.id === toolId
          ? {
              ...t,
              parameters: t.parameters.map((p, i) =>
                i === paramIndex ? { ...p, [field]: value } : p
              ),
            }
          : t
      )
    );
  };

  const removeParam = (toolId: string, paramIndex: number) => {
    updateTools(
      tools.map((t) =>
        t.id === toolId
          ? { ...t, parameters: t.parameters.filter((_, i) => i !== paramIndex) }
          : t
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Internal Tools */}
      <div className="rounded-2xl border border-white/5 bg-card p-5">
        <h3 className="mb-4 text-sm font-bold text-on-surface">Internal Tools</h3>
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-surface-container-low p-3">
          <div>
            <p className="text-sm font-medium text-on-surface">Raccrochage</p>
            <p className="text-xs text-on-surface-variant">Permet à l'agent de raccrocher l'appel</p>
          </div>
          <button
            onClick={() => {
              setHangupEnabled(!hangupEnabled);
              onChange?.("hangupToolEnabled", !hangupEnabled);
            }}
            className={`relative h-6 w-11 rounded-full transition-colors ${hangupEnabled ? "bg-primary" : "bg-surface-container-high"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${hangupEnabled ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
      </div>

      {/* External Tools */}
      <div className="rounded-2xl border border-white/5 bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-on-surface">External Tools</h3>
          <button
            onClick={addTool}
            className="flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:border-primary hover:bg-primary/5"
          >
            <Plus size={14} />
            Ajouter un outil
          </button>
        </div>

        {tools.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant">
            <Wrench size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucun outil externe configuré.</p>
            <p className="mt-1 text-xs">Ajoutez un outil pour connecter votre agent à des services externes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="rounded-xl border border-white/5 bg-surface-container-low overflow-hidden"
              >
                {/* Tool header */}
                <div className="flex items-center gap-3 p-3">
                  <GripVertical size={14} className="text-on-surface-variant/30 shrink-0" />
                  <Wrench size={14} className="text-on-surface-variant shrink-0" />
                  <span className="flex-1 text-sm font-medium text-on-surface">
                    {tool.name ? `Tool ${tool.name}` : "Nouvel outil"}
                  </span>

                  {/* Toggle */}
                  <button
                    onClick={() => updateTool(tool.id, "enabled", !tool.enabled)}
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${tool.enabled ? "bg-tertiary" : "bg-surface-container-high"}`}
                  >
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${tool.enabled ? "left-[18px]" : "left-0.5"}`} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => removeTool(tool.id)}
                    className="shrink-0 rounded-lg p-1.5 text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>

                  {/* Expand */}
                  <button
                    onClick={() => toggleExpand(tool.id)}
                    className="shrink-0 rounded-lg p-1.5 text-on-surface-variant hover:bg-white/5 transition-colors"
                  >
                    {tool.expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Tool body */}
                {tool.expanded && (
                  <div className="border-t border-white/5 p-4 space-y-4">
                    {/* Nom de l'outil */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Nom de l'outil
                      </label>
                      <input
                        value={tool.name}
                        onChange={(e) => updateTool(tool.id, "name", e.target.value)}
                        placeholder="inscription_tool"
                        className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>

                    {/* Prompt / Description */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Prompt de l'outil
                      </label>
                      <textarea
                        value={tool.description}
                        onChange={(e) => updateTool(tool.id, "description", e.target.value)}
                        placeholder="Décrivez le but de l'outil, quand l'agent doit l'utiliser, et les conditions de déclenchement..."
                        rows={6}
                        className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                      />
                    </div>

                    {/* Type d'appel */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Type d'appel
                      </label>
                      <div className="flex gap-0 rounded-lg border border-white/10 overflow-hidden">
                        {CALL_TYPES.map((ct) => (
                          <button
                            key={ct.id}
                            onClick={() => updateTool(tool.id, "callType", ct.id)}
                            className={`flex-1 px-3 py-2 text-xs font-bold transition-all ${
                              tool.callType === ct.id
                                ? "bg-primary/20 text-primary"
                                : "bg-surface-container-lowest text-on-surface-variant hover:bg-white/5"
                            }`}
                          >
                            {ct.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Webhook URL (for server type) */}
                    {(tool.callType === "server" || tool.callType === "transfer") && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Webhook URL
                          </label>
                          <input
                            value={tool.webhookUrl}
                            onChange={(e) => updateTool(tool.id, "webhookUrl", e.target.value)}
                            placeholder="https://n8n.example.com/webhook/..."
                            className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface font-mono placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            API Key (si nécessaire)
                          </label>
                          <input
                            value={tool.apiKey}
                            onChange={(e) => updateTool(tool.id, "apiKey", e.target.value)}
                            placeholder="Optionnel"
                            type="password"
                            className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50"
                          />
                        </div>

                        {/* Test button */}
                        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-tertiary/30 py-2.5 text-sm font-bold text-tertiary transition-all hover:bg-tertiary/5">
                          <Play size={14} />
                          TESTER L'OUTIL
                        </button>
                      </>
                    )}

                    {/* Parameters */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Paramètres
                        </label>
                        <button
                          onClick={() => addParam(tool.id)}
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/5 transition-colors"
                        >
                          <Plus size={12} />
                          Ajouter
                        </button>
                      </div>

                      {tool.parameters.length === 0 && (
                        <p className="text-xs text-on-surface-variant/50 text-center py-2">
                          Aucun paramètre. Cliquez "Ajouter" pour définir les données à collecter.
                        </p>
                      )}

                      {tool.parameters.map((param, pIdx) => (
                        <div
                          key={pIdx}
                          className="rounded-xl border border-white/5 bg-surface-container-lowest p-4 space-y-3"
                        >
                          <div className="flex justify-end">
                            <button
                              onClick={() => removeParam(tool.id, pIdx)}
                              className="rounded-lg p-1 text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {/* Param name */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                              Nom du paramètre
                            </label>
                            <input
                              value={param.name}
                              onChange={(e) => updateParam(tool.id, pIdx, "name", e.target.value)}
                              placeholder="nom"
                              className="w-full rounded-lg bg-surface-container-low px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50"
                            />
                          </div>

                          {/* Param type */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                              Type
                            </label>
                            <select
                              value={param.type}
                              onChange={(e) => updateParam(tool.id, pIdx, "type", e.target.value)}
                              className="w-full rounded-lg bg-surface-container-low px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary/50"
                            >
                              <option value="string">string</option>
                              <option value="number">number</option>
                              <option value="boolean">boolean</option>
                              <option value="enum">enum</option>
                            </select>
                          </div>

                          {/* Param description */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                              Prompt du paramètre
                            </label>
                            <input
                              value={param.description}
                              onChange={(e) => updateParam(tool.id, pIdx, "description", e.target.value)}
                              placeholder="le nom de la personne"
                              className="w-full rounded-lg bg-surface-container-low px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50"
                            />
                          </div>

                          {/* Enum values */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                              Valeurs possibles (séparées par des virgules)
                            </label>
                            <input
                              value={param.enum || ""}
                              onChange={(e) => updateParam(tool.id, pIdx, "enum", e.target.value)}
                              placeholder=""
                              className="w-full rounded-lg bg-surface-container-low px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary/50"
                            />
                          </div>

                          {/* Required */}
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={param.required}
                              onChange={(e) => updateParam(tool.id, pIdx, "required", e.target.checked)}
                              className="h-4 w-4 rounded border-white/20 bg-surface-container-low text-primary accent-primary"
                            />
                            <span className="text-sm text-on-surface">Requis</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
