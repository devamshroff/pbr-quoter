// lib/generate-quotes.ts
import OpenAI from 'openai';
import { Episode } from '../lib/read-random-episode';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface EpisodeQuotes {
  synopsis: string;
  quotes: string[];
}

export async function extractQuotes(episode: Episode): Promise<EpisodeQuotes> {
    console.log(`Testing quote extraction for: ${episode.title}`);
    console.log(`Transcription length: ${episode.transcription.length} characters\n`);
    console.log('Sending to OpenAI...\n');

    const prompt = `You are analyzing a podcast episode titled "${episode.title}".

Here is the full transcript:

${episode.transcription}

Please provide:
1. A 2-3 sentence synopsis of the episode. keep it positive. 
2. 10 memorable, insightful, or funny quotes from the episode that would make good daily quotes. something someone could look at and be intrigued. 

Format your response as JSON:
{
  "synopsis": "...",
  "quotes": ["quote 1", "quote 2", ...]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { 
        role: 'system', 
        content: 'You are a podcast analyst giving positive reviews who extracts meaningful quotes and creates concise summaries.' 
      },
      { 
        role: 'user', 
        content: prompt 
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const result = JSON.parse(content);

  return {
    synopsis: result.synopsis,
    quotes: result.quotes
  };
}