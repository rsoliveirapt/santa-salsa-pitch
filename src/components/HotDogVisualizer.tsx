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
  className = ''
}) => {
  // Dimensions based on size
  const sizeMap = {
    sm: { container: 'w-[140px] h-[80px]' },
    md: { container: 'w-[260px] h-[145px]' },
    lg: { container: 'w-[340px] h-[190px]' }
  };

  const currentSize = sizeMap[size];
  const count = selectedIngredients.length;

  // Determine photo stage based on selected ingredient count
  let currentImage = '/perro-base.png';
  if (count >= 4) {
    currentImage = '/perro-contodo.png';
  } else if (count >= 1) {
    currentImage = '/perro-topped.png';
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${currentSize.container} ${className}`}>
      {/* Warm Ambient Food Backlight */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-amber-500/30 to-yellow-400/30 blur-xl rounded-2xl transform scale-95 pointer-events-none" />

      {/* Main Photorealistic Container Box */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-[#FFEB01]/60 shadow-[0_8px_16px_rgba(0,0,0,0.85)] bg-black/90 flex items-center justify-center transition-all duration-300 transform hover:scale-105">
        <img
          src={currentImage}
          alt="Perro Caliente Realista"
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
      </div>
    </div>
  );
};
