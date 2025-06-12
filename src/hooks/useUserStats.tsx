
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

      // Get basic profile stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('receitas_count, seguidores_count, seguindo_count')
        .eq('id', userId)
        .single();

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
        receitas_count: profile?.receitas_count || 0,
        seguidores_count: profile?.seguidores_count || 0,
        seguindo_count: profile?.seguindo_count || 0,
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
