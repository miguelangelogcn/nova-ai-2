'use server';

import { getAllUsers } from '@/services/user.admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Server action to get all users and sort them alphabetically by display name.
 * This function is called by the AdminUsersPage.
 * @returns A promise that resolves to a sorted array of AppUser objects.
 */
export async function getUsersAction() {
    try {
        const users = await getAllUsers();
        // Sort users by display name alphabetically before returning
        users.sort((a, b) => a.displayName.localeCompare(b.displayName));
        return users;
    } catch (error: any) {
        console.error("Erro ao buscar usuários (ação):", error.message);
        // Re-throw the original error message to provide clear feedback on the UI
        throw new Error(error.message);
    }
}


const AddUserSchema = z.object({
  displayName: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('O e-mail fornecido não é válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  role: z.enum(['enfermeiro', 'tecnico', 'admin']),
  team: z.string().optional(),
});

export type AddUserInput = z.infer<typeof AddUserSchema>;

export async function addUserAction(data: AddUserInput) {
  const validation = AddUserSchema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => issue.message).join(' ');
    return { success: false, error: `Dados inválidos: ${errorMessages}` };
  }

  const { email, password, displayName, role, team } = validation.data;

  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
      emailVerified: true, 
    });

    await adminDb.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      displayName,
      email,
      photoURL: '',
      role,
      team: team ?? '',
      createdAt: Timestamp.now(),
      status: 'Ativo',
    });

    revalidatePath('/dashboard/admin/users');

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao criar usuário (ação):', error);

    let errorMessage = 'Ocorreu um erro desconhecido ao criar o usuário.';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Este endereço de e-mail já está em uso por outra conta.';
    } else if (error.code === 'auth/invalid-password') {
      errorMessage = 'A senha fornecida não é válida. Deve ter pelo menos 6 caracteres.';
    }

    return { success: false, error: errorMessage };
  }
}
