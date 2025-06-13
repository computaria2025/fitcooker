
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDeleteRecipe = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const deleteRecipe = async (recipeId: number) => {
    setIsDeleting(true);
    try {
      console.log('Deletando receita com ID:', recipeId);
      
      const { error } = await supabase
        .from('receitas')
        .delete()
        .eq('id', recipeId);

      if (error) {
        console.error('Erro ao deletar receita:', error);
        throw error;
      }

      toast({
        title: "Receita excluída com sucesso!",
        description: "A receita foi removida permanentemente.",
      });

      return true;
    } catch (err) {
      console.error('Erro ao deletar receita:', err);
      toast({
        title: "Erro ao excluir receita",
        description: "Ocorreu um erro ao tentar excluir a receita. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteRecipe,
    isDeleting
  };
};
