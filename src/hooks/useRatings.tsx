
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Rating {
  id: number;
  nota: number;
  comentario?: string;
  created_at: string;
  profiles: {
    nome: string;
    avatar_url?: string;
  };
}

export function useRatings() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addRating = async (recipeId: number, rating: number, comment?: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para avaliar receitas');
      return { error: 'Not authenticated' };
    }

    setLoading(true);
    try {
      // Check if user already rated this recipe
      const { data: existing } = await supabase
        .from('avaliacoes')
        .select('id')
        .eq('receita_id', recipeId)
        .eq('usuario_id', user.id)
        .single();

      let result;

      if (existing) {
        // Update existing rating
        result = await supabase
          .from('avaliacoes')
          .update({
            nota: rating,
            comentario: comment
          })
          .eq('id', existing.id)
          .select();
      } else {
        // Create new rating
        result = await supabase
          .from('avaliacoes')
          .insert({
            receita_id: recipeId,
            usuario_id: user.id,
            nota: rating,
            comentario: comment
          })
          .select();
      }

      if (result.error) {
        console.error('Error saving rating:', result.error);
        throw result.error;
      }

      toast.success(existing ? 'Avaliação atualizada!' : 'Avaliação adicionada!');
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error saving rating:', error);
      toast.error('Erro ao salvar avaliação');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const getUserRating = async (recipeId: number) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('receita_id', recipeId)
        .eq('usuario_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user rating:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user rating:', error);
      return null;
    }
  };

  return {
    loading,
    addRating,
    getUserRating
  };
}
