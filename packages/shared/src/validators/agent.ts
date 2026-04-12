import { z } from "zod";

export const createAgentSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1, "Le nom est requis").max(255),
  prompt: z.string().optional(),
  firstMessage: z.string().optional(),
  language: z.string().default("fr-FR"),
  voiceProvider: z.enum(["cartesia", "elevenlabs", "deepgram"]).default("cartesia"),
  voiceId: z.string().optional(),
  llmModel: z.string().default("gemini-2.5-flash"),
  temperature: z.number().min(0).max(2).default(0.4),
  topP: z.number().min(0).max(1).default(1.0),
  silenceTimeoutSec: z.number().int().min(1).default(7),
  maxSilenceRetries: z.number().int().min(0).default(2),
  silencePrompt: z.string().optional(),
  voicemailEnabled: z.boolean().default(false),
  voicemailMessage: z.string().optional(),
  recordSession: z.boolean().default(true),
  recordAudio: z.boolean().default(true),
  color: z.string().optional(),
});

export const updateAgentSchema = createAgentSchema.partial().omit({ workspaceId: true });

export type CreateAgentInput = z.infer<typeof createAgentSchema>;
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;
