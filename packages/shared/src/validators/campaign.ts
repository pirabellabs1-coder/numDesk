import { z } from "zod";

export const createCampaignSchema = z.object({
  workspaceId: z.string().uuid(),
  agentId: z.string().uuid(),
  phoneNumberId: z.string().uuid().optional(),
  name: z.string().min(1, "Le nom est requis"),
  contacts: z.array(z.object({
    name: z.string(),
    phone: z.string(),
    variables: z.record(z.string(), z.string()).optional(),
  })).optional(),
  callWindowStart: z.string().optional(),
  callWindowEnd: z.string().optional(),
  maxRetries: z.number().int().min(0).default(2),
  retryDelayMinutes: z.number().int().min(1).default(60),
});

export const updateCampaignSchema = createCampaignSchema.partial().omit({ workspaceId: true });

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
