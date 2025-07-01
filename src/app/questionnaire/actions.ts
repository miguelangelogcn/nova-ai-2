'use server';

import { generateSwotAnalysis } from "@/ai/flows/swot-analysis";
import { addAssessmentToProfile } from "@/services/user.admin";
import type { AnalysisResult } from "./types";
import { generateDiscAnalysis } from "@/ai/flows/disc-analysis";
import { generatePersonalizedLearningPath } from "@/ai/flows/personalized-learning-path";
import { getCoursesAdmin } from "@/services/courses.admin";
import type { GenerateDiscAnalysisOutput, GenerateSwotAnalysisOutput } from "./types";

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

    let swotAnalysis: GenerateSwotAnalysisOutput;
    let discAnalysis: GenerateDiscAnalysisOutput;
    let allCourses: any[];

    try {
        // Generate SWOT, DISC, and fetch courses in parallel
        [swotAnalysis, discAnalysis, allCourses] = await Promise.all([
            generateSwotAnalysis({ questionnaireResponses: allResponsesString }),
            generateDiscAnalysis({ discQuestionnaireResponses: discResponsesString }),
            getCoursesAdmin()
        ]);
    } catch (error) {
        console.error("Error during parallel analysis generation (SWOT/DISC/Courses):", error);
        throw new Error("Falha ao gerar a análise inicial (SWOT/DISC). Por favor, tente novamente.");
    }
    
    let learningPathResult;
    try {
        // Sanitize courses to only pass necessary fields to the AI
        const coursesForAI = allCourses.map(course => ({
            id: course.id,
            title: course.title,
            description: course.description,
            category: course.category,
        }));

        // Generate personalized learning path based on SWOT and courses
        learningPathResult = await generatePersonalizedLearningPath({
            swot: swotAnalysis,
            courses: coursesForAI,
        });
    } catch(error) {
        console.error("Error generating learning path:", error);
        throw new Error("Falha ao gerar sua trilha de aprendizado personalizada. Por favor, tente novamente.");
    }

    try {
        // Save everything to the user's profile
        await addAssessmentToProfile(uid, {
            swot: swotAnalysis,
            disc: discAnalysis,
            questionnaireResponses: formData,
            learningPath: learningPathResult.recommendedCourseIds,
        });
    } catch(error) {
        console.error("Error saving assessment to profile:", error);
        throw new Error("Falha ao salvar sua avaliação. Por favor, tente novamente.");
    }

    return {
        swot: swotAnalysis,
        disc: discAnalysis,
    };
}
