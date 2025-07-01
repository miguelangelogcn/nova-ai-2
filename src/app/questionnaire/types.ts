export type GenerateSwotAnalysisOutput = {
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
};
  
export type PersonalizedLearningPathOutput = {
    learningPath: string;
};

export type AnalysisResult = {
    swot: GenerateSwotAnalysisOutput;
    path: PersonalizedLearningPathOutput;
}
