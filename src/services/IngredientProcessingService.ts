import { ProcessedIngredient } from "@/types/recipe";

interface RawIngredient {
  name: any;
  calories: any;
  protein: any;
  carbs: any;
  fat: any;
  fiber?: any; // Opcional, pois nem toda API fornece
  sodium?: any; // Opcional
  unit?: any;
  allergens?: string[];
}

// Função para normalizar o texto (lowercase, sem acentos e caracteres especiais)
const normalizeText = (text: string, keep: string = ""): string => {
	// Escape regex-special characters in `keep`
	const escapedKeep = keep.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	const regex = new RegExp(`[^a-z0-9\\s${escapedKeep}]`, "g");

  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(regex, '')
    .trim();
};

// Função para garantir que o valor seja um número
const convertToNumber = (value: any): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

// Função para padronizar unidades de medida
const standardizeUnits = (unit: any): string => {
    if (typeof unit !== 'string') return 'g';

    const unitLower = unit.toLowerCase();
    if (unitLower.includes('gram') || unitLower === 'g') return 'g';
    if (unitLower.includes('milliliter') || unitLower === 'ml') return 'ml';
    if (unitLower.includes('unit') || unitLower === 'un') return 'un';
    
    return 'g'; // Padrão
};

// Função principal que processa um ingrediente
export const processIngredient = (rawIngredient: RawIngredient): ProcessedIngredient => {
  return {
    name: normalizeText(rawIngredient.name || 'ingrediente desconhecido'),
    calories: convertToNumber(rawIngredient.calories),
    protein: convertToNumber(rawIngredient.protein),
    carbs: convertToNumber(rawIngredient.carbs),
    fat: convertToNumber(rawIngredient.fat),
    fiber: convertToNumber(rawIngredient.fiber),
    sodium: convertToNumber(rawIngredient.sodium),
    unit: standardizeUnits(rawIngredient.unit),
    allergens: (rawIngredient.allergens ?? []).map(allergen => normalizeText(allergen, ":")),
  };
};