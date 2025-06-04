
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Recipe {
  id: number;
  titulo: string;
  descricao: string;
  tempo_preparo: number;
  porcoes: number;
  dificuldade: string;
  imagem_url?: string;
  video_url?: string;
  nota_media: number;
  avaliacoes_count: number;
  visualizacoes: number;
  created_at: string;
  profiles: {
    nome: string;
    avatar_url?: string;
    is_chef: boolean;
  };
  receita_categorias: {
    categorias: {
      nome: string;
    };
  }[];
  informacao_nutricional?: {
    calorias_totais: number;
    proteinas_totais: number;
    carboidratos_totais: number;
    gorduras_totais: number;
  };
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchRecipes = async (filters?: {
    category?: string;
    search?: string;
    userId?: string;
  }) => {
    setLoading(true);
    try {
      let query = supabase
        .from('receitas')
        .select(`
          *,
          profiles!receitas_usuario_id_fkey (
            nome,
            avatar_url,
            is_chef
          ),
          receita_categorias (
            categorias (
              nome
            )
          ),
          informacao_nutricional (
            calorias_totais,
            proteinas_totais,
            carboidratos_totais,
            gorduras_totais
          )
        `)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false });

      if (filters?.userId) {
        query = query.eq('usuario_id', filters.userId);
      }

      if (filters?.search) {
        query = query.ilike('titulo', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }

      let filteredData = data || [];

      if (filters?.category && filters.category !== 'Todas') {
        filteredData = filteredData.filter(recipe =>
          recipe.receita_categorias.some(rc => rc.categorias.nome === filters.category)
        );
      }

      setRecipes(filteredData);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Erro ao carregar receitas');
    } finally {
      setLoading(false);
    }
  };

  const getRecipeById = async (id: number) => {
    try {
      const { data: recipe, error } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles!receitas_usuario_id_fkey (
            nome,
            avatar_url,
            is_chef,
            id
          ),
          receita_categorias (
            categorias (
              nome
            )
          ),
          receita_ingredientes (
            *,
            ingredientes (
              nome,
              proteina,
              carboidratos,
              gorduras,
              calorias,
              unidade_padrao
            )
          ),
          receita_passos (
            *
          ),
          informacao_nutricional (
            *
          ),
          avaliacoes (
            *,
            profiles!avaliacoes_usuario_id_fkey (
              nome,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .eq('status', 'ativa')
        .single();

      if (error) {
        console.error('Error fetching recipe:', error);
        throw error;
      }

      // Update view count
      await supabase
        .from('receitas')
        .update({ visualizacoes: (recipe.visualizacoes || 0) + 1 })
        .eq('id', id);

      return recipe;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      toast.error('Erro ao carregar receita');
      return null;
    }
  };

  const saveRecipe = async (recipeData: any) => {
    try {
      if (!user) {
        toast.error('Você precisa estar logado para salvar receitas');
        return { error: 'Not authenticated' };
      }

      console.log('Saving recipe data:', recipeData);

      // 1. Insert the recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('receitas')
        .insert({
          usuario_id: user.id,
          titulo: recipeData.title,
          descricao: recipeData.description,
          tempo_preparo: parseInt(recipeData.preparationTime),
          porcoes: parseInt(recipeData.servings),
          dificuldade: recipeData.difficulty,
          imagem_url: recipeData.mainImageUrl
        })
        .select()
        .single();

      if (recipeError) {
        console.error('Recipe error:', recipeError);
        throw recipeError;
      }

      console.log('Recipe saved:', recipe);

      // 2. Insert categories
      if (recipeData.selectedCategories.length > 0) {
        const { data: categories } = await supabase
          .from('categorias')
          .select('id, nome')
          .in('nome', recipeData.selectedCategories);

        if (categories) {
          const categoryInserts = categories.map(cat => ({
            receita_id: recipe.id,
            categoria_id: cat.id
          }));

          const { error: catError } = await supabase
            .from('receita_categorias')
            .insert(categoryInserts);

          if (catError) {
            console.error('Category error:', catError);
          }
        }
      }

      // 3. Insert ingredients
      if (recipeData.ingredients.length > 0) {
        const ingredientInserts = recipeData.ingredients.map((ing: any, index: number) => ({
          receita_id: recipe.id,
          ingrediente_id: ing.ingredientId,
          quantidade: ing.quantity,
          unidade: ing.unit,
          ordem: index + 1
        }));

        const { error: ingError } = await supabase
          .from('receita_ingredientes')
          .insert(ingredientInserts);

        if (ingError) {
          console.error('Ingredients error:', ingError);
        }
      }

      // 4. Insert steps
      if (recipeData.steps.length > 0) {
        const stepInserts = recipeData.steps.map((step: any) => ({
          receita_id: recipe.id,
          ordem: step.order,
          descricao: step.description
        }));

        const { error: stepError } = await supabase
          .from('receita_passos')
          .insert(stepInserts);

        if (stepError) {
          console.error('Steps error:', stepError);
        }
      }

      // 5. Insert nutritional information
      if (recipeData.totalMacros) {
        const { error: nutritionError } = await supabase
          .from('informacao_nutricional')
          .insert({
            receita_id: recipe.id,
            calorias_totais: recipeData.totalMacros.calories || 0,
            proteinas_totais: recipeData.totalMacros.protein || 0,
            carboidratos_totais: recipeData.totalMacros.carbs || 0,
            gorduras_totais: recipeData.totalMacros.fat || 0
          });

        if (nutritionError) {
          console.error('Nutrition error:', nutritionError);
        }
      }

      toast.success('Receita publicada com sucesso!');
      return { data: recipe, error: null };
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error('Erro ao publicar receita');
      return { error };
    }
  };

  const toggleSaveRecipe = async (recipeId: number) => {
    try {
      if (!user) {
        toast.error('Você precisa estar logado para salvar receitas');
        return;
      }

      // Check if already saved
      const { data: existing } = await supabase
        .from('receitas_salvas')
        .select('id')
        .eq('usuario_id', user.id)
        .eq('receita_id', recipeId)
        .single();

      if (existing) {
        // Remove from saved
        const { error } = await supabase
          .from('receitas_salvas')
          .delete()
          .eq('usuario_id', user.id)
          .eq('receita_id', recipeId);

        if (error) throw error;
        toast.success('Receita removida dos favoritos');
        return false;
      } else {
        // Add to saved
        const { error } = await supabase
          .from('receitas_salvas')
          .insert({
            usuario_id: user.id,
            receita_id: recipeId
          });

        if (error) throw error;
        toast.success('Receita salva nos favoritos');
        return true;
      }
    } catch (error) {
      console.error('Error toggling save recipe:', error);
      toast.error('Erro ao salvar/remover receita');
    }
  };

  const isRecipeSaved = async (recipeId: number) => {
    if (!user) return false;

    try {
      const { data } = await supabase
        .from('receitas_salvas')
        .select('id')
        .eq('usuario_id', user.id)
        .eq('receita_id', recipeId)
        .single();

      return !!data;
    } catch {
      return false;
    }
  };

  return {
    recipes,
    loading,
    fetchRecipes,
    getRecipeById,
    saveRecipe,
    toggleSaveRecipe,
    isRecipeSaved
  };
}
