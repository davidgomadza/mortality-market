'use server';

/**
 * @fileOverview Provides a tool to assist players with date predictions for betting on when a token will have the earliest projected Day of Death.
 *
 * - assistDatePrediction - A function that helps players predict dates.
 * - AssistDatePredictionInput - The input type for the assistDatePrediction function.
 * - AssistDatePredictionOutput - The return type for the assistDatePrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssistDatePredictionInputSchema = z.object({
  tokenDetails: z
    .string()
    .describe(
      'Details about the token, including its current status, history, and any relevant information that might affect its future.'
    ),
  currentDate: z.string().describe('The current date, to be used as a reference point.'),
  playerRiskTolerance: z
    .string()
    .describe(
      'The player’s risk tolerance (e.g., high, medium, low), which should influence the prediction’s aggressiveness.'
    ),
  predictionStrategy: z
    .string()
    .describe(
      'The prediction strategy to use (e.g., conservative, aggressive, balanced), which should influence the prediction’s methodology.'
    ),
});

export type AssistDatePredictionInput = z.infer<typeof AssistDatePredictionInputSchema>;

const AssistDatePredictionOutputSchema = z.object({
  predictedDate: z
    .string()
    .describe(
      'The predicted date of death or significant event for the token, formatted as YYYY-MM-DD.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the predicted date, including the factors considered and the strategy used.'
    ),
  confidenceLevel: z
    .number()
    .describe(
      'A confidence level (0-1) indicating the certainty of the prediction, where 0 is no confidence and 1 is complete confidence.'
    ),
});

export type AssistDatePredictionOutput = z.infer<typeof AssistDatePredictionOutputSchema>;

export async function assistDatePrediction(
  input: AssistDatePredictionInput
): Promise<AssistDatePredictionOutput> {
  return assistDatePredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistDatePredictionPrompt',
  input: {schema: AssistDatePredictionInputSchema},
  output: {schema: AssistDatePredictionOutputSchema},
  prompt: `You are an expert in predicting future events, especially related to tokens and their lifecycles. Based on the provided information, predict the most likely date of a significant event (like the end of lifecycle) for the given token.

Consider the following factors:
- Token Details: {{{tokenDetails}}}
- Current Date: {{{currentDate}}}
- Player Risk Tolerance: {{{playerRiskTolerance}}}
- Prediction Strategy: {{{predictionStrategy}}}

Reasoning:
Explain the reasoning behind your prediction, including the factors you considered and the strategy you employed. Provide a confidence level (0-1) indicating the certainty of your prediction.

Output the predicted date, reasoning, and confidence level in JSON format.

{ 
  "predictedDate": "YYYY-MM-DD",
  "reasoning": "...",
  "confidenceLevel": 0.0
}
`,
});

const assistDatePredictionFlow = ai.defineFlow(
  {
    name: 'assistDatePredictionFlow',
    inputSchema: AssistDatePredictionInputSchema,
    outputSchema: AssistDatePredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
