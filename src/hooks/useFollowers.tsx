
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useFollowers = (userId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  useEffect(() => {
    if (user && userId) {
      checkIfFollowing();
    }
  }, [user, userId]);

  const checkIfFollowing = async () => {
    if (!user || !userId) return;

    try {
      const { data } = await supabase
        .from('seguidores')
        .select('id')
        .eq('seguidor_id', user.id)
        .eq('seguido_id', userId)
        .single();

      setIsFollowing(!!data);
    } catch (error) {
      // User is not following
      setIsFollowing(false);
    }
  };

  const toggleFollow = async () => {
    if (!user || !userId) return;

    setLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('seguidores')
          .delete()
          .eq('seguidor_id', user.id)
          .eq('seguido_id', userId);

        if (error) throw error;

        setIsFollowing(false);
        toast({
          title: "Sucesso!",
          description: "Você parou de seguir este chef.",
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('seguidores')
          .insert({
            seguidor_id: user.id,
            seguido_id: userId
          });

        if (error) throw error;

        setIsFollowing(true);
        toast({
          title: "Sucesso!",
          description: "Você agora está seguindo este chef.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status de seguimento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowers = async (targetUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('seguidores')
        .select(`
          seguidor_id,
          profiles!seguidores_seguidor_id_fkey(nome, avatar_url)
        `)
        .eq('seguido_id', targetUserId);

      if (error) throw error;
      setFollowers(data || []);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchFollowing = async (targetUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('seguidores')
        .select(`
          seguido_id,
          profiles!seguidores_seguido_id_fkey(nome, avatar_url)
        `)
        .eq('seguidor_id', targetUserId);

      if (error) throw error;
      setFollowing(data || []);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  return {
    isFollowing,
    loading,
    toggleFollow,
    followers,
    following,
    fetchFollowers,
    fetchFollowing
  };
};
