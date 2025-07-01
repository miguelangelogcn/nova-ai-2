'use server';

import { generatePersonalizedLearningPath } from "@/ai/flows/personalized-learning-path";
import { generateSwotAnalysis } from "@/ai/flows/swot-analysis";
import { updateUserProfile } from "@/services/user";
import type { AnalysisResult } from "./types";

export async function handleAnalysis(formData: any, uid: string): Promise<AnalysisResult> {
    const questionnaireResponses = JSON.stringify(formData, null, 2);

    try {
        const swotAnalysis = await generateSwotAnalysis({ questionnaireResponses });

        // A mock list of courses to be sent to the learning path generator
        const availableCourses = `
            - Suporte Avançado de Vida em Cardiologia (ACLS): Domine as habilidades necessárias para gerenciar paradas cardíacas e outras emergências cardiovasculares.
            - Suporte Avançado de Vida em Pediatria (PALS): Aprenda a reconhecer e gerenciar condições de risco de vida em bebês e crianças.
            - Comunicação Efetiva em Saúde: Aprimore suas habilidades de comunicação com pacientes, familiares e colegas.
            - Cuidado e Gerenciamento de Feridas: Um guia completo para avaliar e tratar diferentes tipos de feridas.
            - Gestão de Tempo para Enfermeiros: Estratégias para priorizar tarefas, gerenciar o tempo de forma eficaz e reduzir o estresse.
            - Fundamentos de Farmacologia: Uma revisão essencial da administração de medicamentos, efeitos colaterais e interações.
            - Estratégias de Prevenção de Burnout: Aprenda a identificar e mitigar os riscos de esgotamento profissional.
            - Liderança e Delegação para Enfermeiros: Desenvolva habilidades essenciais de liderança e aprenda a delegar tarefas de forma eficaz.
        `;

        const swotString = `Forças: ${swotAnalysis.strengths}\nFraquezas: ${swotAnalysis.weaknesses}\nOportunidades: ${swotAnalysis.opportunities}\nAmeaças: ${swotAnalysis.threats}`;

        const learningPath = await generatePersonalizedLearningPath({
            swotAnalysis: swotString,
            availableCourses: availableCourses,
        });

        await updateUserProfile(uid, {
            swot: swotAnalysis,
            path: learningPath
        });

        return {
            swot: swotAnalysis,
            path: learningPath,
        };

    } catch (error) {
        console.error("Error generating analysis:", error);
        throw new Error("Falha ao gerar análise. Por favor, tente novamente.");
    }
}
