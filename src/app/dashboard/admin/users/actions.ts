'use server';

import { revalidatePath } from 'next/cache';
import type { AppUser } from '@/services/user';
import { adminCreateUser, adminUpdateUser, adminDeleteUser, adminGetAllUsers } from '@/services/user.admin';
import { userFormSchema, type UserFormValues } from './schema';

const credentialError = `Falha na autenticação do servidor. O formato do seu arquivo '.env.local' parece estar incorreto.

**Para corrigir, siga estes passos:**
1. Apague o conteúdo do seu arquivo '.env.local'.
2. Cole o seguinte, substituindo com seus próprios valores do arquivo JSON da sua conta de serviço:

FIREBASE_PROJECT_ID="seu-project-id"
FIREBASE_CLIENT_EMAIL="seu-client-email"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...sua chave completa aqui...\\n-----END PRIVATE KEY-----\\n"

**Importante:** Use três variáveis separadas. O valor da FIREBASE_PRIVATE_KEY deve estar entre aspas duplas (") para que as quebras de linha sejam lidas corretamente. Após salvar, reinicie o servidor.`;

export async function getUsersAction(): Promise<AppUser[]> {
    try {
        const userList = await adminGetAllUsers();
        const sortedUsers = userList.sort((a, b) => a.displayName.localeCompare(b.displayName));
        return sortedUsers;
    } catch (error: any) {
        console.error("Action Error: Failed to get users. The most likely cause is an incorrect Firebase Admin setup in '.env.local'.", error);
        // For local development, any error in this admin action is highly likely to be a credential/setup issue.
        // We will throw the detailed guidance error to help the user.
        throw new Error(credentialError);
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
