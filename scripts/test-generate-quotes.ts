// scripts/test-generate-quotes.ts
import { extractQuotes } from '../lib/generate-quotes';
import { Episode } from '../lib/read-random-episode';

import fs from 'fs';
import path from 'path';

async function testGenerateQuotes() {
  // Manually specify which episode to test
  const episodeFilename = '2025-12-12-13-solooo-2-i-quit-my-job';
  
  const transcriptsDir = path.join(process.cwd(), 'transcripts');
  const jsonPath = path.join(transcriptsDir, `${episodeFilename}.json`);
  const txtPath = path.join(transcriptsDir, `${episodeFilename}.txt`);
  
  // Check if files exist
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: ${jsonPath} not found`);
    console.log('\nAvailable files:');
    const files = fs.readdirSync(transcriptsDir).filter(f => f.endsWith('.json'));
    files.forEach(f => console.log(`  - ${f.replace('.json', '')}`));
    process.exit(1);
  }
  
  // Read episode data
  const metadata = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const transcription = fs.readFileSync(txtPath, 'utf-8');
  
  const episode: Episode = {
    title: metadata.title,
    pubDate: metadata.pubDate,
    audioUrl: metadata.audioUrl,
    spotifyUrl: metadata.spotifyUrl,
    applePodcastsUrl: metadata.applePodcastsUrl,
    transcription: transcription,
    episodeArt: metadata.episodeArt
  };
  
  console.log(`Testing quote extraction for: ${episode.title}`);
  console.log(`Transcription length: ${transcription.length} characters\n`);
  console.log('Sending to OpenAI...\n');
  
  const result = await extractQuotes(episode);
  
  console.log('=== SYNOPSIS ===');
  console.log(result.synopsis);
  console.log('\n=== QUOTES ===');
  result.quotes.forEach((quote, i) => {
    console.log(`${i + 1}. "${quote}"`);
  });
}

testGenerateQuotes().catch(console.error);