'use server';

/**
 * @fileOverview A flow that determines a personalized day of death for a player.
 *
 * - getPersonalizedDayOfDeath - A function that handles the day of death projection process.
 * - PersonalizedDayOfDeathInput - The input type for the getPersonalizedDayOfDeath function.
 * - PersonalizedDayOfDeathOutput - The return type for the getPersonalizedDayOfDeath function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const PersonalizedDayOfDeathInputSchema = z.object({
  voiceRecordingDataUri: z
    .string()
    .describe(
      'A voice recording of the player saying "what is my day of death?", as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // prettier-ignore
    ),
});
export type PersonalizedDayOfDeathInput = z.infer<typeof PersonalizedDayOfDeathInputSchema>;

const PersonalizedDayOfDeathOutputSchema = z.object({
  projectedDayOfDeath: z.string().describe('The projected day of death for the player.'),
  audioResponse: z.string().describe('Audio response announcing the projected day of death.'),
});
export type PersonalizedDayOfDeathOutput = z.infer<typeof PersonalizedDayOfDeathOutputSchema>;

export async function getPersonalizedDayOfDeath(
  input: PersonalizedDayOfDeathInput
): Promise<PersonalizedDayOfDeathOutput> {
  return personalizedDayOfDeathFlow(input);
}

const dayOfDeathPrompt = ai.definePrompt({
  name: 'dayOfDeathPrompt',
  input: {schema: PersonalizedDayOfDeathInputSchema},
  output: {schema: PersonalizedDayOfDeathOutputSchema},
  prompt: `You are an AI that analyzes voice recordings to predict a person's day of death.

  Analyze the following voice recording and determine the projected day of death for the individual.

  Voice Recording: {{media url=voiceRecordingDataUri}}

  Respond with a date in the format YYYY-MM-DD and generate an audio response using voice synthesis to announce the projected day of death to the player. Also include some encouraging words to entice them to play our game The Mortality Market: AGT Life-Clock Wager. If the player is projected to die soon suggest ways to win a prize to redeem coins for the real AGT cure and/or to spin to win a chance at life airdrop!.

  Important audio files:
  - specific( )digitaldayofdeathcalculator.start.mp3
  - Transfer Speech( ) Synthesis To AIl Body Organs Cells and Parts How to.mp3`,
  config: {
    // Configure safety settings as needed
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const personalizedDayOfDeathFlow = ai.defineFlow(
  {
    name: 'personalizedDayOfDeathFlow',
    inputSchema: PersonalizedDayOfDeathInputSchema,
    outputSchema: PersonalizedDayOfDeathOutputSchema,
  },
  async input => {
    const {output} = await dayOfDeathPrompt(input);

    if (!output) {
      throw new Error('Could not determine the projected day of death.');
    }

    const audioResponse = await textToSpeech(output.projectedDayOfDeath);

    return {
      projectedDayOfDeath: output.projectedDayOfDeath,
      audioResponse,
    };
  }
);

async function textToSpeech(text: string): Promise<string> {
  const {media} = await ai.generate({
    model: 'googleai/gemini-2.5-flash-preview-tts',
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {voiceName: 'Algenib'},
        },
      },
    },
    prompt: text,
  });

  if (!media) {
    throw new Error('No media returned from TTS model.');
  }

  const audioBuffer = Buffer.from(
    media.url.substring(media.url.indexOf(',') + 1),
    'base64'
  );
  return 'data:audio/wav;base64,' + (await toWav(audioBuffer));
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

