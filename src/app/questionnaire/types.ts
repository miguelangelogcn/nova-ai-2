export type GenerateSwotAnalysisOutput = {
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
};

export type GenerateDiscAnalysisOutput = {
    dominance: string;
    influence: string;
    steadiness: string;
    conscientiousness: string;
    profileSummary: string;
};

export type AnalysisResult = {
    swot: GenerateSwotAnalysisOutput;
    disc?: GenerateDiscAnalysisOutput;
}
