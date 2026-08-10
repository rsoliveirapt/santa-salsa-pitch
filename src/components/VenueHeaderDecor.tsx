import React from 'react';
import { Disc, Sparkles } from 'lucide-react';

interface VenueHeaderDecorProps {
  subtitle?: string;
  isPitch?: boolean;
  compact?: boolean;
}

export const VenueHeaderDecor: React.FC<VenueHeaderDecorProps> = ({
  subtitle = 'Cria o teu Perro Con Todo 🌭🔥',
  isPitch = false,
  compact = false
}) => {
  return (
    <div className={`w-full relative overflow-hidden bg-gradient-to-b from-[#7F1D1D] via-[#991B1B] to-[#1A1A1A] border-b-4 border-amber-500 shadow-2xl text-center ${
      compact ? 'pt-1.5 pb-1.5 px-2 mb-1.5' : 'pt-4 pb-5 px-4 mb-5'
    }`}>
      {/* String Lights Overhead */}
      <div className="absolute top-0 left-0 w-full flex justify-around px-2 pointer-events-none opacity-90 z-10">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex flex-col items-center animate-string-light" style={{ animationDelay: `${i * 0.2}s` }}>
            <div className={`bg-zinc-800 ${compact ? 'w-0.5 h-1' : 'w-0.5 h-3'}`}></div>
            <div className={`bg-amber-300 shadow-[0_0_10px_#F59E0B] border border-amber-400 ${compact ? 'w-1.5 h-1.5' : 'w-3.5 h-3.5'}`}></div>
          </div>
        ))}
      </div>

      {/* Background Disco Ball Sparkle Reflection */}
      {!compact && (
        <>
          <div className="absolute right-4 top-2 opacity-25 pointer-events-none">
            <Disc className="w-16 h-16 text-cyan-300 animate-disco" />
          </div>
          <div className="absolute left-4 top-2 opacity-25 pointer-events-none">
            <Sparkles className="w-12 h-12 text-amber-300 animate-pulse" />
          </div>
        </>
      )}

      {/* Hand-Painted Surfboard Signboard */}
      <div className="relative z-20 inline-block mx-auto max-w-full">
        <div className={`sign-board-white shadow-[3px_3px_0px_#000000] transform -rotate-1 hover:rotate-0 transition-transform ${
          compact ? 'px-3 py-0.5' : 'px-6 py-3'
        }`}>
          <div className={`font-black uppercase tracking-widest text-[#991B1B] font-mono ${compact ? 'text-[8px] mb-0' : 'text-xs mb-0.5'}`}>
            BROOKLYN • NEW YORK
          </div>
          <h1 className={`${isPitch ? 'text-4xl md:text-5xl' : compact ? 'text-xl' : 'text-3xl'} font-black tracking-tight text-[#171717] uppercase leading-none font-display`}>
            SANTA SALSA
          </h1>
          {!compact && (
            <div className="text-xs font-black uppercase tracking-widest text-amber-600 border-t border-zinc-900/40 pt-1 mt-1 font-mono">
              VENEZUELAN STREET FOOD
            </div>
          )}
        </div>
      </div>

      {/* Subtitle / Venue Tagline */}
      <div className={`${compact ? 'mt-0.5' : 'mt-3'} relative z-20`}>
        <span className={`inline-block bg-[#0F0F0F] text-amber-400 font-hand border-2 border-amber-500 shadow-md ${
          compact ? 'text-[11px] px-2 py-0.5' : 'text-sm px-4 py-1.5'
        }`}>
          {subtitle}
        </span>
      </div>

      {/* Latin Folk Figurines Bar Shelf Accent */}
      {!compact && (
        <div className="w-full flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 mt-3 text-[10px] sm:text-xs font-mono font-bold text-[#FFEB01] tracking-wider px-2 select-none">
          <span className="whitespace-nowrap">🌶️ STREET FOOD</span>
          <span className="text-amber-500 font-black">•</span>
          <span className="whitespace-nowrap">🌭 PERROS CON TODO</span>
          <span className="text-amber-500 font-black">•</span>
          <span className="whitespace-nowrap">🍹 BAR & TRUCK</span>
        </div>
      )}
    </div>
  );
};
