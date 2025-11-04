'use client';

import {
  assistDatePrediction,
  type AssistDatePredictionInput,
  type AssistDatePredictionOutput
} from '@/ai/flows/assist-date-prediction';
import {
  getPersonalizedDayOfDeath,
  type PersonalizedDayOfDeathInput,
  type PersonalizedDayOfDeathOutput
} from '@/ai/flows/personalized-day-of-death';

export async function runGetPersonalizedDayOfDeath(
  input: PersonalizedDayOfDeathInput
): Promise<PersonalizedDayOfDeathOutput> {
  // The Genkit flow is a server action, so we can call it directly from the client.
  return getPersonalizedDayOfDeath(input);
}

export async function runAssistDatePrediction(
  input: AssistDatePredictionInput
): Promise<AssistDatePredictionOutput> {
  // The Genkit flow is a server action, so we can call it directly from the client.
  return assistDatePrediction(input);
}
