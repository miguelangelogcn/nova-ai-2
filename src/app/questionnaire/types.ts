export type GenerateSwotAnalysisOutput = {
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
};

export type AnalysisResult = {
    swot: GenerateSwotAnalysisOutput;
}
