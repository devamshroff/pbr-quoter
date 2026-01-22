// lib/read-all-episodes.ts
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export interface EpisodeMetadata {
  title: string;
  pubDate: string;
  audioUrl: string;
  spotifyUrl?: string;
  applePodcastsUrl?: string;
  transcribedAt: string;
  episodeArt: string;
  hosts?: string;
}

export async function readAllEpisodes(): Promise<EpisodeMetadata[]> {
  const transcriptsDir = './transcripts';
  
  const files = await readdir(transcriptsDir);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  const episodes: EpisodeMetadata[] = [];
  
  for (const file of jsonFiles) {
    const filePath = join(transcriptsDir, file);
    const content = await readFile(filePath, 'utf-8');
    const metadata: EpisodeMetadata = JSON.parse(content);
    episodes.push(metadata);
  }
  
  // Sort by pub date (newest first)
  episodes.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    return dateB - dateA;
  });
  
  return episodes;
}