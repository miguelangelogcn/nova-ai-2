import * as z from 'zod';

export const userFormSchema = z.object({
  displayName: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }).optional().or(z.literal('')),
  role: z.enum(["enfermeiro", "tecnico", "admin"]),
  team: z.string().optional(),
  status: z.enum(["Ativo", "Inativo"]),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
