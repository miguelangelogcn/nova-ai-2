import { z } from 'zod';

export const EditProfileSchema = z.object({
  displayName: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('O e-mail fornecido não é válido.'),
  password: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres.').optional().or(z.literal('')),
  cargo: z.string().optional(),
  age: z.string().optional(),
  education: z.string().optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
});

export type EditProfileInput = z.infer<typeof EditProfileSchema>;
