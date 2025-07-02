'use server';

import { getUserAdmin, getAllUsers } from '@/services/user.admin';
import { revalidatePath } from 'next/cache';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { type AddUserInput, AddUserSchema, type EditUserInput, EditUserSchema } from './types';
import { addLog } from '@/services/logs';


/**
 * Server action to get all users and sort them alphabetically by display name.
 * This function is called by the AdminUsersPage.
 * @returns A promise that resolves to a sorted array of AppUser objects.
 */
export async function getUsersAction() {
    try {
        const allUsers = await getAllUsers();
        
        // Filter out super-admin users from the list, showing only manageable roles.
        const visibleUsers = allUsers.filter(user =>
            user.role === 'desenvolvimento-funcionario' || user.role === 'desenvolvimento-gestor'
        );

        // Sort users by display name alphabetically before returning
        visibleUsers.sort((a, b) => a.displayName.localeCompare(b.displayName));
        return visibleUsers;
    } catch (error: any) {
        console.error("Erro ao buscar usuários (ação):", error.message);
        // Re-throw the original error message to provide clear feedback on the UI
        throw new Error(error.message);
    }
}

export async function addUserAction(data: AddUserInput, requestorUid: string) {
  const validation = AddUserSchema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => issue.message).join(' ');
    return { success: false, error: `Dados inválidos: ${errorMessages}` };
  }
  
  const requestor = await getUserAdmin(requestorUid);
  if (!requestor) {
      return { success: false, error: "Usuário solicitante não encontrado." };
  }

  const { email, password, displayName, role, team, cargo, age, education, phone, cpf } = validation.data;

  if (role === 'super-admin' && requestor.role !== 'super-admin') {
      return { success: false, error: 'Você não tem permissão para criar usuários com Acesso Total.' };
  }

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
      cargo: cargo ?? '',
      createdAt: Timestamp.now(),
      status: 'Ativo',
      age: age ?? '',
      education: education ?? '',
      phone: phone ?? '',
      cpf: cpf ?? '',
    });

    revalidatePath('/dashboard/admin/users');
    
    await addLog(requestorUid, 'USER_CREATED', { affectedUserEmail: email, roleAssigned: role });

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

export async function updateUserAction(uid: string, data: EditUserInput, requestorUid: string) {
  const validation = EditUserSchema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => issue.message).join(' ');
    return { success: false, error: `Dados inválidos: ${errorMessages}` };
  }
  
  const requestor = await getUserAdmin(requestorUid);
  if (!requestor) {
      return { success: false, error: "Usuário solicitante não encontrado." };
  }


  const { displayName, email, password, role, team, status, cargo, age, education, phone, cpf } = validation.data;

  if (role === 'super-admin' && requestor.role !== 'super-admin') {
      return { success: false, error: 'Você não tem permissão para atribuir a função de Acesso Total.' };
  }

  try {
    const authUpdatePayload: { displayName: string; email: string; password?: string } = {
        displayName,
        email,
    };
    if (password) {
        authUpdatePayload.password = password;
    }
    // Update Firebase Auth user
    await adminAuth.updateUser(uid, authUpdatePayload);

    // Update Firestore user document
    await adminDb.collection('users').doc(uid).update({
      displayName,
      email,
      role,
      team: team ?? '',
      status,
      cargo: cargo ?? '',
      age: age ?? '',
      education: education ?? '',
      phone: phone ?? '',
      cpf: cpf ?? '',
    });

    revalidatePath('/dashboard/admin/users');
    
    await addLog(requestorUid, 'USER_UPDATED', { affectedUserEmail: email });

    return { success: true };
  } catch (error: any)
   {
    console.error('Erro ao atualizar usuário (ação):', error);
    if (error.code === 'auth/email-already-exists') {
        return { success: false, error: 'Este endereço de e-mail já está em uso por outra conta.' };
    }
    return { success: false, error: 'Ocorreu um erro desconhecido ao atualizar o usuário.' };
  }
}

export async function deleteUserAction(uid: string, requestorUid: string) {
  try {
    const userToDelete = await getUserAdmin(uid);
    if (!userToDelete) {
        return { success: false, error: 'Usuário a ser excluído não encontrado.' };
    }

    // Delete from Firebase Auth
    await adminAuth.deleteUser(uid);

    // Delete from Firestore
    await adminDb.collection('users').doc(uid).delete();

    revalidatePath('/dashboard/admin/users');
    
    await addLog(requestorUid, 'USER_DELETED', { affectedUserEmail: userToDelete.email });

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao excluir usuário (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao excluir o usuário.' };
  }
}
