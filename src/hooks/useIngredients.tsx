
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Ingredient {
  id: number;
  nome: string;
  proteina: number;
  carboidratos: number;
  gorduras: number;
  calorias: number;
  unidade_padrao: string;
}

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
      }

      setIngredients(data || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast.error('Erro ao carregar ingredientes');
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = async (ingredientData: {
    nome: string;
    proteina?: number;
    carboidratos?: number;
    gorduras?: number;
    calorias?: number;
    unidade_padrao?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('ingredientes')
        .insert({
          nome: ingredientData.nome,
          proteina: ingredientData.proteina || 0,
          carboidratos: ingredientData.carboidratos || 0,
          gorduras: ingredientData.gorduras || 0,
          calorias: ingredientData.calorias || 0,
          unidade_padrao: ingredientData.unidade_padrao || 'g'
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding ingredient:', error);
        throw error;
      }

      setIngredients(prev => [...prev, data]);
      toast.success('Ingrediente adicionado com sucesso!');
      return { data, error: null };
    } catch (error) {
      console.error('Error adding ingredient:', error);
      toast.error('Erro ao adicionar ingrediente');
      return { error };
    }
  };

  const searchIngredients = (searchTerm: string) => {
    if (!searchTerm.trim()) return ingredients;
    
    return ingredients.filter(ingredient =>
      ingredient.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return {
    ingredients,
    loading,
    fetchIngredients,
    addIngredient,
    searchIngredients
  };
}
