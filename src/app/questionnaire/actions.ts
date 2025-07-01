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
            - Advanced Cardiac Life Support (ACLS): Master the skills needed to manage cardiac arrest and other cardiovascular emergencies.
            - Pediatric Advanced Life Support (PALS): Learn to recognize and manage life-threatening conditions in infants and children.
            - Effective Communication in Healthcare: Enhance your communication skills with patients, families, and colleagues.
            - Wound Care and Management: A comprehensive guide to assessing and treating different types of wounds.
            - Time Management for Nurses: Strategies to prioritize tasks, manage time effectively, and reduce stress.
            - Pharmacology Fundamentals: An essential review of medication administration, side effects, and interactions.
            - Burnout Prevention Strategies: Learn to identify and mitigate the risks of professional burnout.
            - Leadership and Delegation for Nurses: Develop essential leadership skills and learn to delegate tasks effectively.
        `;

        const swotString = `Strengths: ${swotAnalysis.strengths}\nWeaknesses: ${swotAnalysis.weaknesses}\nOpportunities: ${swotAnalysis.opportunities}\nThreats: ${swotAnalysis.threats}`;

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
        throw new Error("Failed to generate analysis. Please try again.");
    }
}
