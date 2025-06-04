
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  nome: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  is_chef: boolean;
  seguidores_count: number;
  seguindo_count: number;
  receitas_count: number;
  data_cadastro: string;
}

export function useProfiles() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getProfile = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Erro ao carregar perfil');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getChefs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_chef', true)
        .order('seguidores_count', { ascending: false });

      if (error) {
        console.error('Error fetching chefs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching chefs:', error);
      toast.error('Erro ao carregar chefs');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (targetUserId: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para seguir chefs');
      return;
    }

    if (user.id === targetUserId) {
      toast.error('Você não pode seguir a si mesmo');
      return;
    }

    try {
      // Check if already following
      const { data: existing } = await supabase
        .from('seguidores')
        .select('id')
        .eq('seguidor_id', user.id)
        .eq('seguido_id', targetUserId)
        .single();

      if (existing) {
        // Unfollow
        const { error } = await supabase
          .from('seguidores')
          .delete()
          .eq('seguidor_id', user.id)
          .eq('seguido_id', targetUserId);

        if (error) throw error;
        toast.success('Você parou de seguir este chef');
        return false;
      } else {
        // Follow
        const { error } = await supabase
          .from('seguidores')
          .insert({
            seguidor_id: user.id,
            seguido_id: targetUserId
          });

        if (error) throw error;
        toast.success('Agora você está seguindo este chef');
        return true;
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Erro ao seguir/deixar de seguir');
    }
  };

  const isFollowing = async (targetUserId: string) => {
    if (!user) return false;

    try {
      const { data } = await supabase
        .from('seguidores')
        .select('id')
        .eq('seguidor_id', user.id)
        .eq('seguido_id', targetUserId)
        .single();

      return !!data;
    } catch {
      return false;
    }
  };

  return {
    loading,
    getProfile,
    getChefs,
    toggleFollow,
    isFollowing
  };
}
