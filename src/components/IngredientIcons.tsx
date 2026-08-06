import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

export const IngredientIcon: React.FC<IconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    // 1. REPOLHO PICADO (Chopped Cabbage Leaf & Shreds)
    case 'cabbage':
    case 'Cabbage':
    case 'Salad':
    case 'Leaf':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Cabbage Leaf Outer */}
          <path d="M12 2C6.5 2 2 6.5 2 12c0 4.5 3 8.3 7 9.5 1-.5 2-1.5 3-1.5s2 1 3 1.5c4-1.2 7-5 7-9.5 0-5.5-4.5-10-10-10Z" />
          {/* Leaf Veins */}
          <path d="M12 7v10" />
          <path d="M12 10c-2.5-1.5-4-1-5 0" />
          <path d="M12 14c2.5-1.5 4-1 5 0" />
          <path d="M12 12c2.5-1 4-.5 5 1" />
        </svg>
      );

    // 2. QUEIJO BRANCO RALADO (Queso Blanco Block & Grated Threads)
    case 'queso_blanco':
    case 'Cheese':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Cheese Wedge */}
          <path d="M3 11 19 3v13L3 20V11Z" />
          {/* Top Plane */}
          <path d="M3 11h16" />
          {/* Grated Cheese Dots & Threads */}
          <circle cx="8" cy="15" r="1" fill="currentColor" />
          <circle cx="13" cy="14" r="1" fill="currentColor" />
          <circle cx="11" cy="17" r="1" fill="currentColor" />
          <path d="M16 16v3" />
          <path d="M19 14v4" />
        </svg>
      );

    // 3. BATATA PALHA (Papas Fosforito / Crispy Potato Sticks)
    case 'papas_fosforito':
    case 'Zap':
    case 'Papas':
    case 'Fries':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Box / Scoop */}
          <path d="M5 11l2 10h10l2-10H5Z" />
          {/* Potato Matchstick Lines (Batata Palha) */}
          <line x1="7" y1="3" x2="7" y2="11" />
          <line x1="10" y1="2" x2="10" y2="11" />
          <line x1="13" y1="4" x2="13" y2="11" />
          <line x1="16" y1="2" x2="16" y2="11" />
          <line x1="19" y1="5" x2="19" y2="11" />
        </svg>
      );

    // 4. MOLHO DE ALHO (Garlic Clove & Creamy Sauce Drizzle)
    case 'garlic_sauce':
    case 'Garlic':
    case 'Sparkles':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Garlic Clove Head */}
          <path d="M12 3c-1.5 2-4 4.5-4 8 0 4 3 6 4 6s4-2 4-6c0-3.5-2.5-6-4-8Z" />
          {/* Garlic Base & Root Line */}
          <path d="M10 17c0 2 1 3 2 3s2-1 2-3" />
          {/* Side Clove Petals */}
          <path d="M8 11c-2 1-3 3-3 5 0 2.5 2 3.5 3 4" />
          <path d="M16 11c2 1 3 3 3 5 0 2.5-2 3.5-3 4" />
        </svg>
      );

    // 5. MOLHO DE MILHO DOCE (Sweet Corn Cob & Kernels)
    case 'corn_sauce':
    case 'Corn':
    case 'Wheat':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Corn Cob Body */}
          <path d="M12 2C9 2 7 5 7 9v6c0 4 2 7 5 7s5-3 5-7V9c0-4-2-7-5-7Z" />
          {/* Corn Husk Leaf Left */}
          <path d="M5 21c3-3 4-7 4-11" />
          {/* Corn Husk Leaf Right */}
          <path d="M19 21c-3-3-4-7-4-11" />
          {/* Corn Kernels Grid */}
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="8.5" y1="12" x2="15.5" y2="12" />
          <line x1="9" y1="16" x2="15" y2="16" />
        </svg>
      );

    // 6. SALSA ROSADA (Pink Sauce Squeeze Bottle Drizzle)
    case 'pink_sauce':
    case 'PinkSauce':
    case 'HeartHandshake':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Sauce Bottle Nozzle */}
          <path d="M12 2v3" />
          {/* Bottle Cap */}
          <path d="M9 5h6v3H9Z" />
          {/* Squeeze Bottle Body */}
          <path d="M7 8h10a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1Z" />
          {/* Sauce Drizzle Heart Accent */}
          <path d="M12 12c-1.5-1.5-3-1-3 0.5 0 1.5 3 3.5 3 3.5s3-2 3-3.5c0-1.5-1.5-2-3-0.5Z" />
        </svg>
      );

    default:
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z" />
        </svg>
      );
  }
};
