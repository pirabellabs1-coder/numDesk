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

/**
 * Map app language codes to Vapi/Deepgram transcriber codes.
 * Vapi nova-2 expects: fr, en, de, es, pt, it, nl, etc. (no region suffix like fr-FR)
 */
function getTranscriberLanguage(lang?: string): string {
  if (!lang) return "fr";
  // Map common codes: fr-FR -> fr, en-US -> en, de-DE -> de, etc.
  const map: Record<string, string> = {
    "fr-FR": "fr",
    "fr-CA": "fr-CA",
    "en-US": "en-US",
    "en-GB": "en-GB",
    "en-AU": "en-AU",
    "en-NZ": "en-NZ",
    "en-IN": "en-IN",
    "de-DE": "de",
    "de-CH": "de-CH",
    "es-ES": "es",
    "es-419": "es-419",
    "pt-BR": "pt-BR",
    "pt-PT": "pt",
    "it-IT": "it",
    "nl-NL": "nl",
    "nl-BE": "nl-BE",
    "ja-JP": "ja",
    "ko-KR": "ko-KR",
    "zh-CN": "zh-CN",
    "zh-TW": "zh-TW",
    "sv-SE": "sv-SE",
    "da-DK": "da-DK",
    "th-TH": "th-TH",
  };
  if (map[lang]) return map[lang];
  // If already a valid short code (fr, en, de...), use it directly
  if (lang.length <= 5) return lang.split("-")[0] ?? "fr";
  return "fr";
}

// chunkPlan controls how the LLM text stream is split before being sent to TTS.
//
// Previous attempts that FAILED:
// - punctuationBoundaries: [".", "!", "?"] with minCharacters: 80 => voice still cuts
//   because the TTS eagerly speaks each sentence at punctuation, creating audible gaps.
// - Empty punctuationBoundaries [] => Vapi API rejects ("should not be empty").
// - minCharacters > 80 => Vapi API rejects ("must not be greater than 80").
//
// WORKING FIX: Disable chunkPlan entirely (enabled: false).
// This lets the voice provider (Cartesia sonic-2) handle its own natural text buffering
// and speech flow instead of Vapi artificially splitting the LLM stream into chunks.
// Cartesia's internal chunking is optimized for natural-sounding speech and does not
// produce the mid-sentence cuts that Vapi's chunkPlan causes.
const CHUNK_PLAN = {
  enabled: false,
};

function getVoiceConfig(voiceProvider?: string, voiceId?: string, language?: string) {
  // If voiceId is a display label like "Cartesia — Fabien" (legacy data), strip to default
  const isDisplayLabel = voiceId && voiceId.includes(" — ");
  const cleanVoiceId = isDisplayLabel ? undefined : voiceId;
  const lang = language?.split("-")[0] || "fr";

  if (voiceProvider === "elevenlabs" && cleanVoiceId) {
    return {
      provider: "11labs" as const,
      voiceId: cleanVoiceId,
      model: "eleven_multilingual_v2",
      chunkPlan: CHUNK_PLAN,
    };
  }
  if (voiceProvider === "cartesia" && cleanVoiceId) {
    return {
      provider: "cartesia" as const,
      voiceId: cleanVoiceId,
      model: "sonic-2",
      language: lang,
      experimentalControls: { speed: "normal" },
      chunkPlan: CHUNK_PLAN,
    };
  }
  if (voiceProvider === "deepgram" && cleanVoiceId) {
    return {
      provider: "deepgram" as const,
      voiceId: cleanVoiceId,
      chunkPlan: CHUNK_PLAN,
    };
  }
  // Google TTS voices are not supported by Vapi — fall back to Cartesia French voice
  // All other unknown providers also fall back to Sophie (Calm) — French female
  return {
    provider: "cartesia" as const,
    voiceId: "a8a1eb38-5f15-4c1d-8722-7ac0f329727d",
    model: "sonic-2",
    language: lang,
    experimentalControls: { speed: "normal" },
    chunkPlan: CHUNK_PLAN,
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
    voice: getVoiceConfig(agent.voiceProvider, agent.voiceId, agent.language),
    firstMessage: agent.firstMessage || "Bonjour, comment puis-je vous aider ?",
    transcriber: {
      provider: "deepgram",
      language: getTranscriberLanguage(agent.language),
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
  llmModel?: string;
  language?: string;
  temperature?: number;
}) {
  const body: Record<string, unknown> = {};
  if (updates.name) body.name = updates.name;
  if (updates.firstMessage) body.firstMessage = updates.firstMessage;

  // Vapi requires provider + model whenever model object is sent
  const needsModel = updates.prompt || updates.temperature !== undefined || updates.llmModel;
  if (needsModel) {
    const llmModel = updates.llmModel || "gemini-2.5-flash";
    const modelObj: Record<string, unknown> = {
      provider: getModelProvider(llmModel),
      model: llmModel,
    };
    if (updates.prompt) {
      modelObj.messages = [{ role: "system", content: updates.prompt }];
    }
    if (updates.temperature !== undefined) {
      modelObj.temperature = updates.temperature;
    }
    body.model = modelObj;
  }

  if (updates.voiceProvider || updates.voiceId) {
    body.voice = getVoiceConfig(updates.voiceProvider, updates.voiceId, updates.language);
  }
  if (updates.language) {
    body.transcriber = { provider: "deepgram", language: getTranscriberLanguage(updates.language) };
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

export async function createVapiCall(assistantId: string, phoneNumber: string, phoneNumberId?: string) {
  // List available Vapi phone numbers if no phoneNumberId provided
  if (!phoneNumberId) {
    const phoneNums = await listVapiPhoneNumbers();
    if (phoneNums.length > 0) {
      phoneNumberId = phoneNums[0].id;
    } else {
      throw new Error("Aucun numéro de téléphone configuré dans Vapi. Importez d'abord un numéro Twilio ou SIP dans votre compte Vapi pour passer des appels sortants.");
    }
  }

  const res = await fetch(`${VAPI_API_URL}/call`, {
    method: "POST",
    headers: getVapiHeaders(),
    body: JSON.stringify({
      assistantId,
      phoneNumberId,
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

export async function listVapiPhoneNumbers() {
  const res = await fetch(`${VAPI_API_URL}/phone-number`, {
    method: "GET",
    headers: getVapiHeaders(),
  });

  if (!res.ok) {
    return [];
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
