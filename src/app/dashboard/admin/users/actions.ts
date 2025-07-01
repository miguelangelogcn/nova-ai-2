'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { adminCreateUser, adminUpdateUser, adminDeleteUser, adminGetAllUsers, AppUser } from '@/services/user';

export const userFormSchema = z.object({
  displayName: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }).optional().or(z.literal('')),
  role: z.enum(["enfermeiro", "tecnico", "admin"]),
  team: z.string().optional(),
  status: z.enum(["Ativo", "Inativo"]),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export async function getUsersAction(): Promise<AppUser[]> {
    try {
        return await adminGetAllUsers();
    } catch (error) {
        console.error("Action Error: Failed to get users", error);
        return [];
    }
}

export async function addUserAction(data: UserFormValues) {
    const validation = userFormSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: validation.error.flatten().fieldErrors };
    }
    if(!validation.data.password) {
        return { success: false, message: "A senha é obrigatória para novos usuários." };
    }

    try {
        await adminCreateUser(validation.data);
        revalidatePath('/dashboard/admin/users');
        return { success: true, message: 'Usuário adicionado com sucesso.' };
    } catch (error: any) {
        return { success: false, message: `Falha ao adicionar usuário: ${error.message}` };
    }
}

export async function updateUserAction(uid: string, data: Partial<UserFormValues>) {
     const validation = userFormSchema.partial().safeParse(data);
    if (!validation.success) {
        return { success: false, message: validation.error.flatten().fieldErrors };
    }
    
    try {
        await adminUpdateUser(uid, validation.data);
        revalidatePath('/dashboard/admin/users');
        return { success: true, message: 'Usuário atualizado com sucesso.' };
    } catch (error: any) {
        return { success: false, message: `Falha ao atualizar usuário: ${error.message}` };
    }
}

export async function deleteUserAction(uid: string) {
    try {
        await adminDeleteUser(uid);
        revalidatePath('/dashboard/admin/users');
        return { success: true, message: 'Usuário removido com sucesso.' };
    } catch (error: any) {
        return { success: false, message: `Falha ao remover usuário: ${error.message}` };
    }
}
