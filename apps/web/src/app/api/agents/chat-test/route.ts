import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { agents } from "@vocalia/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    await withAuth();
    const { agentId, messages, systemPrompt } = await req.json();

    if (!agentId || !messages) {
      return apiError("VALIDATION_ERROR", "agentId et messages requis", 422);
    }

    // Load agent to get the prompt if not provided
    const db = getDb();
    const [agent] = await db.select().from(agents).where(eq(agents.id, agentId));
    if (!agent) return apiError("NOT_FOUND", "Agent introuvable", 404);

    const prompt = systemPrompt || agent.prompt || "Tu es un assistant téléphonique professionnel. Réponds en français.";

    // Try Gemini API first, then OpenAI as fallback
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let reply: string;

    if (geminiKey) {
      reply = await callGemini(geminiKey, prompt, messages);
    } else if (openaiKey) {
      reply = await callOpenAI(openaiKey, prompt, messages, agent.llmModel || "gpt-4o-mini");
    } else {
      // Fallback: simple echo mode for testing without API keys
      reply = `[Mode test] Je suis ${agent.name}. Les clés API LLM (GEMINI_API_KEY ou OPENAI_API_KEY) ne sont pas configurées. Configurez-les dans vos variables d'environnement pour activer les réponses IA.`;
    }

    return apiSuccess({ reply });
  } catch (error) {
    return handleApiError(error);
  }
}

async function callGemini(apiKey: string, systemPrompt: string, messages: { role: string; content: string }[]): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erreur Gemini (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "...";
}

async function callOpenAI(apiKey: string, systemPrompt: string, messages: { role: string; content: string }[], model: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model.startsWith("gpt") ? model : "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.4,
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erreur OpenAI (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "...";
}
