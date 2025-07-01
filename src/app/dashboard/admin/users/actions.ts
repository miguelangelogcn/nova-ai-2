'use server';

import { revalidatePath } from 'next/cache';
import type { AppUser } from '@/services/user';
import { adminCreateUser, adminUpdateUser, adminDeleteUser, adminGetAllUsers } from '@/services/user.admin';
import { userFormSchema, type UserFormValues } from './schema';


export async function getUsersAction(): Promise<AppUser[]> {
    try {
        const userList = await adminGetAllUsers();
        const sortedUsers = userList.sort((a, b) => a.displayName.localeCompare(b.displayName));
        return sortedUsers;
    } catch (error: any) {
        console.error("Action Error: Failed to get users:", error);
        // The detailed setup error is now in firebase-admin.ts. This will catch other runtime errors.
        throw new Error(`Falha ao carregar usuários. Verifique os logs do servidor para mais detalhes. (${error.message})`);
    }
}

export async function addUserAction(data: UserFormValues) {
    const validation = userFormSchema.safeParse(data);
    if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors;
        const firstError = Object.values(errors)[0]?.[0] || 'Validation failed.';
        return { success: false, message: firstError };
    }
    if(!validation.data.password) {
        return { success: false, message: "A senha é obrigatória para novos usuários." };
    }

    try {
        await adminCreateUser(validation.data);
        revalidatePath('/dashboard/admin/users');
        return { success: true, message: 'Usuário adicionado com sucesso.' };
    } catch (error: any) {
        console.error("Action Error: Failed to add user:", error);
        return { success: false, message: `Falha ao adicionar usuário: ${error.message}` };
    }
}

export async function updateUserAction(uid: string, data: Partial<UserFormValues>) {
     const validation = userFormSchema.partial().safeParse(data);
    if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors;
        const firstError = Object.values(errors)[0]?.[0] || 'Validation failed.';
        return { success: false, message: firstError };
    }
    
    // Do not pass password to the updateUser function
    const { password, ...userData } = validation.data;

    try {
        await adminUpdateUser(uid, userData);
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
