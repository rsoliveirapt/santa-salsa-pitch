export interface IngredientDefinition {
  id: string;
  name: string;
  nameEn: string;
  category: 'cabbage' | 'cheese' | 'crunch' | 'sauce';
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconName: string;
  description: string;
}

export interface PerroRecord {
  id: string;
  ingredientes: string[]; // List of ingredient IDs selected
  nivel_caracas: number; // 0 to 100
  criado_em: string; // ISO String timestamp
}

export const INGREDIENTS: IngredientDefinition[] = [
  {
    id: 'cabbage',
    name: 'Repolho Picado',
    nameEn: 'Chopped Cabbage',
    category: 'cabbage',
    color: '#4E9F3D',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-500/50',
    badgeText: 'text-emerald-400',
    iconName: 'cabbage',
    description: 'Repolho verde bem fininho e crocante'
  },
  {
    id: 'queso_blanco',
    name: 'Queijo Branco Ralado',
    nameEn: 'Queso Blanco',
    category: 'cheese',
    color: '#F8FAFC',
    badgeBg: 'bg-slate-900/90',
    badgeBorder: 'border-slate-300/50',
    badgeText: 'text-slate-200',
    iconName: 'queso_blanco',
    description: 'Queijo fresco venezuelano ralado suave'
  },
  {
    id: 'papas_fosforito',
    name: 'Batata Palha',
    nameEn: 'Papas Fosforito',
    category: 'crunch',
    color: '#FFC107',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-400/50',
    badgeText: 'text-amber-400',
    iconName: 'papas_fosforito',
    description: 'Batatas palha crocantes e estaladiças'
  },
  {
    id: 'garlic_sauce',
    name: 'Molho de Alho',
    nameEn: 'Garlic Sauce',
    category: 'sauce',
    color: '#FEF08A',
    badgeBg: 'bg-yellow-950/80',
    badgeBorder: 'border-yellow-400/50',
    badgeText: 'text-yellow-300',
    iconName: 'garlic_sauce',
    description: 'Salsa de ajo cremosa com alho fresco'
  },
  {
    id: 'corn_sauce',
    name: 'Molho de Milho Doce',
    nameEn: 'Corn Sauce',
    category: 'sauce',
    color: '#F59E0B',
    badgeBg: 'bg-orange-950/80',
    badgeBorder: 'border-orange-400/50',
    badgeText: 'text-orange-400',
    iconName: 'corn_sauce',
    description: 'Molho aveludado de milho doce de Caracas'
  },
  {
    id: 'pink_sauce',
    name: 'Salsa Rosada',
    nameEn: 'Pink Sauce',
    category: 'sauce',
    color: '#EC4899',
    badgeBg: 'bg-pink-950/80',
    badgeBorder: 'border-pink-500/50',
    badgeText: 'text-pink-400',
    iconName: 'pink_sauce',
    description: 'A clássica salsa rosada venezuelana'
  }
];

export function calculateNivelCaracas(selectedIds: string[]): number {
  if (selectedIds.length === 0) return 0;
  return Math.round((selectedIds.length / INGREDIENTS.length) * 100);
}

export function getNivelCaracasLabel(nivel: number): {
  title: string;
  subtitle: string;
  colorClass: string;
} {
  if (nivel === 0) {
    return {
      title: 'Pão & Salsicha Simples',
      subtitle: 'Sem ingredientes adicionados',
      colorClass: 'text-zinc-400'
    };
  }
  if (nivel <= 34) {
    return {
      title: 'Perro Suave',
      subtitle: 'Começar a ganhar sabor de Caracas',
      colorClass: 'text-emerald-400'
    };
  }
  if (nivel <= 67) {
    return {
      title: 'Perro Tradicional',
      subtitle: 'Excelente mistura venezuelana',
      colorClass: 'text-[#FFEB01]'
    };
  }
  if (nivel < 100) {
    return {
      title: 'Perro Caracas Pro',
      subtitle: 'Muito perto do máximo sabor',
      colorClass: 'text-amber-500'
    };
  }
  return {
    title: 'CARACAS BRUTAL (CON TODO!) 🚀🔥',
    subtitle: 'Nível máximo! 6/6 ingredientes',
    colorClass: 'text-[#DC2626] font-black animate-pulse'
  };
}
