
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      console.log('Fetching recipes from Supabase...');
      
      const { data, error } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(nome, avatar_url),
          receita_categorias(categorias(nome)),
          informacao_nutricional(*)
        `)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }

      console.log('Raw recipes data:', data);

      const formattedRecipes: Recipe[] = (data || []).map((recipe: any) => ({
        // Campos originais do banco
        id: recipe.id,
        titulo: recipe.titulo,
        descricao: recipe.descricao,
        imagem_url: recipe.imagem_url || '/placeholder.svg',
        tempo_preparo: recipe.tempo_preparo,
        porcoes: recipe.porcoes,
        dificuldade: recipe.dificuldade,
        nota_media: recipe.nota_media || 0,
        avaliacoes_count: recipe.avaliacoes_count || 0,
        created_at: recipe.created_at,
        usuario_id: recipe.usuario_id,
        
        // Aliases para compatibilidade com componentes existentes
        title: recipe.titulo,
        description: recipe.descricao,
        imageUrl: recipe.imagem_url || '/placeholder.svg',
        preparationTime: recipe.tempo_preparo,
        servings: recipe.porcoes,
        difficulty: recipe.dificuldade,
        rating: recipe.nota_media || 0,
        
        author: {
          id: recipe.usuario_id,
          name: recipe.profiles?.nome || 'Chef Anônimo',
          avatarUrl: recipe.profiles?.avatar_url || '/placeholder.svg'
        },
        categories: recipe.receita_categorias?.map((rc: any) => rc.categorias?.nome).filter(Boolean) || [],
        macros: {
          calories: recipe.informacao_nutricional?.[0]?.calorias_totais || 0,
          protein: recipe.informacao_nutricional?.[0]?.proteinas_totais || 0,
          carbs: recipe.informacao_nutricional?.[0]?.carboidratos_totais || 0,
          fat: recipe.informacao_nutricional?.[0]?.gorduras_totais || 0
        }
      }));

      console.log('Formatted recipes:', formattedRecipes);
      setRecipes(formattedRecipes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar receitas';
      setError(errorMessage);
      console.error('Erro ao buscar receitas:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data: recipes,
    recipes,
    loading,
    isLoading: loading,
    error,
    refetch: fetchRecipes
  };
};
