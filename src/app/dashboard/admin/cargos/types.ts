import { z } from 'zod';

export const CargoFormSchema = z.object({
  name: z.string().min(2, 'O nome do cargo deve ter pelo menos 2 caracteres.'),
});

export type CargoFormInput = z.infer<typeof CargoFormSchema>;
