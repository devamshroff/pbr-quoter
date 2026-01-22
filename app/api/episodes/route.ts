// app/api/episodes/route.ts
import { NextResponse } from 'next/server';
import { readAllEpisodes } from '@/lib/read-all-episodes';

export async function GET() {
  try {
    const episodes = await readAllEpisodes();
    return NextResponse.json({ episodes });
  } catch (error) {
    console.error('Error loading episodes:', error);
    return NextResponse.json(
      { error: 'Failed to load episodes' },
      { status: 500 }
    );
  }
}