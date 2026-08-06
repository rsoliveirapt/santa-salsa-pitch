import React from 'react';
import { Salad, Zap, Sparkles, HeartHandshake, Leaf, Droplets } from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
}

export const IngredientIcon: React.FC<IconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Salad':
      return <Salad className={className} />;
    case 'Cheese':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10h18l-9-7z" />
          <path d="M3 10v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V10" />
          <circle cx="8" cy="15" r="1.5" />
          <circle cx="15" cy="16" r="1" />
        </svg>
      );
    case 'Zap':
      return <Zap className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Wheat':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 22 12 12" />
          <path d="M12 12 19 5" />
          <path d="M15 12h5a3 3 0 0 0 0-6h-5" />
          <path d="M12 15v5a3 3 0 0 0 6 0v-5" />
        </svg>
      );
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'Leaf':
      return <Leaf className={className} />;
    default:
      return <Droplets className={className} />;
  }
};
