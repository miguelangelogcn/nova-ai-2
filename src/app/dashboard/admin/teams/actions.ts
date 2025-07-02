'use server';

import { addTeam, getTeams, updateTeam, deleteTeam, getTeam } from '@/services/teams';
import { type TeamFormInput, TeamFormSchema } from './types';
import { addLog } from '@/services/logs';
import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

export async function getTeamsAction() {
    try {
        const teams = await getTeams();
        return teams;
    } catch (error: any) {
        console.error("Erro ao buscar equipes (ação):", error.message);
        throw new Error("Não foi possível carregar as equipes. Verifique os logs do servidor.");
    }
}

export async function addTeamAction(data: TeamFormInput, requestorUid: string) {
  const validation = TeamFormSchema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => issue.message).join(' ');
    return { success: false, error: `Dados inválidos: ${errorMessages}` };
  }

  const { name, description } = validation.data;

  try {
    await addTeam(name, description);
    await addLog(requestorUid, 'TEAM_CREATED', { teamName: name });
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao criar equipe (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao criar a equipe.' };
  }
}

export async function updateTeamAction(id: string, data: TeamFormInput, requestorUid: string) {
  const validation = TeamFormSchema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => issue.message).join(' ');
    return { success: false, error: `Dados inválidos: ${errorMessages}` };
  }

  const { name, description } = validation.data;

  try {
    await updateTeam(id, { name, description });
    await addLog(requestorUid, 'TEAM_UPDATED', { teamId: id, newName: name });
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar equipe (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao atualizar a equipe.' };
  }
}

export async function deleteTeamAction(id: string, requestorUid: string) {
  try {
    const teamToDelete = await getTeam(id);
    if (!teamToDelete) {
        return { success: false, error: 'Equipe não encontrada.' };
    }
    await deleteTeam(id);
    await addLog(requestorUid, 'TEAM_DELETED', { teamName: teamToDelete.name });
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao excluir equipe (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao excluir a equipe.' };
  }
}

export async function assignUserToTeamAction(userId: string, teamName: string, requestorUid: string) {
  if (!userId || !teamName) {
    return { success: false, error: 'Usuário ou nome da equipe inválido.' };
  }

  try {
    const userRef = adminDb.collection('users').doc(userId);
    await userRef.update({ team: teamName });
    await addLog(requestorUid, 'USER_UPDATED', { affectedUserId: userId, details: `Atribuído à equipe '${teamName}'` });
    
    revalidatePath('/dashboard/admin/teams', 'page');
    revalidatePath('/dashboard/admin/users', 'page');
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atribuir usuário à equipe:', error);
    return { success: false, error: 'Falha ao atribuir usuário à equipe.' };
  }
}

export async function unassignUserFromTeamAction(userId: string, requestorUid:string) {
  if (!userId) {
    return { success: false, error: 'ID do usuário inválido.' };
  }
  
  try {
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    const oldTeamName = userData?.team || 'N/A';

    await userRef.update({ team: '' });
    
    await addLog(requestorUid, 'USER_UPDATED', { affectedUserId: userId, details: `Removido da equipe '${oldTeamName}'` });

    revalidatePath('/dashboard/admin/teams', 'page');
    revalidatePath('/dashboard/admin/users', 'page');
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao remover usuário da equipe:', error);
    return { success: false, error: 'Falha ao remover usuário da equipe.' };
  }
}
