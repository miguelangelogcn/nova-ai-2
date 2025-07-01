'use server';

import { generateSwotAnalysis } from "@/ai/flows/swot-analysis";
import { addAssessmentToProfile } from "@/services/user";
import type { AnalysisResult } from "./types";

export async function handleAnalysis(formData: any, uid: string): Promise<AnalysisResult> {
    const questionnaireResponsesForAI = JSON.stringify(formData, null, 2);

    try {
        const swotAnalysis = await generateSwotAnalysis({ questionnaireResponses: questionnaireResponsesForAI });

        await addAssessmentToProfile(uid, {
            swot: swotAnalysis,
            questionnaireResponses: formData,
        });

        return {
            swot: swotAnalysis,
        };

    } catch (error) {
        console.error("Error generating analysis:", error);
        throw new Error("Falha ao gerar análise. Por favor, tente novamente.");
    }
}
