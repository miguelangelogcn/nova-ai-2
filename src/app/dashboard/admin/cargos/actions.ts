'use server';

import { addCargo, getCargos, updateCargo, deleteCargo } from '@/services/cargos';
import { type CargoFormInput, CargoFormSchema } from './types';

export async function getCargosAction() {
    try {
        const cargos = await getCargos();
        return cargos;
    } catch (error: any) {
        console.error("Erro ao buscar cargos (ação):", error.message);
        throw new Error("Não foi possível carregar os cargos. Verifique os logs do servidor.");
    }
}

export async function addCargoAction(data: CargoFormInput) {
  const validation = CargoFormSchema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => issue.message).join(' ');
    return { success: false, error: `Dados inválidos: ${errorMessages}` };
  }

  try {
    await addCargo(validation.data.name);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao criar cargo (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao criar o cargo.' };
  }
}

export async function updateCargoAction(id: string, data: CargoFormInput) {
  const validation = CargoFormSchema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => issue.message).join(' ');
    return { success: false, error: `Dados inválidos: ${errorMessages}` };
  }

  try {
    await updateCargo(id, validation.data.name);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar cargo (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao atualizar o cargo.' };
  }
}

export async function deleteCargoAction(id: string) {
  try {
    await deleteCargo(id);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao excluir cargo (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao excluir o cargo.' };
  }
}
