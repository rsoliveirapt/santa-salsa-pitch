import React from 'react';

interface HotDogVisualizerProps {
  selectedIngredients: string[];
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const HotDogVisualizer: React.FC<HotDogVisualizerProps> = ({
  selectedIngredients,
  size = 'md',
  animated = true,
  className = ''
}) => {
  const hasCabbage = selectedIngredients.includes('cabbage');
  const hasCheese = selectedIngredients.includes('queso_blanco');
  const hasPapas = selectedIngredients.includes('papas_fosforito');
  const hasGarlic = selectedIngredients.includes('garlic_sauce');
  const hasCorn = selectedIngredients.includes('corn_sauce');
  const hasPink = selectedIngredients.includes('pink_sauce');

  // Dimensions based on size
  const sizeMap = {
    sm: { width: 140, height: 75, viewBox: '0 0 300 160' },
    md: { width: 280, height: 150, viewBox: '0 0 300 160' },
    lg: { width: 360, height: 190, viewBox: '0 0 300 160' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-amber-500/20 to-yellow-500/20 blur-xl rounded-full transform scale-90 pointer-events-none" />

      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox={currentSize.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 filter drop-shadow-2xl transition-transform duration-300 transform hover:scale-105"
      >
        <defs>
          {/* Bun Gradients */}
          <linearGradient id="bunBottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E29D52" />
            <stop offset="60%" stopColor="#C4782A" />
            <stop offset="100%" stopColor="#8F4B0E" />
          </linearGradient>
          <linearGradient id="bunTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5B974" />
            <stop offset="70%" stopColor="#D98A36" />
            <stop offset="100%" stopColor="#A85C15" />
          </linearGradient>

          {/* Sausage Gradient */}
          <linearGradient id="sausageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B93427" />
            <stop offset="40%" stopColor="#8E1F15" />
            <stop offset="100%" stopColor="#5E1109" />
          </linearGradient>

          {/* Sauce Filters */}
          <filter id="sauceShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.5" />
          </filter>

          {/* Cabbage Gradient */}
          <linearGradient id="cabbageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38A169" />
            <stop offset="50%" stopColor="#48BB78" />
            <stop offset="100%" stopColor="#2F855A" />
          </linearGradient>

          {/* Papas Fosforito Stick Gradient */}
          <linearGradient id="papasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* 1. BOTTOM BUN */}
        <path
          d="M 30 95 C 30 65, 50 60, 150 60 C 250 60, 270 65, 270 95 C 270 125, 240 135, 150 135 C 60 135, 30 125, 30 95 Z"
          fill="url(#bunBottomGrad)"
          stroke="#683407"
          strokeWidth="2"
        />

        {/* 2. JUICY SALCHICHA (SAUSAGE) */}
        <path
          d="M 20 85 C 20 72, 40 70, 150 70 C 260 70, 280 72, 280 85 C 280 98, 260 102, 150 102 C 40 102, 20 98, 20 85 Z"
          fill="url(#sausageGrad)"
          stroke="#400A04"
          strokeWidth="2"
        />
        {/* Sausage Grill Marks */}
        <line x1="70" y1="74" x2="85" y2="95" stroke="#400A04" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
        <line x1="120" y1="73" x2="135" y2="96" stroke="#400A04" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
        <line x1="170" y1="73" x2="185" y2="96" stroke="#400A04" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
        <line x1="220" y1="74" x2="235" y2="95" stroke="#400A04" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />

        {/* 3. REPOLHO PICADO (CABBAGE) */}
        {hasCabbage && (
          <g className={animated ? 'animate-stack-layer' : ''}>
            {/* Cabbage shredded strips */}
            <path d="M 40 76 Q 50 68, 65 74 Q 80 82, 95 72 Q 110 65, 125 74 Q 140 82, 160 70 Q 180 64, 200 74 Q 220 82, 240 70 Q 250 66, 260 76" stroke="#48BB78" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 45 80 Q 60 72, 75 78 Q 90 85, 115 76 Q 130 70, 150 78 Q 170 85, 195 75 Q 210 70, 230 78 Q 245 84, 255 78" stroke="#38A169" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 55 72 Q 70 66, 85 70 Q 105 76, 135 68 Q 165 62, 185 72 Q 205 78, 225 68 Q 235 64, 248 72" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* 4. QUEIJO BRANCO RALADO (QUESO BLANCO) */}
        {hasCheese && (
          <g className={animated ? 'animate-stack-layer' : ''}>
            {/* Fluffy white cheese sprinkles */}
            <path
              d="M 38 70 Q 150 50, 262 70 Q 255 85, 150 88 Q 45 85, 38 70 Z"
              fill="#F8FAFC"
              opacity="0.9"
            />
            {/* Cheese Texture dots & threads */}
            <circle cx="50" cy="68" r="2.5" fill="#E2E8F0" />
            <circle cx="75" cy="64" r="3" fill="#FFFFFF" />
            <circle cx="100" cy="62" r="2.5" fill="#CBD5E1" />
            <circle cx="125" cy="60" r="3" fill="#FFFFFF" />
            <circle cx="150" cy="59" r="3.5" fill="#F8FAFC" />
            <circle cx="175" cy="60" r="3" fill="#FFFFFF" />
            <circle cx="200" cy="63" r="2.5" fill="#E2E8F0" />
            <circle cx="225" cy="66" r="3" fill="#FFFFFF" />
            <circle cx="250" cy="70" r="2.5" fill="#CBD5E1" />
            <line x1="60" y1="62" x2="68" y2="72" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="110" y1="58" x2="118" y2="68" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="160" y1="57" x2="168" y2="67" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="210" y1="61" x2="218" y2="71" stroke="#E2E8F0" strokeWidth="2" />
          </g>
        )}

        {/* 5. BATATA PALHA (PAPAS FOSFORITO) */}
        {hasPapas && (
          <g className={animated ? 'animate-stack-layer' : ''}>
            {/* Criss-crossed golden potato sticks */}
            <line x1="45" y1="75" x2="65" y2="55" stroke="url(#papasGrad)" strokeWidth="3" strokeLinecap="round" />
            <line x1="60" y1="78" x2="80" y2="54" stroke="url(#papasGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="75" y1="53" x2="90" y2="76" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
            <line x1="95" y1="75" x2="115" y2="52" stroke="url(#papasGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="110" y1="51" x2="130" y2="74" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <line x1="130" y1="73" x2="150" y2="50" stroke="url(#papasGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="145" y1="50" x2="165" y2="73" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
            <line x1="165" y1="74" x2="185" y2="51" stroke="url(#papasGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="180" y1="52" x2="200" y2="75" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <line x1="200" y1="75" x2="220" y2="54" stroke="url(#papasGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="215" y1="55" x2="235" y2="77" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
            <line x1="235" y1="76" x2="255" y2="58" stroke="url(#papasGrad)" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* 6. MOLHO DE ALHO (GARLIC SAUCE) */}
        {hasGarlic && (
          <path
            d="M 35 68 C 60 55, 75 75, 100 58 C 125 75, 150 55, 175 72 C 200 55, 225 72, 265 62"
            stroke="#FEF9C3"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            filter="url(#sauceShadow)"
            className={animated ? 'animate-stack-layer' : ''}
          />
        )}

        {/* 7. MOLHO DE MILHO DOCE (CORN SAUCE) */}
        {hasCorn && (
          <path
            d="M 40 62 C 65 74, 85 54, 110 70 C 135 52, 160 74, 185 56 C 210 72, 235 58, 260 68"
            stroke="#F59E0B"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            filter="url(#sauceShadow)"
            className={animated ? 'animate-stack-layer' : ''}
          />
        )}

        {/* 8. SALSA ROSADA (PINK SAUCE) */}
        {hasPink && (
          <path
            d="M 38 65 Q 65 52, 90 68 Q 120 50, 150 68 Q 180 50, 210 68 Q 235 52, 262 64"
            stroke="#EC4899"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
            filter="url(#sauceShadow)"
            className={animated ? 'animate-stack-layer' : ''}
          />
        )}

        {/* TOP BUN HIGHLIGHT SHADOW (Gives 3D feel to bun) */}
        <path
          d="M 28 85 C 28 80, 50 78, 150 78 C 250 78, 272 80, 272 85 C 272 90, 250 92, 150 92 C 50 92, 28 90, 28 85 Z"
          fill="none"
          stroke="#F5B974"
          strokeWidth="1.5"
          opacity="0.3"
        />

        {/* SESAME SEEDS ON BUN */}
        <g opacity="0.8">
          <ellipse cx="65" cy="115" rx="2.5" ry="1.2" fill="#FDE68A" transform="rotate(-15 65 115)" />
          <ellipse cx="105" cy="122" rx="2.5" ry="1.2" fill="#FDE68A" transform="rotate(10 105 122)" />
          <ellipse cx="150" cy="125" rx="2.5" ry="1.2" fill="#FDE68A" transform="rotate(-5 150 125)" />
          <ellipse cx="195" cy="122" rx="2.5" ry="1.2" fill="#FDE68A" transform="rotate(15 195 122)" />
          <ellipse cx="235" cy="115" rx="2.5" ry="1.2" fill="#FDE68A" transform="rotate(-10 235 115)" />
        </g>
      </svg>
    </div>
  );
};
