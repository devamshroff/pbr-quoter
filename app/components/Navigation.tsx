// app/components/Navigation.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isEpisodesPage = pathname === '/episodes';
  const isContactPage = pathname === '/contact';

  return (
    <div className="bg-white">
      {/* Navigation Bar */}
      <nav className="w-full bg-black py-4 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left - All Episodes */}
          <Link 
            href="/episodes" 
            className="text-white font-semibold hover:text-gray-300 transition-colors"
          >
            All Episodes
          </Link>
          
          {/* Center - PBR Quote of the Day */}
          <Link 
            href="/" 
            className="text-white font-bold text-xl hover:text-gray-300 transition-colors"
          >
            PBR Quote of the Day
          </Link>
          
          {/* Right - Contact Us */}
          <Link 
            href="/contact" 
            className="text-white font-semibold hover:text-gray-300 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </nav>

      {/* Logos - Homepage layout */}
      {isHomePage && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between px-8">
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
              <Image
                src="/images/pineapple-man-final.jpeg"
                alt="Pineapple Man"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
              <Image
                src="/images/podcast-logo.jpeg"
                alt="Pineapple Blunt Rotation"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
              <Image
                src="/images/PBR-text.jpeg"
                alt="PBR"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Episodes Page Header */}
      {isEpisodesPage && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between px-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
              <Image
                src="/images/pineapple-man-final.jpeg"
                alt="Pineapple Man"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-wide">
              All Episodes
            </h1>
            
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
              <Image
                src="/images/PBR-text.jpeg"
                alt="PBR"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Contact Page Header */}
      {isContactPage && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between px-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
              <Image
                src="/images/pineapple-man-final.jpeg"
                alt="Pineapple Man"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-wide">
              Contact Us
            </h1>

            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
              <Image
                src="/images/PBR-text.jpeg"
                alt="PBR"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed text-center">
                Have thoughts? Ideas for us? Want to collaborate?<br />
                Send us feedback! We'd love to chat.
            </p>
        </div>
        
      )}
    </div>
  );
}