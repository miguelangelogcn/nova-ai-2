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

  const { displayName, age, education, phone, cpf } = validation.data;

  try {
    // Update Firebase Auth display name
    await adminAuth.updateUser(uid, {
        displayName,
    });
    
    // Update Firestore document
    await adminDb.collection('users').doc(uid).update({
      displayName,
      age: age ?? '',
      education: education ?? '',
      phone: phone ?? '',
      cpf: cpf ?? '',
    });

    revalidatePath('/dashboard/profile');
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar perfil (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao atualizar o perfil.' };
  }
}
