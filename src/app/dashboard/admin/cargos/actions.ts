'use server';

import { addCargo, getCargos, updateCargo, deleteCargo, getCargo } from '@/services/cargos';
import { type CargoFormInput, CargoFormSchema } from './types';
import { addLog } from '@/services/logs';

export async function getCargosAction() {
    try {
        const cargos = await getCargos();
        return cargos;
    } catch (error: any) {
        console.error("Erro ao buscar cargos (ação):", error.message);
        throw new Error("Não foi possível carregar os cargos. Verifique os logs do servidor.");
    }
}

export async function addCargoAction(data: CargoFormInput, requestorUid: string) {
  const validation = CargoFormSchema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => issue.message).join(' ');
    return { success: false, error: `Dados inválidos: ${errorMessages}` };
  }

  try {
    const { name } = validation.data;
    await addCargo(name);
    await addLog(requestorUid, 'CARGO_CREATED', { cargoName: name });
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao criar cargo (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao criar o cargo.' };
  }
}

export async function updateCargoAction(id: string, data: CargoFormInput, requestorUid: string) {
  const validation = CargoFormSchema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues.map(issue => issue.message).join(' ');
    return { success: false, error: `Dados inválidos: ${errorMessages}` };
  }

  try {
    const { name } = validation.data;
    await updateCargo(id, name);
    await addLog(requestorUid, 'CARGO_UPDATED', { cargoId: id, newName: name });
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar cargo (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao atualizar o cargo.' };
  }
}

export async function deleteCargoAction(id: string, requestorUid: string) {
  try {
    const cargoToDelete = await getCargo(id);
    if (!cargoToDelete) {
        return { success: false, error: 'Cargo não encontrado.' };
    }
    await deleteCargo(id);
    await addLog(requestorUid, 'CARGO_DELETED', { cargoName: cargoToDelete.name });
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao excluir cargo (ação):', error);
    return { success: false, error: 'Ocorreu um erro desconhecido ao excluir o cargo.' };
  }
}
