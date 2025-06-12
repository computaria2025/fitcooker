
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
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  unit: string;
}

export const useUSDAIngredients = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchUSDAIngredients = async (query: string): Promise<ProcessedIngredient[]> => {
    if (!query.trim()) return [];
    
    setIsLoading(true);
    try {
      // Primeiro, verificar se o ingrediente já existe no cache (Supabase)
      const { data: cachedIngredients } = await supabase
        .from('ingredientes')
        .select('*')
        .ilike('nome', `%${query}%`)
        .limit(5);

      if (cachedIngredients && cachedIngredients.length > 0) {
        setIsLoading(false);
        return cachedIngredients.map(ing => ({
          name: ing.nome,
          protein: ing.proteina || 0,
          carbs: ing.carboidratos || 0,
          fat: ing.gorduras || 0,
          calories: ing.calorias || 0,
          unit: ing.unidade_padrao || 'g'
        }));
      }

      // Se não encontrou no cache, buscar na API USDA
      const apiKey = 'DEMO_KEY'; // Em produção, usar uma chave real
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

      setIsLoading(false);
      return processedIngredients;
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar ingredientes. Tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
      return [];
    }
  };

  const processUSDAFood = (food: USDAIngredient): ProcessedIngredient | null => {
    try {
      const nutrients = food.foodNutrients;
      
      // Mapeamento dos IDs dos nutrientes da USDA
      const proteinNutrient = nutrients.find(n => n.nutrientId === 1003); // Protein
      const carbsNutrient = nutrients.find(n => n.nutrientId === 1005); // Carbs
      const fatNutrient = nutrients.find(n => n.nutrientId === 1004); // Fat
      const caloriesNutrient = nutrients.find(n => n.nutrientId === 1008); // Energy

      return {
        name: food.description,
        protein: proteinNutrient?.value || 0,
        carbs: carbsNutrient?.value || 0,
        fat: fatNutrient?.value || 0,
        calories: caloriesNutrient?.value || 0,
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
          proteina: ingredient.protein,
          carboidratos: ingredient.carbs,
          gorduras: ingredient.fat,
          calorias: ingredient.calories,
          unidade_padrao: ingredient.unit
        });

      if (error && !error.message.includes('duplicate')) {
        console.error('Erro ao cachear ingrediente:', error);
      }
    } catch (error) {
      console.error('Erro ao cachear ingrediente:', error);
    }
  };

  const addCustomIngredient = async (name: string, macros?: Partial<ProcessedIngredient>) => {
    try {
      const { data, error } = await supabase
        .from('ingredientes')
        .insert({
          nome: name,
          proteina: macros?.protein || 0,
          carboidratos: macros?.carbs || 0,
          gorduras: macros?.fat || 0,
          calorias: macros?.calories || 0,
          unidade_padrao: macros?.unit || 'g'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Ingrediente adicionado",
        description: "Ingrediente personalizado criado com sucesso.",
      });

      return {
        name: data.nome,
        protein: data.proteina || 0,
        carbs: data.carboidratos || 0,
        fat: data.gorduras || 0,
        calories: data.calorias || 0,
        unit: data.unidade_padrao || 'g'
      };
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
