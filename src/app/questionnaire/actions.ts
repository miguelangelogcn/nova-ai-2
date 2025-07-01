'use server';

import { generateSwotAnalysis } from "@/ai/flows/swot-analysis";
import { addAssessmentToProfile } from "@/services/user.admin";
import type { AnalysisResult } from "./types";
import { generateDiscAnalysis } from "@/ai/flows/disc-analysis";

export async function handleAnalysis(formData: any, uid: string): Promise<AnalysisResult> {
    const allResponsesString = JSON.stringify(formData, null, 2);

    // Separate DISC responses for DISC analysis flow
    const discResponseKeys = [
        "dianteDeDesafio", "trabalhoEmGrupo", "tomadaDeDecisao",
        "ambienteDeTrabalho", "feedback", "ritmoDeTrabalho", "sobPressao"
    ];
    const discResponses: Record<string, string> = {};
    for (const key of discResponseKeys) {
        if (formData[key]) {
            discResponses[key] = formData[key];
        }
    }
    const discResponsesString = JSON.stringify(discResponses, null, 2);

    try {
        // Generate SWOT and DISC in parallel
        const [swotAnalysis, discAnalysis] = await Promise.all([
            generateSwotAnalysis({ questionnaireResponses: allResponsesString }),
            generateDiscAnalysis({ discQuestionnaireResponses: discResponsesString })
        ]);

        await addAssessmentToProfile(uid, {
            swot: swotAnalysis,
            disc: discAnalysis,
            questionnaireResponses: formData,
        });

        return {
            swot: swotAnalysis,
            disc: discAnalysis,
        };

    } catch (error) {
        console.error("Error generating analysis:", error);
        throw new Error("Falha ao gerar análise. Por favor, tente novamente.");
    }
}
