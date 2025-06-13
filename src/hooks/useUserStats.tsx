
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  receitas_count: number;
  seguidores_count: number;
  seguindo_count: number;
  avaliacoes_count: number;
  nota_media: number | null;
}

export const useUserStats = (userId?: string) => {
  const [stats, setStats] = useState<UserStats>({
    receitas_count: 0,
    seguidores_count: 0,
    seguindo_count: 0,
    avaliacoes_count: 0,
    nota_media: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserStats();
    }
  }, [userId]);

  const fetchUserStats = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Get real recipe count
      const { data: recipes } = await supabase
        .from('receitas')
        .select('id')
        .eq('usuario_id', userId)
        .eq('status', 'ativa');

      const realRecipeCount = recipes?.length || 0;

      // Get real followers count
      const { data: followers } = await supabase
        .from('seguidores')
        .select('id')
        .eq('seguido_id', userId);

      const realFollowersCount = followers?.length || 0;

      // Get real following count
      const { data: following } = await supabase
        .from('seguidores')
        .select('id')
        .eq('seguidor_id', userId);

      const realFollowingCount = following?.length || 0;

      // Get total evaluations received on user's recipes
      const { data: evaluations } = await supabase
        .from('avaliacoes')
        .select('nota, receitas!inner(usuario_id)')
        .eq('receitas.usuario_id', userId);

      let avaliacoes_count = 0;
      let nota_media = null;

      if (evaluations && evaluations.length > 0) {
        avaliacoes_count = evaluations.length;
        const total = evaluations.reduce((sum, evaluation) => sum + evaluation.nota, 0);
        nota_media = total / evaluations.length;
      }

      setStats({
        receitas_count: realRecipeCount,
        seguidores_count: realFollowersCount,
        seguindo_count: realFollowingCount,
        avaliacoes_count,
        nota_media: nota_media ? Number(nota_media.toFixed(1)) : null,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchUserStats };
};
