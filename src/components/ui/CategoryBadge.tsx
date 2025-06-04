
import React from 'react';
import { RecipeCategory } from '@/data/mockData';

type CategoryBadgeProps = {
  category: RecipeCategory | string;
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getColor = (cat: RecipeCategory | string) => {
    // Convert category to string for comparison
    const categoryStr = String(cat);
    
    switch (categoryStr) {
      case 'Bulking':
      case RecipeCategory.BULKING:
        return 'bg-green-500 text-white';
      case 'Cutting':
      case RecipeCategory.CUTTING:
        return 'bg-blue-500 text-white';
      case 'LowCarb':
      case 'Low Carb':
      case RecipeCategory.LOWCARB:
        return 'bg-yellow-500 text-black';
      case 'HighProtein':
      case 'Alto Proteína':
      case RecipeCategory.HIGHPROTEIN:
        return 'bg-fitcooker-orange text-white';
      case 'Vegetariano':
      case RecipeCategory.VEGETARIAN:
        return 'bg-emerald-500 text-white';
      case 'Vegano':
      case RecipeCategory.VEGAN:
        return 'bg-teal-500 text-white';
      case 'SemGlúten':
        return 'bg-amber-400 text-black';
      case 'SemLactose':
        return 'bg-purple-500 text-white';
      case 'Keto':
        return 'bg-red-500 text-white';
      case 'Paleo':
        return 'bg-rose-500 text-white';
      case 'Sair da Dieta':
      case RecipeCategory.CHEATMEAL:
        return 'bg-pink-500 text-white';
      case 'Lanches':
      case RecipeCategory.SNACK:
        return 'bg-indigo-500 text-white';
      case 'Almoço':
      case RecipeCategory.LUNCH:
        return 'bg-cyan-500 text-white';
      case 'Jantar':
      case RecipeCategory.DINNER:
        return 'bg-violet-500 text-white';
      case 'Café da Manhã':
      case RecipeCategory.BREAKFAST:
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <span className={`category-badge ${getColor(category)} px-2 py-0.5 rounded-full text-xs font-medium`}>
      {category}
    </span>
  );
};

export default CategoryBadge;
