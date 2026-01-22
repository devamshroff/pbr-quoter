// lib/read-random-episode.ts
import fs from 'fs';
import path from 'path';

interface EpisodeMetadata {
  title: string;
  pubDate: string;
  audioUrl: string;
  spotifyUrl: string;
  applePodcastsUrl: string;
  transcribedAt: string;
  episodeArt: string;
}

export interface Episode {
    title: string;
    pubDate: string;
    audioUrl: string;
    spotifyUrl: string;
    applePodcastsUrl: string;
    transcription: string;
    episodeArt: string;
}

export function getRandomEpisode(): Episode {
  const transcriptsDir = path.join(process.cwd(), 'transcripts');
  
  // Get all .json files
  const jsonFiles = fs.readdirSync(transcriptsDir).filter(f => f.endsWith('.json'));
  
  if (jsonFiles.length === 0) {
    throw new Error('No transcripts found');
  }
  
  // Pick random json file
  const randomJson = jsonFiles[Math.floor(Math.random() * jsonFiles.length)];
  const jsonPath = path.join(transcriptsDir, randomJson);
  const txtPath = jsonPath.replace('.json', '.txt');
  
  // Read metadata and transcription
  const metadata: EpisodeMetadata = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const transcription = fs.readFileSync(txtPath, 'utf-8');
  
  return {
    title: metadata.title,
    pubDate: metadata.pubDate,
    audioUrl: metadata.audioUrl,
    spotifyUrl: metadata.spotifyUrl,
    applePodcastsUrl: metadata.applePodcastsUrl,
    transcription: transcription,
    episodeArt: metadata.episodeArt
  };
}