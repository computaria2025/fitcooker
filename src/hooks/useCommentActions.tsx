import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCommentActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const editComment = async (commentId: number, newComment: string, newRating: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('avaliacoes')
        .update({
          comentario: newComment,
          nota: newRating,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Comentário atualizado",
        description: "Seu comentário foi atualizado com sucesso.",
      });

      return true;
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar seu comentário. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('avaliacoes')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Comentário removido",
        description: "Seu comentário foi removido com sucesso.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover seu comentário. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editComment,
    deleteComment,
    isLoading
  };
};