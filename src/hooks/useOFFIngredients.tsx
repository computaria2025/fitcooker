import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProcessedIngredient {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibers: number;
  sodium: number;
  unit: string;
}

export const useOFFIngredients = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchOFFIngredients = async (query: string): Promise<ProcessedIngredient[]> => {
    if (!query.trim()) return [];
    setIsLoading(true);

    try {
      // 1. Primeiro busca no Supabase (cache)
      const { data: cachedIngredients } = await supabase
        .from('ingredientes')
        .select('*')
        .ilike('nome', `%${query}%`)
        .limit(5);

      if (cachedIngredients && cachedIngredients.length > 0) {
        setIsLoading(false);
        return cachedIngredients.map(ing => ({
          name: ing.nome as string,
          calories: Number((ing as any).calorias_por_100g) || 0,
          protein: Number((ing as any).proteinas_por_100g) || 0,
          carbs: Number((ing as any).carboidratos_por_100g) || 0,
          fat: Number((ing as any).gorduras_por_100g) || 0,
          fibers: Number((ing as any).fibras_por_100g) || 0,
          sodium: Number((ing as any).sodio_por_100g) || 0,
          unit: (ing as any).unidade_padrao || 'g'
        }));
      }

      // 2. Busca na API OpenFoodFacts
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar na API OpenFoodFacts');
      }

      const data = await response.json();
      const processedIngredients: ProcessedIngredient[] = [];

      for (const product of data.products || []) {
        const nutriments = product.nutriments || {};

        const processed: ProcessedIngredient = {
          name: product.product_name || query,
          calories: nutriments['energy-kcal_100g'] || 0,
          protein: nutriments['proteins_100g'] || 0,
          carbs: nutriments['carbohydrates_100g'] || 0,
          fat: nutriments['fat_100g'] || 0,
          fibers: nutriments['fiber_100g'] || 0,
          sodium: nutriments['sodium_100g'] ? nutriments['sodium_100g'] * 1000 : 0,
          unit: 'g'
        };

        processedIngredients.push(processed);

        await cacheIngredient(processed);
      }

      setIsLoading(false);
      return processedIngredients;
    } catch (error) {
      console.error('Erro ao buscar ingredientes OFF:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar ingredientes no OpenFoodFacts.",
        variant: "destructive",
      });
      setIsLoading(false);
      return [];
    }
  };

  const cacheIngredient = async (ingredient: ProcessedIngredient) => {
    try {
      const { error } = await supabase
        .from('ingredientes')
        .insert({
          nome: ingredient.name,
          calorias_por_100g: ingredient.calories,
          proteinas_por_100g: ingredient.protein,
          carboidratos_por_100g: ingredient.carbs,
          gorduras_por_100g: ingredient.fat,
          fibras_por_100g: ingredient.fibers,
          sodio_por_100g: ingredient.sodium,
          unidade_padrao: ingredient.unit
        });

      if (error && !error.message.includes('duplicate')) {
        console.error('Erro ao cachear ingrediente:', error);
      }
    } catch (error) {
      console.error('Erro ao cachear ingrediente:', error);
    }
  };

  return {
    searchOFFIngredients,
    isLoading
  };
};
