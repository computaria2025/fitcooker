
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface SaveRecipeButtonProps {
  recipeId: number;
  className?: string;
}

const SaveRecipeButton: React.FC<SaveRecipeButtonProps> = ({ recipeId, className = '' }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfSaved();
    }
  }, [user, recipeId]);

  const checkIfSaved = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('receitas_salvas')
        .select('id')
        .eq('usuario_id', user.id)
        .eq('receita_id', recipeId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking saved recipe:', error);
        return;
      }

      setIsSaved(!!data);
    } catch (error) {
      console.error('Error checking saved recipe:', error);
    }
  };

  const toggleSave = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para salvar receitas.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from('receitas_salvas')
          .delete()
          .eq('usuario_id', user.id)
          .eq('receita_id', recipeId);

        if (error) throw error;

        setIsSaved(false);
        toast({
          title: "Receita removida",
          description: "Receita removida dos seus favoritos.",
        });
      } else {
        // Add to saved
        const { error } = await supabase
          .from('receitas_salvas')
          .insert({
            usuario_id: user.id,
            receita_id: recipeId
          });

        if (error) throw error;

        setIsSaved(true);
        toast({
          title: "Receita salva!",
          description: "Receita adicionada aos seus favoritos.",
        });
      }
    } catch (error: any) {
      console.error('Error toggling save:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar a receita.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={toggleSave}
        disabled={isLoading}
        variant={isSaved ? "default" : "outline"}
        className={`${className} ${
          isSaved 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'hover:bg-red-50 hover:text-red-600 hover:border-red-300'
        }`}
      >
        <Heart 
          className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} 
        />
        {isLoading ? 'Carregando...' : isSaved ? 'Salva' : 'Salvar'}
      </Button>
    </motion.div>
  );
};

export default SaveRecipeButton;
