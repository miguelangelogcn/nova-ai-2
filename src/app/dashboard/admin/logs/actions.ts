'use server';

import { getLogs } from "@/services/logs";

export async function getLogsAction() {
    try {
        const logs = await getLogs();
        return logs;
    } catch (error: any) {
        console.error("Erro ao buscar logs (ação):", error.message);
        throw new Error("Não foi possível carregar os registros. Verifique os logs do servidor.");
    }
}
