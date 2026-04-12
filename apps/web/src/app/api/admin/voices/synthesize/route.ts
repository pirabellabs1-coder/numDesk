import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { z } from "zod";

const synthesizeSchema = z.object({
  text: z.string().min(1).max(1000),
  provider: z.enum(["cartesia", "elevenlabs", "google", "custom"]),
  voiceId: z.string().optional(),
  speed: z.number().min(0.5).max(2.0).default(1.0),
  pitch: z.number().min(-10).max(10).default(0),
  volume: z.number().min(0).max(100).default(100),
  stability: z.number().min(0).max(1).default(0.5),
  clarity: z.number().min(0).max(1).default(0.75),
});

export async function POST(req: NextRequest) {
  try {
    await withAuth();
    const body = synthesizeSchema.parse(await req.json());

    // ── CARTESIA ──
    if (body.provider === "cartesia") {
      const cartesiaKey = process.env.CARTESIA_API_KEY;
      if (!cartesiaKey) return apiError("VALIDATION_ERROR", "Clé API Cartesia non configurée. Ajoutez CARTESIA_API_KEY dans .env.local", 422);

      const res = await fetch("https://api.cartesia.ai/tts/bytes", {
        method: "POST",
        headers: {
          "X-API-Key": cartesiaKey,
          "Cartesia-Version": "2024-06-10",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_id: "sonic-2",
          transcript: body.text,
          voice: { mode: "id", id: body.voiceId || "a8a1eb38-5f15-4c1d-8722-7ac0f329727d" },
          language: "fr",
          output_format: { container: "mp3", encoding: "mp3", sample_rate: 44100 },
          // Cartesia speed control
          ...(body.speed !== 1.0 && { speed: body.speed > 1.0 ? "fast" : body.speed < 0.8 ? "slow" : "normal" }),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return apiError("INTERNAL_ERROR", `Cartesia: ${errText.slice(0, 200)}`, 500);
      }

      const audioBuffer = await res.arrayBuffer();
      const base64 = Buffer.from(audioBuffer).toString("base64");
      return apiSuccess({ audio: base64, format: "mp3", provider: "cartesia" });
    }

    // ── GOOGLE CLOUD TTS ──
    if (body.provider === "google") {
      const googleKey = process.env.GOOGLE_TTS_API_KEY;
      if (!googleKey) return apiError("VALIDATION_ERROR", "Clé API Google TTS non configurée. Ajoutez GOOGLE_TTS_API_KEY dans .env.local", 422);

      const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text: body.text },
          voice: { languageCode: "fr-FR", name: body.voiceId || "fr-FR-Wavenet-A" },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: body.speed,
            pitch: body.pitch,
            volumeGainDb: Math.max(-10, Math.min(10, (body.volume - 100) / 5)),
            sampleRateHertz: 24000,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return apiError("INTERNAL_ERROR", `Google TTS: ${errText.slice(0, 200)}`, 500);
      }

      const data = await res.json();
      return apiSuccess({ audio: data.audioContent, format: "mp3", provider: "google" });
    }

    // ── ELEVENLABS ──
    if (body.provider === "elevenlabs") {
      const elevenKey = process.env.ELEVENLABS_API_KEY;
      if (!elevenKey) return apiError("VALIDATION_ERROR", "Clé API ElevenLabs non configurée. Ajoutez ELEVENLABS_API_KEY dans .env.local", 422);

      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${body.voiceId || "EXAVITQu4vr4xnSDxMaL"}`, {
        method: "POST",
        headers: {
          "xi-api-key": elevenKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: body.text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: body.stability,
            similarity_boost: body.clarity,
            speed: body.speed,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return apiError("INTERNAL_ERROR", `ElevenLabs: ${errText.slice(0, 200)}`, 500);
      }

      const audioBuffer = await res.arrayBuffer();
      const base64 = Buffer.from(audioBuffer).toString("base64");
      return apiSuccess({ audio: base64, format: "mp3", provider: "elevenlabs" });
    }

    if (body.provider === "custom") {
      return apiError("VALIDATION_ERROR", "La synthèse custom nécessite un modèle entraîné", 422);
    }

    return apiError("VALIDATION_ERROR", "Provider invalide", 422);
  } catch (error) { return handleApiError(error); }
}
