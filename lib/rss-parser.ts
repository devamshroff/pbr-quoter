import Parser from 'rss-parser';

export interface Episode {
    title: string;
    audioUrl: string;
    description: string;
    publishDate: string;
    episodeUrl: string;
  }


const parser = new Parser();

export async function getRandomEpisode(): Promise<void> {
    const RSS_FEED_URL = process.env.RSS_FEED_URL!;
    console.log(RSS_FEED_URL)
    
}
  