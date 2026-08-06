import React from 'react';
import { Disc, Sparkles } from 'lucide-react';

interface VenueHeaderDecorProps {
  subtitle?: string;
  isPitch?: boolean;
}

export const VenueHeaderDecor: React.FC<VenueHeaderDecorProps> = ({
  subtitle = 'Cria o teu Perro Con Todo 🌭🔥',
  isPitch = false
}) => {
  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#7F1D1D] via-[#991B1B] to-[#1A1A1A] border-b-4 border-amber-500 shadow-2xl pt-4 pb-5 px-4 mb-5 text-center">
      {/* String Lights Overhead */}
      <div className="absolute top-0 left-0 w-full flex justify-around px-2 pointer-events-none opacity-90 z-10">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex flex-col items-center animate-string-light" style={{ animationDelay: `${i * 0.2}s` }}>
            <div className="w-0.5 h-3 bg-zinc-800"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-300 shadow-[0_0_10px_#F59E0B] border border-amber-400"></div>
          </div>
        ))}
      </div>

      {/* Background Disco Ball Sparkle Reflection */}
      <div className="absolute right-4 top-2 opacity-25 pointer-events-none">
        <Disc className="w-16 h-16 text-cyan-300 animate-disco" />
      </div>
      <div className="absolute left-4 top-2 opacity-25 pointer-events-none">
        <Sparkles className="w-12 h-12 text-amber-300 animate-pulse" />
      </div>

      {/* Hand-Painted Surfboard Signboard */}
      <div className="relative z-20 inline-block mx-auto max-w-full">
        <div className="sign-board-white rounded-2xl px-6 py-3 shadow-[6px_6px_0px_#000000] transform -rotate-1 hover:rotate-0 transition-transform">
          <div className="text-xs font-black uppercase tracking-widest text-[#991B1B] font-mono mb-0.5">
            BROOKLYN • NEW YORK
          </div>
          <h1 className={`${isPitch ? 'text-4xl md:text-5xl' : 'text-3xl'} font-black tracking-tight text-[#171717] uppercase leading-none font-display`}>
            SANTA SALSA
          </h1>
          <div className="text-xs font-black uppercase tracking-widest text-amber-600 border-t border-zinc-900/40 pt-1 mt-1 font-mono">
            VENEZUELAN STREET FOOD
          </div>
        </div>
      </div>

      {/* Subtitle / Venue Tagline */}
      <div className="mt-3 relative z-20">
        <span className="inline-block bg-[#0F0F0F] text-amber-400 font-hand text-sm px-4 py-1.5 rounded-full border-2 border-amber-500 shadow-md">
          {subtitle}
        </span>
      </div>

      {/* Latin Folk Figurines Bar Shelf Accent */}
      <div className="w-full flex justify-center gap-4 mt-3 opacity-80 text-xs font-mono text-amber-200/80">
        <span>🌶️ STREET FOOD</span>
        <span>•</span>
        <span>🌭 PERROS CON TODO</span>
        <span>•</span>
        <span>🍹 BAR & TRUCK</span>
      </div>
    </div>
  );
};
