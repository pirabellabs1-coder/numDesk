import { z } from "zod";

export const createLeadSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1, "Le nom est requis"),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  value: z.string().optional(),
  source: z.string().optional(),
  stage: z.enum(["new", "contacted", "qualified", "converted", "lost"]).default("new"),
  agentId: z.string().uuid().optional(),
});

export const updateLeadSchema = createLeadSchema.partial().omit({ workspaceId: true });

export const updateLeadStageSchema = z.object({
  stage: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
