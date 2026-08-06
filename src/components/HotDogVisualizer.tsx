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
    sm: { container: 'w-[150px] h-[85px]' },
    md: { container: 'w-[280px] h-[155px]' },
    lg: { container: 'w-[360px] h-[195px]' }
  };

  const currentSize = sizeMap[size];
  const isFullConTodo = selectedIngredients.length >= 4 || (hasCheese && hasPapas && (hasGarlic || hasCorn || hasPink));

  return (
    <div className={`relative flex items-center justify-center select-none ${currentSize.container} ${className}`}>
      {/* Warm Ambient Food Photography Backlight */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-amber-500/30 to-yellow-400/30 blur-2xl rounded-full transform scale-90 pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] transition-all duration-300 transform hover:scale-105">
        {/* Base Photorealistic Hot Dog */}
        <img
          src={isFullConTodo ? '/perro-contodo.png' : '/perro-base.png'}
          alt="Perro Caliente Autêntico"
          className="w-full h-full object-contain transition-all duration-500 rounded-xl"
        />

        {/* Dynamic Realistic Ingredient Overlay Layers when building customized hot dog */}
        {!isFullConTodo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Shredded Cabbage Layer Overlay */}
            {hasCabbage && (
              <div className={`absolute inset-x-8 top-[32%] h-6 bg-gradient-to-r from-emerald-600/80 via-green-500/90 to-emerald-700/80 rounded-full blur-[1px] opacity-90 shadow-md ${animated ? 'animate-stack-layer' : ''}`} />
            )}

            {/* Queso Blanco Layer Overlay */}
            {hasCheese && (
              <div className={`absolute inset-x-6 top-[26%] h-8 bg-gradient-to-r from-slate-100 via-white to-slate-200 rounded-full opacity-95 blur-[0.5px] shadow-lg border-b border-slate-300/60 ${animated ? 'animate-stack-layer' : ''}`}>
                <div className="w-full h-full bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:6px_6px] opacity-60" />
              </div>
            )}

            {/* Papas Fosforito Stick Layer Overlay */}
            {hasPapas && (
              <div className={`absolute inset-x-5 top-[22%] h-9 flex justify-around items-center opacity-95 ${animated ? 'animate-stack-layer' : ''}`}>
                {[...Array(14)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-7 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 rounded-full shadow-md transform"
                    style={{ transform: `rotate(${i % 2 === 0 ? 25 : -25}deg)` }}
                  />
                ))}
              </div>
            )}

            {/* Garlic Sauce Drizzle */}
            {hasGarlic && (
              <svg className={`absolute inset-0 w-full h-full pointer-events-none ${animated ? 'animate-stack-layer' : ''}`} viewBox="0 0 300 160">
                <path
                  d="M 30 65 Q 60 50, 90 70 Q 120 48, 150 72 Q 180 50, 210 70 Q 240 52, 270 64"
                  stroke="#FEFCE8"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  className="filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]"
                />
              </svg>
            )}

            {/* Sweet Corn Sauce Drizzle */}
            {hasCorn && (
              <svg className={`absolute inset-0 w-full h-full pointer-events-none ${animated ? 'animate-stack-layer' : ''}`} viewBox="0 0 300 160">
                <path
                  d="M 35 60 Q 65 76, 95 54 Q 125 74, 155 52 Q 185 74, 215 56 Q 245 70, 268 62"
                  stroke="#F59E0B"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  className="filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]"
                />
              </svg>
            )}

            {/* Venezuelan Pink Sauce Drizzle */}
            {hasPink && (
              <svg className={`absolute inset-0 w-full h-full pointer-events-none ${animated ? 'animate-stack-layer' : ''}`} viewBox="0 0 300 160">
                <path
                  d="M 32 68 Q 62 46, 92 68 Q 122 46, 152 70 Q 182 46, 212 68 Q 242 48, 272 66"
                  stroke="#F43F5E"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  fill="none"
                  className="filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]"
                />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
