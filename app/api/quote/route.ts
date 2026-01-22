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
    
    // Fix the episodeArt path - just replace "public/" with "/"
    if (quoteData.episode.episodeArt) {
      if (quoteData.episode.episodeArt.startsWith('public/')) {
        quoteData.episode.episodeArt = quoteData.episode.episodeArt.replace('public/', '/');
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