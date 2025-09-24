import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface USDAIngredient {
  fdcId: number;
  description: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
}

interface ProcessedIngredient {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  unit: string;
}

export const useUSDAIngredients = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchUSDAIngredients = async (query: string): Promise<ProcessedIngredient[]> => {
    if (!query.trim()) return [];
    
    setIsLoading(true);
    try {
      // Busca direto na API da USDA
      const apiKey = import.meta.env.VITE_USDA_API_KEY; 
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(query)}&pageSize=5`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar na API USDA');
      }

      const data = await response.json();
      const processedIngredients: ProcessedIngredient[] = [];

      for (const food of data.foods || []) {
        const processed = processUSDAFood(food);
        if (processed) {
          processedIngredients.push(processed);
          // Salvar no cache (Supabase)
          await cacheIngredient(processed);
        }
      }

      return processedIngredients;
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar ingredientes. Tente novamente.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const processUSDAFood = (food: USDAIngredient): ProcessedIngredient | null => {
    try {
      const nutrients = food.foodNutrients;
      
      const caloriesNutrient = nutrients.find(n => n.nutrientId === 1008); // Energy
      const proteinNutrient = nutrients.find(n => n.nutrientId === 1003); // Protein
      const carbsNutrient = nutrients.find(n => n.nutrientId === 1005); // Carbs
      const fatNutrient = nutrients.find(n => n.nutrientId === 1004); // Fat
      const fiberNutrient = nutrients.find(n => n.nutrientId === 1079); // Fiber
      const sodiumNutrient = nutrients.find(n => n.nutrientId === 1093); // Sodium

      return {
        name: food.description,
        calories: caloriesNutrient?.value || 0,
        protein: proteinNutrient?.value || 0,
        carbs: carbsNutrient?.value || 0,
        fat: fatNutrient?.value || 0,
        fiber: fiberNutrient?.value || 0,
        sodium: sodiumNutrient?.value || 0,
        unit: 'g'
      };
    } catch (error) {
      console.error('Erro ao processar alimento USDA:', error);
      return null;
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
          fibras_por_100g: ingredient.fiber,
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

  const addCustomIngredient = async (macros?: Partial<ProcessedIngredient>) => {
    try {
      const { data, error } = await supabase
        .from('ingredientes')
        .insert({
          nome: macros.name,
          calorias_por_100g: macros?.calories || 0,
          proteinas_por_100g: macros?.protein || 0,
          carboidratos_por_100g: macros?.carbs || 0,
          gorduras_por_100g: macros?.fat || 0,
          fibras_por_100g: macros?.fiber || 0,
          sodio_por_100g: macros?.sodium || 0,
          unidade_padrao: macros?.unit || 'g',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Ingrediente adicionado",
        description: "Ingrediente personalizado criado com sucesso.",
      });

      return {
        name: data.nome as string,
        protein: Number((data as any).proteinas_por_100g) || 0,
        carbs: Number((data as any).carboidratos_por_100g) || 0,
        fat: Number((data as any).gorduras_por_100g) || 0,
        calories: Number((data as any).calorias_por_100g) || 0,
        unit: (data as any).unidade_padrao || 'g'
      } as ProcessedIngredient;
    } catch (error) {
      console.error('Erro ao adicionar ingrediente personalizado:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o ingrediente personalizado.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    searchUSDAIngredients,
    addCustomIngredient,
    isLoading
  };
};