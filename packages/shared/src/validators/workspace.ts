import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(255),
  planSlug: z.enum(["trial", "starter", "pro", "enterprise"]).default("trial"),
  offerType: z.enum(["minutes", "calls"]).default("minutes"),
  minutesIncluded: z.number().int().min(0).optional(),
  minutesOverageLimit: z.number().int().min(0).optional(),
  overageRateCents: z.number().int().min(0).optional(),
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
