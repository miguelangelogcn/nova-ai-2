import { z } from 'zod';

export const TeamFormSchema = z.object({
  name: z.string().min(2, 'O nome da equipe deve ter pelo menos 2 caracteres.'),
  description: z.string().optional(),
});

export type TeamFormInput = z.infer<typeof TeamFormSchema>;
