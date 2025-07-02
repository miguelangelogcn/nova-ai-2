import { z } from 'zod';

export const EditProfileSchema = z.object({
  displayName: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  age: z.string().optional(),
  education: z.string().optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
});

export type EditProfileInput = z.infer<typeof EditProfileSchema>;
