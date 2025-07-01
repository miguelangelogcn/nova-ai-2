'use server';

import { generateSwotAnalysis } from "@/ai/flows/swot-analysis";
import { addAssessmentToProfile } from "@/services/user.admin";
import type { AnalysisResult } from "./types";
import { generateDiscAnalysis } from "@/ai/flows/disc-analysis";
import { generatePersonalizedLearningPath } from "@/ai/flows/personalized-learning-path";
import { getCoursesAdmin } from "@/services/courses.admin";

export async function handleAnalysis(formData: any, uid: string): Promise<AnalysisResult> {
    console.log('[handleAnalysis] Starting analysis process for user:', uid);
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

    let swotAnalysis, discAnalysis, learningPath, courses;

    // Step 1: Generate SWOT and DISC in parallel
    try {
        console.log('[handleAnalysis] Step 1: Generating SWOT and DISC analysis...');
        [swotAnalysis, discAnalysis] = await Promise.all([
            generateSwotAnalysis({ questionnaireResponses: allResponsesString }),
            generateDiscAnalysis({ discQuestionnaireResponses: discResponsesString }),
        ]);
        console.log('[handleAnalysis] Step 1 Succeeded: SWOT and DISC analysis generated.');
        if (!swotAnalysis || !discAnalysis) {
             throw new Error('A análise SWOT ou DISC retornou um resultado nulo.');
        }
    } catch (error) {
        console.error("[handleAnalysis] Step 1 FAILED: Error generating SWOT/DISC analysis:", error);
        throw new Error("Falha ao gerar a análise SWOT ou DISC. Por favor, tente novamente.");
    }

    // Step 2: Fetch courses
    try {
        console.log('[handleAnalysis] Step 2: Fetching courses...');
        courses = await getCoursesAdmin();
        console.log(`[handleAnalysis] Step 2 Succeeded: Found ${courses.length} courses.`);
    } catch (error) {
        console.error("[handleAnalysis] Step 2 FAILED: Error fetching courses:", error);
        throw new Error("Falha ao carregar os cursos da plataforma. A trilha não pôde ser gerada.");
    }

    // Step 3: Generate Learning Path using the SWOT result and courses
    try {
        console.log('[handleAnalysis] Step 3: Generating personalized learning path...');

        if (!courses || courses.length === 0) {
            console.log('[handleAnalysis] No courses available. Skipping learning path generation.');
            learningPath = { recommendedCourseIds: [], reasoning: 'Não há cursos disponíveis na plataforma no momento para criar uma recomendação.' };
        } else {
            const coursesAsString = courses.map(course => 
                `- Course ID: ${course.id}\n  - Title: ${course.title}\n  - Description: ${course.description}\n  - Category: ${course.category}`
            ).join('\n');

            console.log(`[handleAnalysis] Input for learning path AI: ${courses.length} courses formatted as string.`);

            learningPath = await generatePersonalizedLearningPath({
                swot: swotAnalysis,
                coursesAsString: coursesAsString,
            });
        }

        console.log('[handleAnalysis] Step 3 Succeeded: Personalized learning path generated.');
        if (!learningPath) {
            throw new Error('A função generatePersonalizedLearningPath retornou um resultado nulo ou indefinido.');
        }
        console.log('[handleAnalysis] Learning Path Result:', JSON.stringify(learningPath, null, 2));

    } catch(error) {
        console.error("[handleAnalysis] Step 3 FAILED: Error generating learning path:", error);
        throw new Error("Falha ao gerar sua trilha de aprendizado personalizada com a IA. Por favor, tente novamente.");
    }

    // Step 4: Save all results to the user's profile
    try {
        console.log('[handleAnalysis] Step 4: Saving assessment to profile...');
        await addAssessmentToProfile(uid, {
            swot: swotAnalysis,
            disc: discAnalysis,
            learningPath: learningPath,
            questionnaireResponses: formData,
        });
        console.log('[handleAnalysis] Step 4 Succeeded: Assessment saved to profile.');
    } catch(error) {
        console.error("[handleAnalysis] Step 4 FAILED: Error saving assessment to profile:", error);
        throw new Error("Falha ao salvar sua avaliação no perfil. Por favor, tente novamente.");
    }
    
    console.log('[handleAnalysis] Analysis process completed successfully.');
    // Step 5: Return all results to the UI
    return {
        swot: swotAnalysis,
        disc: discAnalysis,
        learningPath: learningPath,
    };
}
