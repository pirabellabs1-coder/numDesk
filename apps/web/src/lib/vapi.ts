const VAPI_API_URL = "https://api.vapi.ai";

function getVapiHeaders() {
  const apiKey = process.env.VAPI_API_KEY;
  if (!apiKey) throw new Error("VAPI_API_KEY not configured");
  return {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

export async function createVapiAssistant(agent: {
  name: string;
  prompt: string;
  firstMessage?: string;
  voiceId?: string;
  llmModel?: string;
  language?: string;
  temperature?: number;
}) {
  const body: any = {
    name: agent.name,
    model: {
      provider: agent.llmModel?.startsWith("gpt") ? "openai" : "google",
      model: agent.llmModel || "gemini-2.5-flash",
      messages: [{ role: "system", content: agent.prompt || "Tu es un assistant téléphonique professionnel." }],
      temperature: agent.temperature ?? 0.4,
    },
    voice: {
      provider: "cartesia",
      voiceId: "a0e99841-438c-4a64-b679-ae501e7d6091", // Default French voice
    },
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
    const err = await res.text();
    throw new Error(`Vapi create assistant failed: ${err}`);
  }

  return res.json();
}

export async function updateVapiAssistant(assistantId: string, updates: {
  name?: string;
  prompt?: string;
  firstMessage?: string;
  temperature?: number;
}) {
  const body: any = {};
  if (updates.name) body.name = updates.name;
  if (updates.firstMessage) body.firstMessage = updates.firstMessage;
  if (updates.prompt) {
    body.model = { messages: [{ role: "system", content: updates.prompt }] };
  }
  if (updates.temperature !== undefined) {
    body.model = { ...(body.model || {}), temperature: updates.temperature };
  }

  const res = await fetch(`${VAPI_API_URL}/assistant/${assistantId}`, {
    method: "PATCH",
    headers: getVapiHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vapi update assistant failed: ${err}`);
  }

  return res.json();
}

export async function deleteVapiAssistant(assistantId: string) {
  const res = await fetch(`${VAPI_API_URL}/assistant/${assistantId}`, {
    method: "DELETE",
    headers: getVapiHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vapi delete assistant failed: ${err}`);
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
    const err = await res.text();
    throw new Error(`Vapi create call failed: ${err}`);
  }

  return res.json();
}

export async function listVapiAssistants() {
  const res = await fetch(`${VAPI_API_URL}/assistant`, {
    method: "GET",
    headers: getVapiHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vapi list assistants failed: ${err}`);
  }

  return res.json();
}
