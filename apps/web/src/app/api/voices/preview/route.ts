import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-helpers";

const PREVIEW_TEXT = "Bonjour, je suis votre assistante vocale. Comment puis-je vous aider aujourd'hui ?";

// Simple rate limit
const rateMap = new Map<string, { count: number; reset: number }>();

export async function POST(req: NextRequest) {
  try {
    await withAuth();

    // Rate limit: 20 per minute
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (entry && now < entry.reset) {
      if (entry.count >= 20) {
        return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
      }
      entry.count++;
    } else {
      rateMap.set(ip, { count: 1, reset: now + 60_000 });
    }

    const body = await req.json();
    const { voiceId, provider, text } = body;
    const previewText = text || PREVIEW_TEXT;

    // Google TTS
    if (provider === "google") {
      const googleKey = process.env.GOOGLE_TTS_API_KEY;
      if (!googleKey) return NextResponse.json({ error: "Google TTS non configuré" }, { status: 500 });

      const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text: previewText },
          voice: { languageCode: "fr-FR", name: voiceId },
          audioConfig: { audioEncoding: "MP3", speakingRate: 1.0, pitch: 0, sampleRateHertz: 24000 },
        }),
      });

      if (!res.ok) return NextResponse.json({ error: "Erreur Google TTS" }, { status: 500 });
      const data = await res.json();
      return NextResponse.json({ audio: data.audioContent, format: "mp3" });
    }

    // Cartesia TTS
    if (provider === "cartesia") {
      const cartesiaKey = process.env.CARTESIA_API_KEY;
      if (!cartesiaKey) return NextResponse.json({ error: "Cartesia non configuré" }, { status: 500 });

      const res = await fetch("https://api.cartesia.ai/tts/bytes", {
        method: "POST",
        headers: {
          "X-API-Key": cartesiaKey,
          "Cartesia-Version": "2024-06-10",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_id: "sonic-french",
          transcript: previewText,
          voice: { mode: "id", id: voiceId },
          output_format: { container: "mp3", encoding: "mp3", sample_rate: 24000 },
        }),
      });

      if (!res.ok) return NextResponse.json({ error: "Erreur Cartesia TTS" }, { status: 500 });
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      return NextResponse.json({ audio: base64, format: "mp3" });
    }

    // ElevenLabs TTS
    if (provider === "elevenlabs") {
      const elKey = process.env.ELEVENLABS_API_KEY;
      if (!elKey) return NextResponse.json({ error: "ElevenLabs non configuré" }, { status: 500 });

      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": elKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: previewText,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      });

      if (!res.ok) return NextResponse.json({ error: "Erreur ElevenLabs TTS" }, { status: 500 });
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      return NextResponse.json({ audio: base64, format: "mp3" });
    }

    return NextResponse.json({ error: "Provider non supporté" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
