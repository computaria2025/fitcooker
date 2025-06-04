
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Star, AlertCircle } from 'lucide-react';
import { useRatings } from '@/hooks/useRatings';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface RateRecipeFormProps {
  recipeId: string;
  recipeName: string;
  isLoggedIn?: boolean;
  prominentDisplay?: boolean;
}

const RateRecipeForm: React.FC<RateRecipeFormProps> = ({ 
  recipeId, 
  recipeName, 
  isLoggedIn = false,
  prominentDisplay = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addRating, getUserRating, loading } = useRatings();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [existingRating, setExistingRating] = useState<any>(null);
  const [hoveredStar, setHoveredStar] = useState(0);
  
  useEffect(() => {
    const loadUserRating = async () => {
      if (user && recipeId) {
        const userRating = await getUserRating(parseInt(recipeId));
        if (userRating) {
          setExistingRating(userRating);
          setRating(userRating.nota);
          setComment(userRating.comentario || '');
        }
      }
    };

    loadUserRating();
  }, [user, recipeId, getUserRating]);
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };
  
  const handleLoginRedirect = () => {
    toast.error('Faça login para avaliar receitas');
    setIsOpen(false);
    setTimeout(() => {
      navigate('/login', { state: { returnUrl: `/recipe/${recipeId}` } });
    }, 500);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      handleLoginRedirect();
      return;
    }
    
    if (rating === 0) {
      toast.error('Por favor, dê uma nota para a receita.');
      return;
    }
    
    const { error } = await addRating(parseInt(recipeId), rating, comment);
    
    if (!error) {
      setIsOpen(false);
      // Reload the page to show updated rating
      window.location.reload();
    }
  };

  const renderStars = () => {
    return (
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => handleRatingChange(star)}
          >
            <Star
              size={32}
              className={`transition-colors ${
                star <= (hoveredStar || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {prominentDisplay ? (
          <Button
            variant="default"
            className="bg-black hover:bg-fitcooker-orange text-white flex items-center gap-2 w-full md:w-auto text-center justify-center shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1"
            size="lg"
          >
            <Star className="w-5 h-5 fill-white" />
            {existingRating ? 'Atualizar Avaliação' : 'Avalie Esta Receita'}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-black text-white hover:bg-fitcooker-orange hover:text-white transition-all duration-300"
          >
            <Star className="w-4 h-4" />
            {existingRating ? 'Editar Avaliação' : 'Avaliar Receita'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {existingRating ? 'Atualizar Avaliação' : 'Avaliar Receita'}
          </DialogTitle>
          <DialogDescription>
            {existingRating 
              ? 'Atualize sua avaliação para esta receita.'
              : 'Sua avaliação ajuda outros usuários a encontrar receitas de qualidade.'
            }
          </DialogDescription>
        </DialogHeader>
        
        {!user ? (
          <div className="p-4 bg-amber-50 text-amber-700 rounded-lg flex items-start gap-3 my-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold">Login Necessário</h4>
              <p className="text-sm mt-1">Você precisa estar logado para avaliar receitas.</p>
              <div className="mt-4 flex gap-3">
                <Button 
                  variant="default" 
                  onClick={handleLoginRedirect}
                >
                  Fazer Login
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="flex flex-col items-center">
              <p className="text-center mb-3 text-lg">O que você achou de <span className="font-medium text-fitcooker-orange">{recipeName}</span>?</p>
              <div className="bg-gray-50 p-4 rounded-lg w-full flex justify-center">
                {renderStars()}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {rating === 1 && 'Muito ruim'}
                  {rating === 2 && 'Ruim'}
                  {rating === 3 && 'Regular'}
                  {rating === 4 && 'Bom'}
                  {rating === 5 && 'Excelente'}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Comentário (opcional)
              </label>
              <Textarea
                id="comment"
                placeholder="Compartilhe sua experiência com essa receita..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none focus:ring-fitcooker-orange focus:border-fitcooker-orange"
                rows={4}
              />
            </div>
            
            <DialogFooter className="pt-2">
              <Button 
                type="submit"
                disabled={loading || rating === 0}
                className="w-full sm:w-auto bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white"
              >
                {loading ? 'Enviando...' : (existingRating ? 'Atualizar Avaliação' : 'Enviar Avaliação')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RateRecipeForm;
