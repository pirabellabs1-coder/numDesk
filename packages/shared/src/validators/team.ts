import { z } from "zod";

export const createTeamSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1, "Le nom est requis"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#4F7FFF"),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export const addTeamMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.string().default("member"),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;
