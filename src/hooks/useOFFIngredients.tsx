import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { processIngredient } from '@/services/IngredientProcessingService'; // Importe o serviço
import { ProcessedIngredient } from '@/types/recipe';

export const useOFFIngredients = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchOFFIngredients = async (query: string): Promise<ProcessedIngredient[]> => {
    if (!query.trim()) return [];
    setIsLoading(true);

    try {
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

        const rawIngredient = {
          name: product.product_name || query,
          calories: nutriments['energy-kcal_100g'],
          protein: nutriments['proteins_100g'],
          carbs: nutriments['carbohydrates_100g'],
          fat: nutriments['fat_100g'],
          fiber: nutriments['fiber_100g'],
          sodium: nutriments['sodium_100g'] ? nutriments['sodium_100g'] * 1000 : 0, // Converte de g para mg
          unit: 'g',
          allergens: product.allergens_tags,
        };

        const standardizedIngredient = processIngredient(rawIngredient);
        processedIngredients.push(standardizedIngredient);

        await cacheIngredient(standardizedIngredient);
      }

      return processedIngredients;
    } catch (error) {
      console.error('Erro ao buscar ingredientes OFF:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar ingredientes no OpenFoodFacts.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const cacheAllergens = async (ingredient : ProcessedIngredient) => {
    try {
      console.debug("allergens", ingredient.allergens);
      for (const allergen of ingredient.allergens) {
        const { error } = await supabase
        .from('alergenios')
        .upsert({
          id: allergen,
          name: undefined
        });
        if (error && !error.message.includes('duplicate')) {
          console.error('Erro ao cachear alergenio:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao cachear alergenio:', error);
    }
  }

  const cacheIngredient = async (ingredient: ProcessedIngredient) => {
    await cacheAllergens(ingredient);
    try {
      var { data, error } = await supabase
        .from('ingredientes')
        .insert({
          nome: ingredient.name,
          calorias_por_100g: ingredient.calories,
          proteinas_por_100g: ingredient.protein,
          carboidratos_por_100g: ingredient.carbs,
          gorduras_por_100g: ingredient.fat,
          fibras_por_100g: ingredient.fiber,
          sodio_por_100g: ingredient.sodium,
          unidade_padrao: ingredient.unit
        })
        .select("id")
        .single();


      if (!data || (error && !error.message.includes('duplicate'))) {
        console.error('Erro ao cachear ingrediente:', error);
      }

      for (const allergen of ingredient.allergens) {
        var { error } = await supabase
        .from('ingrediente_alergenio')
        .insert({
          alergenio: allergen,
          ingrediente: data.id,
        });
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