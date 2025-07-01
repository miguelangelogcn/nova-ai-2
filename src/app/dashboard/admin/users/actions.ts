'use server';

import { revalidatePath } from 'next/cache';
import type { AppUser } from '@/services/user';
import { adminCreateUser, adminUpdateUser, adminDeleteUser, adminGetAllUsers } from '@/services/user.admin';
import { userFormSchema, type UserFormValues } from './schema';

const credentialError = `Falha na autenticação do servidor. Para corrigir, crie um arquivo '.env.local' na raiz do projeto e adicione as credenciais de sua conta de serviço do Firebase. Você pode obter essas credenciais em: Console do Firebase > Configurações do Projeto > Contas de Serviço. Gere uma nova chave privada, copie os valores para as variáveis FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY, e reinicie o servidor.`;

export async function getUsersAction(): Promise<AppUser[]> {
    try {
        return await adminGetAllUsers();
    } catch (error: any) {
        console.error("Action Error: Failed to get users. Check Firebase Admin setup.", error);
        if (error.code === 'auth/internal-error' || error.message.includes('Credential') || error.message.includes('serviço') || error.message.includes('Unexpected response')) {
            throw new Error(credentialError);
        }
        throw new Error("Falha ao carregar usuários. Verifique os logs do servidor para mais detalhes.");
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
        if (error.code === 'auth/internal-error' || error.message.includes('Credential') || error.message.includes('serviço') || error.message.includes('Unexpected response')) {
             return { success: false, message: credentialError };
        }
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
