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
    iconName: 'Salad',
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
    iconName: 'Cheese',
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
    iconName: 'Zap',
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
    iconName: 'Sparkles',
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
    iconName: 'Wheat',
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
    iconName: 'HeartHandshake',
    description: 'A clássica salsa rosada venezuelana'
  }
];

export function calculateNivelCaracas(selectedIds: string[]): number {
  if (selectedIds.length === 0) return 0;
  return Math.round((selectedIds.length / INGREDIENTS.length) * 100);
}

export function getNivelCaracasLabel(percentage: number): { title: string; subtitle: string; colorClass: string } {
  if (percentage === 0) {
    return { title: 'Só Pão e Salsicha', subtitle: 'Escolhe ingredientes para subir o nível!', colorClass: 'text-slate-400' };
  } else if (percentage <= 33) {
    return { title: 'Sifrino Mild', subtitle: 'Bom começo, mas a rua pede mais!', colorClass: 'text-blue-400' };
  } else if (percentage <= 67) {
    return { title: 'Caracas Vibe', subtitle: 'Quase lá! Sabor autêntico da rua.', colorClass: 'text-amber-400' };
  } else if (percentage < 100) {
    return { title: 'Callejero Respeitado', subtitle: 'Quase "Con Todo"! Falta muito pouco.', colorClass: 'text-emerald-400' };
  } else {
    return { title: 'CARACAS BRUTAL (CON TODO!) 🚀🔥', subtitle: 'O autêntico Perro Caliente com tudo a que tem direito!', colorClass: 'text-neon-red font-extrabold' };
  }
}
