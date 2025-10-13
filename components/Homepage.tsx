'use client';

import { ArrowRight, Image as ImageIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Homepage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF9F0]">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="/your-video.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B6F47]/20 via-[#C4A57B]/10 to-[#8B6F47]/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.gif"
                alt="Paperpatch"
                width={500}
                height={167}
                className="drop-shadow-2xl"
                priority
                unoptimized
              />
            </div>
            <h1 className="text-2xl md:text-3xl text-[#6B5444] drop-shadow-lg font-mono font-medium">
              Home of High-Quality Custom Posters Since 2021
            </h1>
          </div>

          {/* Two Large Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Gallery Section */}
            <Link href="/gallery">
              <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-[#E5D5C0] hover:border-[#C4A57B] transition-all duration-150 cursor-pointer h-[400px] lg:h-[500px] shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C4A57B]/10 to-transparent group-hover:from-[#C4A57B]/20 transition-all duration-150"></div>
                
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-[#C4A57B]/20 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-200">
                    <ImageIcon className="w-16 h-16 text-[#8B6F47]" />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-[#6B5444] mb-4">
                    Gallery
                  </h2>
                  
                  <p className="text-lg text-[#6B5444]/80 mb-6 max-w-md">
                    Explore our collection of beautiful poster prints and see what our customers are creating
                  </p>
                  
                  <div className="flex items-center space-x-2 text-[#8B6F47] font-semibold group-hover:translate-x-2 transition-transform duration-150">
                    <span>View Gallery</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C4A57B]/10 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C4A57B]/10 rounded-tr-full"></div>
              </div>
            </Link>

            {/* Start Creating Section - More Attractive */}
            <Link href="/create">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8B6F47] to-[#6B5444] border border-[#C4A57B] hover:border-[#8B6F47] transition-all duration-150 cursor-pointer h-[400px] lg:h-[500px] shadow-2xl hover:shadow-[#8B6F47]/30">
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 group-hover:via-white/20 transition-all duration-150"></div>
                
                {/* Sparkle effect */}
                <div className="absolute top-10 right-10 opacity-50 group-hover:opacity-100 transition-opacity duration-150">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div className="absolute bottom-10 left-10 opacity-50 group-hover:opacity-100 transition-opacity duration-150">
                  <Sparkles className="w-6 h-6 text-white animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-white/20 p-6 rounded-full mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-200">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Start Creating
                  </h2>
                  
                  <p className="text-lg text-white/95 mb-6 max-w-md font-medium">
                    Upload your photos and create high-quality custom poster prints in minutes
                  </p>
                  
                  <div className="flex items-center space-x-2 text-white font-bold text-lg group-hover:translate-x-2 transition-transform duration-150 bg-white/20 px-6 py-3 rounded-full">
                    <span>Create Now</span>
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  
                  {/* Pulsing ring effect */}
                  <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-150"></div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full group-hover:scale-110 transition-transform duration-200"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-tr-full group-hover:scale-110 transition-transform duration-200"></div>
              </div>
            </Link>
          </div>

          {/* Footer text */}
          <div className="text-center mt-12">
            <a 
              href="https://instagram.com/paperpatchbd/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-base md:text-lg text-[#6B5444]/80 hover:text-[#8B6F47] transition-colors duration-200 group"
            >
              <span className="font-light">Reach us on</span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E5D5C0]/40 backdrop-blur-sm hover:bg-[#E5D5C0]/60 rounded-full text-[#6B5444] shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                <Image 
                  src="/instagram-icon.svg" 
                  alt="Instagram" 
                  width={16} 
                  height={16}
                  className="w-4 h-4"
                />
                <span className="font-medium text-sm">Instagram</span>
              </div>
              <span className="font-light">for any query</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
