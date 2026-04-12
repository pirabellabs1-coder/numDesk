import { z } from "zod";

export const createWebhookSchema = z.object({
  workspaceId: z.string().uuid(),
  url: z.url("URL invalide"),
  events: z.array(z.string()).min(1, "Sélectionnez au moins un événement"),
  isActive: z.boolean().default(true),
});

export const updateWebhookSchema = z.object({
  url: z.url().optional(),
  events: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type CreateWebhookInput = z.infer<typeof createWebhookSchema>;
export type UpdateWebhookInput = z.infer<typeof updateWebhookSchema>;
