
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface RateRecipeButtonProps {
  recipeId: number;
  currentRating: number;
  onRatingUpdate: () => void;
  className?: string;
}

const RateRecipeButton: React.FC<RateRecipeButtonProps> = ({ 
  recipeId, 
  currentRating, 
  onRatingUpdate, 
  className = '' 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState<any>(null);

  useEffect(() => {
    if (user && isOpen) {
      fetchUserRating();
    }
  }, [user, recipeId, isOpen]);

  const fetchUserRating = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('receita_id', recipeId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user rating:', error);
        return;
      }

      if (data) {
        setUserRating(data);
        setRating(data.nota);
        setComment(data.comentario || '');
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  };

  const submitRating = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para avaliar receitas.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, selecione uma nota de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const ratingData = {
        usuario_id: user.id,
        receita_id: recipeId,
        nota: rating,
        comentario: comment.trim() || null
      };

      if (userRating) {
        // Update existing rating
        const { error } = await supabase
          .from('avaliacoes')
          .update(ratingData)
          .eq('id', userRating.id);

        if (error) throw error;

        toast({
          title: "Avaliação atualizada!",
          description: "Sua avaliação foi atualizada com sucesso.",
        });
      } else {
        // Create new rating
        const { error } = await supabase
          .from('avaliacoes')
          .insert(ratingData);

        if (error) throw error;

        toast({
          title: "Avaliação enviada!",
          description: "Obrigado por avaliar esta receita.",
        });
      }

      setIsOpen(false);
      onRatingUpdate();
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar sua avaliação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          onClick={() => interactive && setRating(i)}
          onMouseEnter={() => interactive && setHoveredRating(i)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
        >
          <Star
            className={`w-6 h-6 ${
              i <= (interactive ? (hoveredRating || rating) : currentRating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" className={`${className} hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-300`}>
            <Star className="w-4 h-4 mr-2" />
            {userRating ? 'Editar Avaliação' : 'Avaliar'}
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {userRating ? 'Editar Avaliação' : 'Avaliar Receita'}
          </DialogTitle>
          <DialogDescription>
            {userRating 
              ? 'Atualize sua avaliação desta receita' 
              : 'Compartilhe sua opinião sobre esta receita'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-3">Sua nota:</p>
            <div className="flex justify-center space-x-1">
              {renderStars(true)}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating} de 5 estrelas
              </p>
            )}
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Comentário (opcional)
            </label>
            <Textarea
              id="comment"
              placeholder="Conte o que achou da receita..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={submitRating}
              disabled={isLoading || rating === 0}
              className="flex-1 bg-fitcooker-orange hover:bg-fitcooker-orange/90"
            >
              {isLoading ? 'Enviando...' : userRating ? 'Atualizar' : 'Enviar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RateRecipeButton;
