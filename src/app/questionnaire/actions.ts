'use server';

import { generateSwotAnalysis } from "@/ai/flows/swot-analysis";
import { addAssessmentToProfile } from "@/services/user.admin";
import type { AnalysisResult } from "./types";
import { generateDiscAnalysis } from "@/ai/flows/disc-analysis";
import { generatePersonalizedLearningPath } from "@/ai/flows/personalized-learning-path";
import { getCoursesAdmin } from "@/services/courses.admin";

export async function handleAnalysis(formData: any, uid: string): Promise<AnalysisResult> {
    const allResponsesString = JSON.stringify(formData, null, 2);

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

    let swotAnalysis, discAnalysis, learningPath;

    // Step 1: Generate SWOT and DISC in parallel
    try {
        [swotAnalysis, discAnalysis] = await Promise.all([
            generateSwotAnalysis({ questionnaireResponses: allResponsesString }),
            generateDiscAnalysis({ discQuestionnaireResponses: discResponsesString }),
        ]);
    } catch (error) {
        console.error("Error generating SWOT/DISC analysis:", error);
        throw new Error("Falha ao gerar a análise SWOT ou DISC. Por favor, tente novamente.");
    }

    // Step 2: Generate Learning Path using the SWOT result
    try {
        const courses = await getCoursesAdmin();
        const courseInfoForAI = courses.map(course => ({
            id: course.id,
            title: course.title,
            description: course.description,
            category: course.category
        }));

        learningPath = await generatePersonalizedLearningPath({
            swot: swotAnalysis,
            courses: courseInfoForAI,
        });

    } catch(error) {
        console.error("Error generating learning path:", error);
        throw new Error("Falha ao gerar sua trilha de aprendizado personalizada. Por favor, tente novamente.");
    }

    // Step 3: Save all results to the user's profile
    try {
        await addAssessmentToProfile(uid, {
            swot: swotAnalysis,
            disc: discAnalysis,
            learningPath: learningPath,
            questionnaireResponses: formData,
        });
    } catch(error) {
        console.error("Error saving assessment to profile:", error);
        throw new Error("Falha ao salvar sua avaliação. Por favor, tente novamente.");
    }
    
    // Step 4: Return all results to the UI
    return {
        swot: swotAnalysis,
        disc: discAnalysis,
        learningPath: learningPath,
    };
}
