// scripts/generate-daily-quote.ts
import { getRandomEpisode } from '../lib/read-random-episode';
import { extractQuotes, EpisodeQuotes } from '../lib/generate-quotes';
import fs, { lstat } from 'fs';
import path from 'path';

// Mock function for testing without OpenAI API
function mockExtractQuotes(episode: any): EpisodeQuotes {
  return {
    synopsis: `This episode "${episode.title}" covers interesting topics and conversations. The hosts dive deep into personal experiences and share valuable insights. A must-listen for fans of the show.`,
    quotes: [
      "Sometimes the best decisions are the ones that scare you the most.",
      "You can't wait for everything to be perfect before you start.",
      "The only failure is not trying at all."
    ]
  };
}

async function generateDailyQuote() {
  console.log('🎲 Picking random episode...\n');
  
  const episode = getRandomEpisode();
  
  console.log(`Selected: ${episode.title}`);
  console.log(`Published: ${episode.pubDate}\n`);
  
  console.log('✨ Generating quotes...\n');
  
  // Toggle between mock and real
  const USE_MOCK = false; // Set to false when OpenAI key is ready
  
  let quotes: EpisodeQuotes;
  
  if (USE_MOCK) {
    console.log('(Using mock data - no OpenAI call)\n');
    quotes = mockExtractQuotes(episode);
  } else {
    quotes = await extractQuotes(episode);
  }
  
  // Prepare the daily quote data
  const dailyQuotes = {
    episode: {
      title: episode.title,
      pubDate: episode.pubDate,
      audioUrl: episode.audioUrl,
      spotifyUrl: episode.spotifyUrl,
      applePodcastsUrl: episode.applePodcastsUrl,
      episodeArt: episode.episodeArt
    },
    synopsis: quotes.synopsis,
    quotes: quotes.quotes,
    generatedAt: new Date().toISOString(),
    selectedQuoteIndex: 0 // Always show first quote for now
  };
  
  // Save to a file
  const outputDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  const outputPath = path.join(outputDir, 'current-quote.json');
  fs.writeFileSync(outputPath, JSON.stringify(dailyQuotes, null, 2));
  
  console.log('✅ Daily quote generated!\n');
  console.log('=== Preview ===');
  console.log(`Episode: ${dailyQuotes.episode.title}`);
  console.log(`\nEpisode Art: ${dailyQuotes.episode.episodeArt}`);
  console.log(`\nSynopsis: ${dailyQuotes.synopsis}`);
  console.log(`\nQuote of the day:`);
  console.log(`"${dailyQuotes.quotes[dailyQuotes.selectedQuoteIndex]}"`);
  console.log(`\nSaved to: ${outputPath}`);
}

generateDailyQuote().catch(console.error);