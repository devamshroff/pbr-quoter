'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface QuoteData {
  episode: {
    title: string;
    pubDate: string;
    audioUrl: string;
    episodeArt?: string;
  };
  synopsis: string;
  quotes: string[];
  generatedAt: string;
  selectedQuoteIndex: number;
}

interface QuotePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function Home() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotePositions, setQuotePositions] = useState<QuotePosition[]>([]);

  useEffect(() => {
    fetch('/api/quote')
      .then(res => res.json())
      .then(data => {
        setQuoteData(data);
        setLoading(false);
        
        // Initialize random positions and velocities for quotes
        const positions = data.quotes.map(() => ({
          x: Math.random() * 70,
          y: Math.random() * 70,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        }));
        setQuotePositions(positions);
      })
      .catch(err => {
        setError('Failed to load quote');
        setLoading(false);
      });
  }, []);

  // Animate the bouncing quotes within the container
  useEffect(() => {
    if (!quoteData) return;

    const interval = setInterval(() => {
      setQuotePositions(prev => 
        prev.map(pos => {
          let newX = pos.x + pos.vx;
          let newY = pos.y + pos.vy;
          let newVx = pos.vx;
          let newVy = pos.vy;

          // Bounce off container walls
          if (newX <= 0 || newX >= 75) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(75, newX));
          }
          if (newY <= 0 || newY >= 75) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(75, newY));
          }

          return { x: newX, y: newY, vx: newVx, vy: newVy };
        })
      );
    }, 40);

    return () => clearInterval(interval);
  }, [quoteData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-800 text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  if (error || !quoteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-800 text-2xl font-bold">{error || 'No quote available'}</div>
      </div>
    );
  }

  const currentQuote = quoteData.quotes[quoteData.selectedQuoteIndex];
  const date = new Date(quoteData.generatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Muted colors with 30% opacity - each quote gets unique color
  const bubbleColors = [
    'bg-blue-400/30',      // Muted blue
    'bg-purple-400/30',    // Muted purple
    'bg-orange-400/30',    // Muted orange
    'bg-teal-400/30',      // Muted teal
    'bg-pink-400/30',      // Muted pink
    'bg-indigo-400/30',    // Muted indigo
    'bg-cyan-400/30',      // Muted cyan
    'bg-rose-400/30',      // Muted rose
    'bg-emerald-400/30',   // Muted emerald
    'bg-amber-400/30',     // Muted amber
  ];

  // Text colors for contrast (darker versions)
  const textColors = [
    'text-blue-900',
    'text-purple-900',
    'text-orange-900',
    'text-teal-900',
    'text-pink-900',
    'text-indigo-900',
    'text-cyan-900',
    'text-rose-900',
    'text-emerald-900',
    'text-amber-900',
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header with Pineapple Man (left) and PBR Text (right) */}
        <div className="flex items-center justify-between mb-6 px-4">
          <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0">
            <Image
              src="/images/pineapple-man-final.jpg"
              alt="Pineapple Man"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="relative w-28 h-20 md:w-40 md:h-28 flex-shrink-0">
            <Image
              src="/images/PBR-text.jpg"
              alt="PBR"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Podcast Logo centered */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
            <Image
              src="/images/podcast-logo.jpg"
              alt="Pineapple Blunt Rotation"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* "PBR Quote of the Day" */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black tracking-widest text-gray-800 uppercase">
            PBR Quote of the Day
          </h2>
        </div>

        {/* Main Content */}
        <div className="space-y-8 mb-12">
          
          {/* Episode Info */}
          <div className="text-center">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-2">{date}</p>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 uppercase tracking-wide">
              {quoteData.episode.title}
            </h2>
          </div>

          {/* The Main Quote - iMessage style with tail */}
          <div className="flex justify-center px-4">
            <div className="relative max-w-3xl">
              {/* Quote bubble */}
              <div className="bg-blue-500 text-white px-8 py-6 rounded-3xl shadow-lg">
                <p className="text-2xl md:text-4xl leading-relaxed font-medium">
                  {currentQuote}
                </p>
              </div>
              {/* iMessage tail on the right */}
              <svg 
                className="absolute -right-2 bottom-0" 
                width="20" 
                height="20" 
                viewBox="0 0 20 20"
              >
                <path 
                  d="M0,0 L20,0 L20,20 Q10,10 0,20 Z" 
                  fill="#3b82f6"
                  className="fill-blue-500"
                />
              </svg>
            </div>
          </div>

          {/* Episode Art */}
          {quoteData.episode.episodeArt && (
            <div className="flex justify-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                <Image
                  src={quoteData.episode.episodeArt}
                  alt={`${quoteData.episode.title} artwork`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          )}

          {/* Synopsis */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {quoteData.synopsis}
            </p>
          </div>

          {/* Listen Link */}
          <div className="text-center">
            <a
              href={quoteData.episode.audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-white px-8 py-4 rounded-full font-black uppercase tracking-wider text-sm hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🎧 Listen to Full Episode
            </a>
          </div>
        </div>

        {/* "More Quotes" Section */}
        <div className="mt-16">
          <h3 className="text-xl font-black uppercase tracking-wide text-center text-gray-900 mb-6">
            More Quotes from This Episode
          </h3>
          
          {/* Contained Bouncing Box */}
          <div className="relative w-full h-[500px] border-2 border-gray-300 rounded-2xl overflow-hidden bg-gray-50">
            {quoteData.quotes.map((quote, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `${quotePositions[index]?.x || 0}%`,
                  top: `${quotePositions[index]?.y || 0}%`,
                  width: '250px',
                  transition: 'left 40ms linear, top 40ms linear',
                }}
              >
                {/* Muted color bubble with transparency, no border */}
                <div className={`
                  p-4 rounded-2xl shadow-lg w-full backdrop-blur-sm
                  ${bubbleColors[index % bubbleColors.length]}
                  ${textColors[index % textColors.length]}
                `}>
                  <p className="text-sm break-words font-medium">
                    {quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-12 text-gray-600 text-sm">
          <p className="font-bold uppercase tracking-wider">New quote daily • Powered by AI</p>
        </div>
      </div>
    </div>
  );
}