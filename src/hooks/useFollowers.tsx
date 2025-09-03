
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
    console.debug("fetchFollowers", targetUserId);
    try {
      // Step 1: get seguidor_id list
      const { data: followerIds, error: followerError } = await supabase
        .from('seguidores')
        .select('seguidor_id')
        .eq('seguido_id', targetUserId);
  
      if (followerError) throw followerError;
  
      if (!followerIds || followerIds.length === 0) {
        setFollowers([]);
        return;
      }
  
      // Step 2: fetch profiles for those IDs
      const ids = followerIds.map(f => f.seguidor_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, nome, avatar_url')
        .in('user_id', ids);
  
      if (profilesError) throw profilesError;
  
      // Step 3: merge results
      setFollowers(profiles || []);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };
  
  const fetchFollowing = async (targetUserId: string) => {
    console.debug("fetchFollowing", targetUserId);
    try {
      // Step 1: get seguindo_id list
      const { data: followingIds, error: followingError } = await supabase
        .from('seguidores')
        .select('seguido_id')
        .eq('seguidor_id', targetUserId);
  
      if (followingError) throw followingError;
  
      if (!followingIds || followingIds.length === 0) {
        setFollowing([]);
        return;
      }
  
      // Step 2: fetch profiles for those IDs
      const ids = followingIds.map(f => f.seguido_id);
      console.debug("ids", ids);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, nome, avatar_url')
        .in('user_id', ids);
  

      if (profilesError) throw profilesError;

      console.debug("profiles", profiles);
  
      // Step 3: merge results
      setFollowing(profiles || []);
    } catch (error) {
      console.error('Error fetching followers:', error);
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
