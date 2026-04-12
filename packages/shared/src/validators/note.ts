import { z } from "zod";

export const createNoteSchema = z.object({
  workspaceId: z.string().uuid(),
  conversationId: z.string().uuid().optional(),
  content: z.string().min(1, "Le contenu est requis"),
  action: z.enum(["rappel", "email", "transfert", "none"]).default("none"),
});

export const updateNoteSchema = z.object({
  content: z.string().min(1).optional(),
  action: z.enum(["rappel", "email", "transfert", "none"]).optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
