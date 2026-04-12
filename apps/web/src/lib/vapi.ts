const VAPI_API_URL = "https://api.vapi.ai";

function getVapiHeaders() {
  const apiKey = process.env.VAPI_API_KEY;
  if (!apiKey) throw new Error("VAPI_API_KEY non configurée. Ajoutez-la dans vos variables d'environnement.");
  return {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

function getModelProvider(llmModel: string): string {
  if (llmModel.startsWith("gpt")) return "openai";
  if (llmModel.startsWith("claude")) return "anthropic";
  if (llmModel.startsWith("gemini")) return "google";
  return "openai"; // fallback
}

function getVoiceConfig(voiceProvider?: string, voiceId?: string) {
  // If voiceId is a display label like "Cartesia — Fabien", use default
  const isDisplayLabel = voiceId && voiceId.includes(" — ");

  if (voiceProvider === "elevenlabs" && voiceId && !isDisplayLabel) {
    return { provider: "11labs" as const, voiceId };
  }
  if (voiceProvider === "cartesia" && voiceId && !isDisplayLabel) {
    return { provider: "cartesia" as const, voiceId };
  }
  // Default: Cartesia French voice
  return {
    provider: "cartesia" as const,
    voiceId: "a0e99841-438c-4a64-b679-ae501e7d6091",
  };
}

export async function createVapiAssistant(agent: {
  name: string;
  prompt: string;
  firstMessage?: string;
  voiceProvider?: string;
  voiceId?: string;
  llmModel?: string;
  language?: string;
  temperature?: number;
}) {
  const llmModel = agent.llmModel || "gemini-2.5-flash";

  const body: Record<string, unknown> = {
    name: agent.name,
    model: {
      provider: getModelProvider(llmModel),
      model: llmModel,
      messages: [{ role: "system", content: agent.prompt || "Tu es un assistant téléphonique professionnel." }],
      temperature: agent.temperature ?? 0.4,
    },
    voice: getVoiceConfig(agent.voiceProvider, agent.voiceId),
    firstMessage: agent.firstMessage || "Bonjour, comment puis-je vous aider ?",
    transcriber: {
      provider: "deepgram",
      language: agent.language || "fr",
    },
  };

  const res = await fetch(`${VAPI_API_URL}/assistant`, {
    method: "POST",
    headers: getVapiHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    let detail = errText;
    try { detail = JSON.parse(errText).message || errText; } catch {}
    throw new Error(`Erreur Vapi (${res.status}): ${detail}`);
  }

  return res.json();
}

export async function updateVapiAssistant(assistantId: string, updates: {
  name?: string;
  prompt?: string;
  firstMessage?: string;
  voiceProvider?: string;
  voiceId?: string;
  temperature?: number;
}) {
  const body: Record<string, unknown> = {};
  if (updates.name) body.name = updates.name;
  if (updates.firstMessage) body.firstMessage = updates.firstMessage;
  if (updates.prompt) {
    body.model = { messages: [{ role: "system", content: updates.prompt }] };
  }
  if (updates.temperature !== undefined) {
    body.model = { ...(body.model as Record<string, unknown> || {}), temperature: updates.temperature };
  }
  if (updates.voiceProvider || updates.voiceId) {
    body.voice = getVoiceConfig(updates.voiceProvider, updates.voiceId);
  }

  const res = await fetch(`${VAPI_API_URL}/assistant/${assistantId}`, {
    method: "PATCH",
    headers: getVapiHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    let detail = errText;
    try { detail = JSON.parse(errText).message || errText; } catch {}
    throw new Error(`Erreur Vapi (${res.status}): ${detail}`);
  }

  return res.json();
}

export async function deleteVapiAssistant(assistantId: string) {
  const res = await fetch(`${VAPI_API_URL}/assistant/${assistantId}`, {
    method: "DELETE",
    headers: getVapiHeaders(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erreur suppression Vapi (${res.status}): ${errText}`);
  }

  return res.json();
}

export async function createVapiCall(assistantId: string, phoneNumber: string) {
  const res = await fetch(`${VAPI_API_URL}/call/phone`, {
    method: "POST",
    headers: getVapiHeaders(),
    body: JSON.stringify({
      assistantId,
      customer: { number: phoneNumber },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    let detail = errText;
    try { detail = JSON.parse(errText).message || errText; } catch {}
    throw new Error(`Erreur appel Vapi (${res.status}): ${detail}`);
  }

  return res.json();
}

export async function listVapiAssistants() {
  const res = await fetch(`${VAPI_API_URL}/assistant`, {
    method: "GET",
    headers: getVapiHeaders(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erreur liste Vapi (${res.status}): ${errText}`);
  }

  return res.json();
}
