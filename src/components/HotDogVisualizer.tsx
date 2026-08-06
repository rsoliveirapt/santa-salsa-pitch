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
    sm: { width: 150, height: 80, viewBox: '0 0 320 170' },
    md: { width: 290, height: 155, viewBox: '0 0 320 170' },
    lg: { width: 380, height: 200, viewBox: '0 0 320 170' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Dynamic Background Flame Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-[#FFEB01]/20 to-amber-500/30 blur-2xl rounded-full transform scale-95 pointer-events-none" />

      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox={currentSize.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.8)] transition-transform duration-300 transform hover:scale-105"
      >
        <defs>
          {/* Bun Main Gradient (Golden Toasted Brioche) */}
          <linearGradient id="bunMainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5C07B" />
            <stop offset="35%" stopColor="#E09441" />
            <stop offset="75%" stopColor="#B86518" />
            <stop offset="100%" stopColor="#7A3906" />
          </linearGradient>

          {/* Bun Highlight Gradient */}
          <linearGradient id="bunHighlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE5B4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F5C07B" stopOpacity="0" />
          </linearGradient>

          {/* Sausage Main Gradient (Juicy Venezuelan Salchicha) */}
          <linearGradient id="sausageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C53A2A" />
            <stop offset="40%" stopColor="#A52618" />
            <stop offset="85%" stopColor="#75150B" />
            <stop offset="100%" stopColor="#4A0B05" />
          </linearGradient>

          {/* Sausage Glossy Specular Highlight */}
          <linearGradient id="sausageShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Papas Fosforito Golden Gradient */}
          <linearGradient id="papasStickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="60%" stopColor="#FBC02D" />
            <stop offset="100%" stopColor="#F57F17" />
          </linearGradient>

          {/* Cabbage Gradient */}
          <linearGradient id="cabbageGreenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2E7D32" />
            <stop offset="50%" stopColor="#4CAF50" />
            <stop offset="100%" stopColor="#1B5E20" />
          </linearGradient>

          {/* Soft Layer Shadow Filter */}
          <filter id="ingredientShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.6" />
          </filter>

          {/* Sauce Gloss Filter */}
          <filter id="sauceGloss" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* 0. CAST SHADOW UNDERNEATH HOT DOG */}
        <ellipse cx="160" cy="148" rx="130" ry="14" fill="#000000" opacity="0.6" filter="blur(4px)" />

        {/* 1. BACK BUN (Cradles the sausage from behind) */}
        <path
          d="M 25 90 C 25 55, 60 50, 160 50 C 260 50, 295 55, 295 90 C 295 125, 260 138, 160 138 C 60 138, 25 125, 25 90 Z"
          fill="url(#bunMainGrad)"
          stroke="#4D2202"
          strokeWidth="2.5"
        />

        {/* Inner shadow in bun cavity */}
        <path
          d="M 35 88 C 35 68, 70 62, 160 62 C 250 62, 285 68, 285 88 C 285 105, 250 115, 160 115 C 70 115, 35 105, 35 88 Z"
          fill="#4A1E03"
          opacity="0.5"
        />

        {/* 2. JUICY SALCHICHA (SAUSAGE) */}
        <g filter="url(#ingredientShadow)">
          {/* Sausage Base Body (Extends slightly at ends) */}
          <path
            d="M 15 82 C 15 66, 45 64, 160 64 C 275 64, 305 66, 305 82 C 305 98, 275 104, 160 104 C 45 104, 15 98, 15 82 Z"
            fill="url(#sausageGrad)"
            stroke="#360602"
            strokeWidth="2.5"
          />

          {/* Sausage Top Glossy Highlight */}
          <path
            d="M 30 74 C 40 70, 70 68, 160 68 C 250 68, 280 70, 290 74 C 280 78, 250 78, 160 78 C 70 78, 40 78, 30 74 Z"
            fill="url(#sausageShine)"
          />

          {/* Charcoal Grill Marks */}
          <g stroke="#300502" strokeWidth="3" strokeLinecap="round" opacity="0.75">
            <line x1="60" y1="70" x2="78" y2="94" />
            <line x1="105" y1="68" x2="123" y2="96" />
            <line x1="150" y1="67" x2="168" y2="97" />
            <line x1="195" y1="68" x2="213" y2="96" />
            <line x1="240" y1="70" x2="258" y2="94" />
          </g>
        </g>

        {/* 3. REPOLHO PICADO (CABBAGE LAYER) */}
        {hasCabbage && (
          <g filter="url(#ingredientShadow)" className={animated ? 'animate-stack-layer' : ''}>
            {/* Shredded Cabbage Waves */}
            <path
              d="M 32 75 Q 45 62, 65 72 Q 85 82, 105 68 Q 125 58, 150 70 Q 175 82, 200 66 Q 225 56, 250 72 Q 270 80, 288 74"
              stroke="url(#cabbageGreenGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 40 82 Q 55 70, 80 78 Q 100 86, 125 74 Q 150 64, 175 76 Q 200 86, 230 72 Q 255 64, 280 78"
              stroke="#4CAF50"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 50 70 Q 70 60, 95 68 Q 120 76, 145 64 Q 170 56, 195 68 Q 220 76, 245 66 Q 260 60, 275 70"
              stroke="#81C784"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* 4. QUEIJO BRANCO RALADO (QUESO BLANCO) */}
        {hasCheese && (
          <g filter="url(#ingredientShadow)" className={animated ? 'animate-stack-layer' : ''}>
            {/* Fluffy Snow-like Cheese Mound Bed */}
            <path
              d="M 32 68 Q 160 44, 288 68 C 280 84, 240 92, 160 92 C 80 92, 40 84, 32 68 Z"
              fill="#F8FAFC"
              opacity="0.95"
            />

            {/* Individual Cheese Strands & Shavings */}
            <g stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round">
              <line x1="45" y1="62" x2="55" y2="74" />
              <line x1="70" y1="56" x2="82" y2="70" />
              <line x1="95" y1="52" x2="108" y2="66" />
              <line x1="120" y1="50" x2="132" y2="64" />
              <line x1="145" y1="48" x2="158" y2="62" />
              <line x1="170" y1="48" x2="182" y2="62" />
              <line x1="195" y1="50" x2="208" y2="64" />
              <line x1="220" y1="54" x2="232" y2="68" />
              <line x1="245" y1="58" x2="258" y2="72" />
              <line x1="268" y1="64" x2="278" y2="76" />
            </g>

            {/* Top Cheese Highlights */}
            <g stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
              <line x1="60" y1="58" x2="72" y2="68" />
              <line x1="110" y1="51" x2="122" y2="61" />
              <line x1="160" y1="49" x2="172" y2="59" />
              <line x1="210" y1="52" x2="222" y2="62" />
              <line x1="255" y1="60" x2="265" y2="70" />
            </g>
          </g>
        )}

        {/* 5. BATATA PALHA (PAPAS FOSFORITO / CRISPY POTATO STICKS) */}
        {hasPapas && (
          <g filter="url(#ingredientShadow)" className={animated ? 'animate-stack-layer' : ''}>
            {/* Layer 1: Golden Potato Sticks Criss-Cross */}
            <g stroke="url(#papasStickGrad)" strokeWidth="3.5" strokeLinecap="round">
              <line x1="38" y1="72" x2="62" y2="50" />
              <line x1="55" y1="76" x2="80" y2="48" />
              <line x1="72" y1="48" x2="94" y2="74" />
              <line x1="90" y1="74" x2="116" y2="46" />
              <line x1="110" y1="46" x2="132" y2="72" />
              <line x1="128" y1="72" x2="154" y2="44" />
              <line x1="148" y1="44" x2="172" y2="72" />
              <line x1="168" y1="72" x2="194" y2="46" />
              <line x1="188" y1="46" x2="210" y2="74" />
              <line x1="206" y1="74" x2="232" y2="48" />
              <line x1="226" y1="50" x2="248" y2="76" />
              <line x1="244" y1="76" x2="268" y2="54" />
              <line x1="262" y1="56" x2="282" y2="74" />
            </g>

            {/* Layer 2: Extra Top Crunchy Potato Sticks */}
            <g stroke="#FFEE58" strokeWidth="2.5" strokeLinecap="round">
              <line x1="45" y1="58" x2="70" y2="68" />
              <line x1="85" y1="52" x2="110" y2="64" />
              <line x1="125" y1="48" x2="150" y2="60" />
              <line x1="165" y1="48" x2="190" y2="60" />
              <line x1="205" y1="52" x2="230" y2="64" />
              <line x1="245" y1="58" x2="270" y2="68" />
            </g>
          </g>
        )}

        {/* 6. MOLHO DE ALHO (GARLIC SAUCE - Creamy Ivory Zigzag Drizzle) */}
        {hasGarlic && (
          <g filter="url(#sauceGloss)" className={animated ? 'animate-stack-layer' : ''}>
            {/* Outer Creamy Garlic Drizzle */}
            <path
              d="M 32 64 C 55 48, 70 76, 98 52 C 125 76, 150 48, 178 72 C 205 48, 230 74, 285 58"
              stroke="#FFFDE7"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Glossy White Specular Shine */}
            <path
              d="M 32 64 C 55 48, 70 76, 98 52 C 125 76, 150 48, 178 72 C 205 48, 230 74, 285 58"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
          </g>
        )}

        {/* 7. MOLHO DE MILHO DOCE (CORN SAUCE - Vibrant Sweet Corn Yellow) */}
        {hasCorn && (
          <g filter="url(#sauceGloss)" className={animated ? 'animate-stack-layer' : ''}>
            {/* Outer Sweet Corn Drizzle */}
            <path
              d="M 35 58 C 60 74, 82 46, 110 68 C 138 44, 162 74, 190 50 C 218 72, 240 52, 282 66"
              stroke="#FFB300"
              strokeWidth="6.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Inner Yellow Highlight */}
            <path
              d="M 35 58 C 60 74, 82 46, 110 68 C 138 44, 162 74, 190 50 C 218 72, 240 52, 282 66"
              stroke="#FFE082"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          </g>
        )}

        {/* 8. SALSA ROSADA (PINK SAUCE - Signature Pink Venezuelan Sauce) */}
        {hasPink && (
          <g filter="url(#sauceGloss)" className={animated ? 'animate-stack-layer' : ''}>
            {/* Outer Pink Sauce Drizzle */}
            <path
              d="M 30 62 Q 60 44, 92 64 Q 124 44, 158 64 Q 190 44, 222 64 Q 250 46, 288 60"
              stroke="#F43F5E"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Specular White Shine */}
            <path
              d="M 30 62 Q 60 44, 92 64 Q 124 44, 158 64 Q 190 44, 222 64 Q 250 46, 288 60"
              stroke="#FECDD3"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
          </g>
        )}

        {/* 9. FRONT BUN (Gives 3D volume framing the hot dog) */}
        <path
          d="M 20 92 C 20 78, 45 74, 160 74 C 275 74, 300 78, 300 92 C 300 128, 260 142, 160 142 C 60 142, 20 128, 20 92 Z"
          fill="url(#bunMainGrad)"
          stroke="#4D2202"
          strokeWidth="2.5"
        />

        {/* Front Bun Top Light Highlight */}
        <path
          d="M 28 86 C 28 80, 55 76, 160 76 C 265 76, 292 80, 292 86 C 292 92, 265 96, 160 96 C 55 96, 28 92, 28 86 Z"
          fill="url(#bunHighlightGrad)"
        />

        {/* SESAME SEEDS ON FRONT BRIOCHE BUN */}
        <g fill="#FFF59D" opacity="0.95" stroke="#7A3906" strokeWidth="0.5">
          <ellipse cx="65" cy="112" rx="3.5" ry="1.8" transform="rotate(-15 65 112)" />
          <ellipse cx="105" cy="122" rx="3.5" ry="1.8" transform="rotate(12 105 122)" />
          <ellipse cx="150" cy="126" rx="3.5" ry="1.8" transform="rotate(-5 150 126)" />
          <ellipse cx="195" cy="122" rx="3.5" ry="1.8" transform="rotate(15 195 122)" />
          <ellipse cx="235" cy="114" rx="3.5" ry="1.8" transform="rotate(-10 235 114)" />
          <ellipse cx="270" cy="102" rx="3" ry="1.5" transform="rotate(20 270 102)" />
        </g>
      </svg>
    </div>
  );
};
