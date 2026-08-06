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
    sm: { width: 155, height: 85, viewBox: '0 0 320 170' },
    md: { width: 300, height: 160, viewBox: '0 0 320 170' },
    lg: { width: 380, height: 200, viewBox: '0 0 320 170' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Warm Street Food Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-amber-500/30 to-yellow-400/30 blur-2xl rounded-full transform scale-95 pointer-events-none" />

      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox={currentSize.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transition-transform duration-300 transform hover:scale-105"
      >
        <defs>
          {/* 3D Toasted Brioche Bun Gradients */}
          <linearGradient id="bunOuterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5C07B" />
            <stop offset="25%" stopColor="#E69E4A" />
            <stop offset="70%" stopColor="#C4731E" />
            <stop offset="100%" stopColor="#783B08" />
          </linearGradient>

          <linearGradient id="bunInnerShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3D1D04" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#6E3406" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F5C07B" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="bunToastedGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8560B" />
            <stop offset="50%" stopColor="#F7C88B" />
            <stop offset="100%" stopColor="#A34907" />
          </linearGradient>

          {/* Juicy Grilled Sausage Gradient & Specular Shine */}
          <linearGradient id="sausage3DGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E64A38" />
            <stop offset="20%" stopColor="#C42F1F" />
            <stop offset="65%" stopColor="#8A1A0F" />
            <stop offset="100%" stopColor="#4A0B05" />
          </linearGradient>

          <linearGradient id="sausageHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Cabbage Gradients */}
          <linearGradient id="cabbageFresh" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="50%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="cabbageLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>

          {/* Papas Fosforito Golden Crispy Stick Gradient */}
          <linearGradient id="papasStickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* 3D Liquid Gloss Filters for Sauces */}
          <filter id="liquidGloss" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.65" />
          </filter>

          {/* Cheese Drop Shadow */}
          <filter id="cheeseShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#450A0A" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. BOTTOM BACK BUN (Deep 3D Shadow Container) */}
        <path
          d="M 22 95 C 22 55, 45 48, 160 48 C 275 48, 298 55, 298 95 C 298 135, 268 148, 160 148 C 52 148, 22 135, 22 95 Z"
          fill="url(#bunOuterGrad)"
          stroke="#4D2303"
          strokeWidth="2.5"
        />

        {/* Bun Toasted Edge Shadow Inside */}
        <path
          d="M 32 92 C 32 62, 55 56, 160 56 C 265 56, 288 62, 288 92 C 288 122, 260 138, 160 138 C 60 138, 32 122, 32 92 Z"
          fill="url(#bunInnerShadow)"
        />

        {/* 2. REALISTIC JUICY SALCHICHA (SAUSAGE) WITH SPECULAR SHINE */}
        <g>
          {/* Sausage Base */}
          <path
            d="M 12 85 C 12 68, 32 64, 160 64 C 288 64, 308 68, 308 85 C 308 102, 288 108, 160 108 C 32 108, 12 102, 12 85 Z"
            fill="url(#sausage3DGrad)"
            stroke="#360602"
            strokeWidth="2"
          />

          {/* Sausage Top Gloss Specular Highlight Line */}
          <path
            d="M 28 74 C 40 70, 70 68, 160 68 C 250 68, 280 70, 292 74 C 280 77, 240 78, 160 78 C 80 78, 40 77, 28 74 Z"
            fill="url(#sausageHighlight)"
            opacity="0.8"
          />

          {/* Realistic Charred Grill Marks */}
          <g opacity="0.75" stroke="#260301" strokeWidth="3" strokeLinecap="round">
            <line x1="60" y1="71" x2="76" y2="99" />
            <line x1="110" y1="68" x2="126" y2="101" />
            <line x1="160" y1="67" x2="176" y2="102" />
            <line x1="210" y1="68" x2="226" y2="101" />
            <line x1="260" y1="71" x2="276" y2="99" />
          </g>
        </g>

        {/* 3. REPOLHO PICADO (FRESH SHREDDED CABBAGE) */}
        {hasCabbage && (
          <g className={animated ? 'animate-stack-layer' : ''}>
            {/* Base Cabbage Layer Spill */}
            <path
              d="M 35 78 Q 50 64, 75 75 Q 100 86, 125 70 Q 150 62, 175 76 Q 200 88, 225 72 Q 250 64, 285 78 Q 270 94, 230 88 Q 180 94, 140 88 Q 80 94, 35 78 Z"
              fill="url(#cabbageFresh)"
              opacity="0.9"
            />
            {/* Shredded Cabbage Ribbons & Strands */}
            <path d="M 38 76 Q 52 64, 70 78 Q 88 90, 110 74 Q 130 62, 155 78 Q 180 90, 205 72 Q 230 62, 255 78 Q 272 68, 282 80" stroke="#86EFAC" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 45 82 Q 62 70, 85 84 Q 110 92, 135 76 Q 160 66, 185 82 Q 210 92, 235 76 Q 255 84, 275 80" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 55 72 Q 75 62, 100 76 Q 125 84, 150 68 Q 175 60, 200 76 Q 225 84, 250 68" stroke="#DCFCE7" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* 4. QUEIJO BRANCO RALADO (FLUFFY SHREDDED QUESO BLANCO MOUNTAIN) */}
        {hasCheese && (
          <g className={animated ? 'animate-stack-layer' : ''} filter="url(#cheeseShadow)">
            {/* Fluffy Snow Mountain Cheese Base */}
            <path
              d="M 32 72 C 32 50, 65 42, 160 42 C 255 42, 288 50, 288 72 C 288 90, 255 96, 160 96 C 65 96, 32 90, 32 72 Z"
              fill="#F8FAFC"
            />

            {/* Individual Shredded Cheese Strands & Texture */}
            <g stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round">
              <line x1="45" y1="65" x2="58" y2="78" />
              <line x1="70" y1="55" x2="85" y2="72" />
              <line x1="95" y1="50" x2="110" y2="68" />
              <line x1="120" y1="46" x2="135" y2="65" />
              <line x1="145" y1="44" x2="160" y2="64" />
              <line x1="170" y1="44" x2="185" y2="65" />
              <line x1="195" y1="47" x2="210" y2="67" />
              <line x1="220" y1="52" x2="235" y2="70" />
              <line x1="245" y1="58" x2="260" y2="75" />
              <line x1="268" y1="66" x2="278" y2="78" />

              {/* Cross threads */}
              <line x1="60" y1="58" x2="48" y2="74" stroke="#CBD5E1" />
              <line x1="105" y1="48" x2="92" y2="66" stroke="#CBD5E1" />
              <line x1="155" y1="43" x2="142" y2="63" stroke="#FFFFFF" />
              <line x1="205" y1="46" x2="192" y2="65" stroke="#CBD5E1" />
              <line x1="250" y1="54" x2="238" y2="72" stroke="#FFFFFF" />
            </g>

            {/* Cheese Fluff Dots */}
            <circle cx="80" cy="52" r="3" fill="#FFFFFF" />
            <circle cx="130" cy="45" r="3.5" fill="#FFFFFF" />
            <circle cx="160" cy="43" r="4" fill="#FFFFFF" />
            <circle cx="190" cy="45" r="3.5" fill="#FFFFFF" />
            <circle cx="240" cy="52" r="3" fill="#FFFFFF" />
          </g>
        )}

        {/* 5. BATATA PALHA (PAPAS FOSFORITO - CRISPY MATCHSTICK POTATOES) */}
        {hasPapas && (
          <g className={animated ? 'animate-stack-layer' : ''} filter="url(#liquidGloss)">
            {/* Criss-crossed Golden Potato Sticks with 3D Depth */}
            <g stroke="url(#papasStickGrad)" strokeWidth="4" strokeLinecap="round">
              <line x1="38" y1="78" x2="62" y2="48" />
              <line x1="55" y1="84" x2="78" y2="46" />
              <line x1="72" y1="45" x2="92" y2="82" stroke="#FBBF24" />
              <line x1="90" y1="82" x2="114" y2="43" />
              <line x1="108" y1="42" x2="132" y2="80" stroke="#D97706" />
              <line x1="128" y1="80" x2="152" y2="40" />
              <line x1="146" y1="40" x2="170" y2="79" stroke="#FBBF24" />
              <line x1="166" y1="79" x2="190" y2="41" />
              <line x1="184" y1="42" x2="208" y2="81" stroke="#D97706" />
              <line x1="204" y1="81" x2="228" y2="44" />
              <line x1="222" y1="45" x2="246" y2="83" stroke="#FBBF24" />
              <line x1="242" y1="83" x2="266" y2="49" />
              <line x1="260" y1="50" x2="282" y2="82" />

              {/* Top layer scattered sticks */}
              <line x1="48" y1="52" x2="72" y2="76" stroke="#FEF08A" strokeWidth="3" />
              <line x1="98" y1="46" x2="122" y2="72" stroke="#FEF08A" strokeWidth="3" />
              <line x1="148" y1="43" x2="172" y2="69" stroke="#FEF08A" strokeWidth="3" />
              <line x1="198" y1="45" x2="222" y2="71" stroke="#FEF08A" strokeWidth="3" />
              <line x1="238" y1="50" x2="262" y2="76" stroke="#FEF08A" strokeWidth="3" />
            </g>
          </g>
        )}

        {/* 6. MOLHO DE ALHO (GARLIC SAUCE - GLOSSY CREAMY SQUEEZE) */}
        {hasGarlic && (
          <g className={animated ? 'animate-stack-layer' : ''} filter="url(#liquidGloss)">
            {/* Main Creamy Garlic Squeeze */}
            <path
              d="M 32 70 C 58 52, 75 78, 102 54 C 128 76, 155 52, 182 74 C 208 54, 235 74, 288 60"
              stroke="#FEFCE8"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Garlic Sauce Specular Gloss Highlight */}
            <path
              d="M 32 69 C 58 51, 75 77, 102 53 C 128 75, 155 51, 182 73 C 208 53, 235 73, 288 59"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
          </g>
        )}

        {/* 7. MOLHO DE MILHO DOCE (CORN SAUCE - GLOSSY GOLDEN SQUEEZE) */}
        {hasCorn && (
          <g className={animated ? 'animate-stack-layer' : ''} filter="url(#liquidGloss)">
            {/* Golden Sweet Corn Squeeze */}
            <path
              d="M 35 62 C 62 80, 88 54, 115 74 C 140 50, 168 76, 192 53 C 218 74, 245 56, 282 68"
              stroke="#F59E0B"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Corn Sauce Specular Highlight */}
            <path
              d="M 35 61 C 62 79, 88 53, 115 73 C 140 49, 168 75, 192 52 C 218 73, 245 55, 282 67"
              stroke="#FEF08A"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          </g>
        )}

        {/* 8. SALSA ROSADA (PINK SAUCE - GLOSSY VENEZUELAN PINK SQUEEZE) */}
        {hasPink && (
          <g className={animated ? 'animate-stack-layer' : ''} filter="url(#liquidGloss)">
            {/* Venezuelan Pink Sauce Squeeze */}
            <path
              d="M 30 66 Q 60 48, 92 70 Q 125 48, 158 72 Q 190 48, 222 70 Q 252 50, 288 64"
              stroke="#F43F5E"
              strokeWidth="7.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Pink Sauce Specular Highlight */}
            <path
              d="M 30 65 Q 60 47, 92 69 Q 125 47, 158 71 Q 190 47, 222 69 Q 252 49, 288 63"
              stroke="#FECDD3"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
          </g>
        )}

        {/* 9. FRONT BUN (3D TOP LIP OF BRIOCHE BUN WITH TOASTED GLOW) */}
        <path
          d="M 22 92 C 22 84, 45 80, 160 80 C 275 80, 298 84, 298 92 C 298 128, 268 144, 160 144 C 52 144, 22 128, 22 92 Z"
          fill="url(#bunOuterGrad)"
          stroke="#4D2303"
          strokeWidth="2"
        />

        {/* Front Bun Top Specular Crust Highlight */}
        <path
          d="M 35 88 C 45 84, 80 82, 160 82 C 240 82, 275 84, 285 88 C 272 92, 230 94, 160 94 C 90 94, 48 92, 35 88 Z"
          fill="#FFE4C4"
          opacity="0.35"
        />

        {/* REALISTIC SESAME SEEDS ON FRONT BUN */}
        <g opacity="0.9">
          <ellipse cx="65" cy="112" rx="3" ry="1.5" fill="#FEF08A" stroke="#783B08" strokeWidth="0.5" transform="rotate(-15 65 112)" />
          <ellipse cx="105" cy="120" rx="3" ry="1.5" fill="#FEF08A" stroke="#783B08" strokeWidth="0.5" transform="rotate(12 105 120)" />
          <ellipse cx="150" cy="124" rx="3" ry="1.5" fill="#FEF08A" stroke="#783B08" strokeWidth="0.5" transform="rotate(-6 150 124)" />
          <ellipse cx="195" cy="120" rx="3" ry="1.5" fill="#FEF08A" stroke="#783B08" strokeWidth="0.5" transform="rotate(18 195 120)" />
          <ellipse cx="235" cy="112" rx="3" ry="1.5" fill="#FEF08A" stroke="#783B08" strokeWidth="0.5" transform="rotate(-12 235 112)" />
          <ellipse cx="265" cy="104" rx="3" ry="1.5" fill="#FEF08A" stroke="#783B08" strokeWidth="0.5" transform="rotate(8 265 104)" />
          <ellipse cx="42" cy="104" rx="3" ry="1.5" fill="#FEF08A" stroke="#783B08" strokeWidth="0.5" transform="rotate(-10 42 104)" />
        </g>
      </svg>
    </div>
  );
};
