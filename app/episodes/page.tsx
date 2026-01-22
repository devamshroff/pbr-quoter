// app/episodes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navigation from '../components/Navigation';

interface EpisodeMetadata {
  title: string;
  pubDate: string;
  audioUrl: string;
  spotifyUrl: string;
  applePodcastsUrl: string;
  transcribedAt: string;
  episodeArt: string;
  hosts?: string;
}

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<EpisodeMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEpisodes() {
      try {
        const response = await fetch('/api/episodes');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setEpisodes(data.episodes);
      } catch (err) {
        setError('Failed to load episodes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEpisodes();
  }, []);

  const SpotifyIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.478 17.318a.748.748 0 01-1.03.246c-2.824-1.726-6.381-2.116-10.57-1.157a.75.75 0 01-.334-1.462c4.57-1.045 8.49-.603 11.622 1.3a.75.75 0 01.312 1.073zm1.472-3.273a.936.936 0 01-1.288.308c-3.234-1.988-8.162-2.566-11.977-1.406a.938.938 0 01-.544-1.794c4.358-1.323 9.771-.682 13.49 1.609a.937.937 0 01.319 1.283zm.127-3.409c-3.876-2.302-10.266-2.514-13.97-1.39a1.125 1.125 0 11-.65-2.154c4.255-1.29 11.318-1.041 15.79 1.598a1.125 1.125 0 11-1.17 1.946z"/>
    </svg>
  );
  
  const ApplePodcastsIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.231c-5.098 0-9.231-4.133-9.231-9.231S6.902 2.769 12 2.769s9.231 4.133 9.231 9.231-4.133 9.231-9.231 9.231zm0-16.615c-2.431 0-4.385 1.954-4.385 4.384s1.954 4.385 4.385 4.385 4.384-1.954 4.384-4.385-1.953-4.384-4.384-4.384zm0 6.923c-1.4 0-2.538-1.138-2.538-2.539s1.138-2.538 2.538-2.538 2.539 1.138 2.539 2.538-1.139 2.539-2.539 2.539zm1.846 1.847h-3.692v6.923h3.692v-6.923z"/>
    </svg>
  );

  const RssIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4 4a16 16 0 0116 16h-3A13 13 0 004 7V4zm0 6a10 10 0 0110 10h-3a7 7 0 00-7-7v-3zm2.5 7a2.5 2.5 0 11-.001 5.001A2.5 2.5 0 016.5 17z"/>
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-800 text-2xl font-bold">Loading episodes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-600 text-2xl font-bold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {episodes.map((episode, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all duration-300 border-2 border-gray-200"
            >
              <div className="flex gap-6 items-start">
                {/* Episode Art */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={episode.episodeArt.replace('public/', '/')}
                      alt={episode.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                {/* Episode Info */}
                <div className="flex-grow">
                  <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-wide">
                    {episode.title}
                  </h2>
                  
                  {episode.hosts && (
                    <p className="text-gray-700 mb-3 font-semibold">
                      <span className="text-gray-500">Hosts:</span> {episode.hosts}
                    </p>
                  )}
                  
                  <p className="text-gray-600 mb-4">
                    {new Date(episode.pubDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  
                  {/* Links */}
                {/* Links */}
                <div className="flex gap-4 flex-wrap">
                    {episode.spotifyUrl && (
                      <a
                        href={episode.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-black px-4 py-2 rounded-lg transition-colors font-semibold"
                      >
                        <SpotifyIcon className="w-5 h-5" />
                        Spotify
                      </a>
                    )}
                    
                    {episode.audioUrl && (
                      <a
                        href={episode.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-blue-400 px-4 py-2 rounded-lg transition-colors font-semibold border border-blue-400"
                      >
                        <RssIcon className="w-5 h-5" />
                        RSS Feed
                      </a>
                    )}
                    
                    {episode.applePodcastsUrl && (
                      <a
                        href={episode.applePodcastsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#D60017] hover:bg-[#e6001a] text-black px-4 py-2 rounded-lg transition-colors font-semibold"
                      >
                        <ApplePodcastsIcon className="w-5 h-5" />
                        Apple
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}