import { NextRequest, NextResponse } from "next/server";

const DEMO_TEXT = "Bonjour, je suis votre assistante vocale Callpme. Comment puis-je vous aider aujourd'hui ?";

const VOICE_MAP: Record<string, { provider: string; voiceId: string }> = {
  "Sophie": { provider: "google", voiceId: "fr-FR-Wavenet-C" },
  "Gabriel": { provider: "google", voiceId: "fr-FR-Wavenet-B" },
  "Marie": { provider: "google", voiceId: "fr-FR-Wavenet-A" },
  "Wavenet-A": { provider: "google", voiceId: "fr-FR-Wavenet-A" },
};

// Simple in-memory rate limit (max 10 req / 60s per IP)
const rateMap = new Map<string, { count: number; reset: number }>();

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (entry && now < entry.reset) {
      if (entry.count >= 10) {
        return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
      }
      entry.count++;
    } else {
      rateMap.set(ip, { count: 1, reset: now + 60_000 });
    }

    const body = await req.json();
    const voiceName = body.voice || "Sophie";
    const voiceConfig = VOICE_MAP[voiceName] || VOICE_MAP["Sophie"]!;

    const googleKey = process.env.GOOGLE_TTS_API_KEY;
    if (!googleKey) {
      return NextResponse.json({ error: "TTS non configuré" }, { status: 500 });
    }

    const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text: DEMO_TEXT },
        voice: { languageCode: "fr-FR", name: voiceConfig.voiceId },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: 1.0,
          pitch: 0,
          sampleRateHertz: 24000,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `TTS error: ${errText.slice(0, 100)}` }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ audio: data.audioContent, format: "mp3" });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
