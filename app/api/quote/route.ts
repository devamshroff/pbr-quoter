// app/api/quote/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the current-quote.json file
    const filePath = path.join(process.cwd(), 'data', 'current-quote.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'No quote available yet' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const quoteData = JSON.parse(fileContent);
    // Convert the episodeArt path to be accessible from public folder
    // If episodeArt is "public/images/podcast-logo.jpeg"
    // We'll copy it to public and serve it as "/episode-art.jpeg"
    if (quoteData.episode.episodeArt) {
        const artPath = path.join(process.cwd(), quoteData.episode.episodeArt);
        const publicArtPath = path.join(process.cwd(), 'public', 'episode-art.jpeg');
        
        // Copy the image to public folder so it's accessible
        if (fs.existsSync(artPath)) {
          fs.copyFileSync(artPath, publicArtPath);
          quoteData.episode.episodeArt = '/episode-art.jpeg'; // Update to public URL
        }
      }

    return NextResponse.json(quoteData);
  } catch (error) {
    console.error('Error reading quote:', error);
    return NextResponse.json(
      { error: 'Failed to load quote' },
      { status: 500 }
    );
  }
}