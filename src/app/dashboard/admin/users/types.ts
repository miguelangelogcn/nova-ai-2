import { z } from 'zod';

export const AddUserSchema = z.object({
  displayName: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('O e-mail fornecido não é válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  role: z.enum(['desenvolvimento-funcionario', 'desenvolvimento-gestor', 'super-admin']),
  team: z.string().optional(),
  cargo: z.string().optional(),
  age: z.string().optional(),
  education: z.string().optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
});
export type AddUserInput = z.infer<typeof AddUserSchema>;


export const EditUserSchema = z.object({
    displayName: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
    email: z.string().email('O e-mail fornecido não é válido.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.').optional().or(z.literal('')),
    role: z.enum(['desenvolvimento-funcionario', 'desenvolvimento-gestor', 'super-admin']),
    team: z.string().optional(),
    status: z.enum(['Ativo', 'Inativo']),
    cargo: z.string().optional(),
    age: z.string().optional(),
    education: z.string().optional(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
});
export type EditUserInput = z.infer<typeof EditUserSchema>;
