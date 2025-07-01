'use server';

import { generateSwotAnalysis } from "@/ai/flows/swot-analysis";
import { updateUserProfile } from "@/services/user";
import type { AnalysisResult } from "./types";

export async function handleAnalysis(formData: any, uid: string): Promise<AnalysisResult> {
    const questionnaireResponses = JSON.stringify(formData, null, 2);

    try {
        const swotAnalysis = await generateSwotAnalysis({ questionnaireResponses });

        await updateUserProfile(uid, {
            swot: swotAnalysis,
        });

        return {
            swot: swotAnalysis,
        };

    } catch (error) {
        console.error("Error generating analysis:", error);
        throw new Error("Falha ao gerar análise. Por favor, tente novamente.");
    }
}
