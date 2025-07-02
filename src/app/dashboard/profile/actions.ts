'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase-admin';
import { type EditProfileInput, EditProfileSchema } from './types';
import { adminAuth } from '@/lib/firebase-admin';

export async function updateProfileAction(uid: string, data: EditProfileInput) {
  const validation = EditProfileSchema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => issue.message).join(' ');
    return { success: false, error: `Dados inválidos: ${errorMessages}` };
  }

  const { displayName, email, password, age, education, phone, cpf } = validation.data;

  try {
    const authUpdatePayload: { displayName: string, email: string, password?: string } = {
        displayName,
        email,
    };
    if (password) {
        authUpdatePayload.password = password;
    }
    
    // Update Firebase Auth
    await adminAuth.updateUser(uid, authUpdatePayload);
    
    // Update Firestore document
    await adminDb.collection('users').doc(uid).update({
      displayName,
      email,
      age: age ?? '',
      education: education ?? '',
      phone: phone ?? '',
      cpf: cpf ?? '',
    });

    revalidatePath('/dashboard/profile');
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar perfil (ação):', error);
     if (error.code === 'auth/email-already-exists') {
        return { success: false, error: 'Este endereço de e-mail já está em uso por outra conta.' };
    }
    return { success: false, error: 'Ocorreu um erro desconhecido ao atualizar o perfil.' };
  }
}
