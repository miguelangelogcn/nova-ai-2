'use server';

import { addTeam, getTeams, updateTeam, deleteTeam } from '@/services/teams';
import { z } from 'zod';

export async function getTeamsAction() {
    try {
        const teams = await getTeams();
        return teams;
    } catch (error: any) {
        console.error("Erro ao buscar equipes (ação):", error.message);
        throw new Error("Não foi possível carregar as equipes. Verifique os logs do servidor.");
    }
}

export const TeamFormSchema = z.object({
  name: z.string().min(2, 'O nome da equipe deve ter pelo menos 2 caracteres.'),
  description: z.string().optional(),
});

export type TeamFormInput = z.infer<typeof TeamFormSchema>;

export async function addTeamAction(data: TeamFormInput) {
  const validation = TeamFormSchema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => issue.message).join(' ');
    return { success: false, error: `Dados inválidos: ${errorMessages}` };
  }

  const { name, description } = validation.data;

  try {
    await addTeam(name, description);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao criar equipe (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao criar a equipe.' };
  }
}

export async function updateTeamAction(id: string, data: TeamFormInput) {
  const validation = TeamFormSchema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => issue.message).join(' ');
    return { success: false, error: `Dados inválidos: ${errorMessages}` };
  }

  const { name, description } = validation.data;

  try {
    await updateTeam(id, { name, description });
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar equipe (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao atualizar a equipe.' };
  }
}

export async function deleteTeamAction(id: string) {
  try {
    await deleteTeam(id);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao excluir equipe (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao excluir a equipe.' };
  }
}
