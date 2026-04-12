import { z } from "zod";

export const createContactSchema = z.object({
  workspaceId: z.string().uuid(),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  phone: z.string().optional(),
  email: z.email("Email invalide").optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const updateContactSchema = createContactSchema.partial().omit({ workspaceId: true });

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
