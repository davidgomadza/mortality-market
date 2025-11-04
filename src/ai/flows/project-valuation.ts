'use server';

/**
 * @fileOverview Provides a tool to estimate the market value of a project, business, or URL.
 *
 * - getProjectValuation - A function that estimates project value.
 * - ProjectValuationInput - The input type for the getProjectValuation function.
 * - ProjectValuationOutput - The return type for the getProjectValuation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectValuationInputSchema = z.object({
  projectName: z.string().describe("The name of the project or a URL."),
  description: z.string().describe("A brief description of the project."),
  category: z.string().describe("The category of the project (e.g., AI, Biotech, Software)."),
  stage: z.string().describe("The current stage of the project (e.g., Idea, Prototype, Production)."),
  market: z.string().describe("The target market for the project (e.g., global consumer tech)."),
});

export type ProjectValuationInput = z.infer<typeof ProjectValuationInputSchema>;

const ProjectValuationOutputSchema = z.object({
    rarityScore: z.number().describe("A score from 1-10 indicating the innovation's rarity."),
    demandLevel: z.number().describe("A score from 1-10 indicating the predicted market demand."),
    avgAiRating: z.number().describe("The average rating from a panel of 8 simulated AI valuers, from 1-10."),
    estimatedValue: z.number().describe("The final estimated market value in USD."),
    likelyRange: z.object({
        min: z.number(),
        max: z.number(),
    }).describe("The likely valuation range, min and max."),
});

export type ProjectValuationOutput = z.infer<typeof ProjectValuationOutputSchema>;

export async function getProjectValuation(
  input: ProjectValuationInput
): Promise<ProjectValuationOutput> {
  return projectValuationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectValuationPrompt',
  input: {schema: ProjectValuationInputSchema},
  output: {schema: ProjectValuationOutputSchema},
  prompt: `You are a sophisticated AI project valuation system called AdValue. Your task is to estimate the market value of a project based on the provided details.

Project Name/URL: {{{projectName}}}
Description: {{{description}}}
Category: {{{category}}}
Stage: {{{stage}}}
Target Market: {{{market}}}

Analyze the inputs and provide a valuation summary.
- Simulate a panel of 8 different AI valuers, each providing an "innovation rating" from 1 to 10. Calculate the average.
- Generate an "innovation rarity score" based on the uniqueness of the idea.
- Generate a "predicted demand level" based on the market description and category.
- Calculate a base value using the formula: (avgAiRating * rarityScore * demandLevel * 100000).
- Apply a multiplier based on the project stage: 'Idea' (0.5x), 'Prototype' (0.8x), 'In Production' (1.2x), 'Established' (1.5x).
- Calculate the final 'estimatedValue'.
- Determine a 'likelyRange' where the minimum is 85% of the estimated value and the maximum is 110%-120% of the estimated value.

Return the full analysis in the required JSON format.
`,
});

const projectValuationFlow = ai.defineFlow(
  {
    name: 'projectValuationFlow',
    inputSchema: ProjectValuationInputSchema,
    outputSchema: ProjectValuationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
