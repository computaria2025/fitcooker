
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import RatingStars from '@/components/ui/RatingStars';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };
  
  const handleLoginRedirect = () => {
    toast({
      title: "Login necessário",
      description: "Faça login para avaliar receitas",
      variant: "destructive",
    });
    setIsOpen(false);
    // Redirect to login page after a short delay
    setTimeout(() => {
      navigate('/login', { state: { returnUrl: `/recipe/${recipeId}` } });
    }, 500);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      handleLoginRedirect();
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, dê uma nota para a receita.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically send the data to your backend
    console.log({
      recipeId,
      rating,
      comment,
      timestamp: new Date(),
    });
    
    toast({
      title: "Avaliação enviada!",
      description: `Você deu ${rating} estrelas para ${recipeName}. Obrigado pelo feedback!`,
    });
    
    // Reset form and close dialog
    setRating(0);
    setComment('');
    setIsOpen(false);
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
            Avalie Esta Receita
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-black text-white hover:bg-fitcooker-orange hover:text-white transition-all duration-300"
          >
            <Star className="w-4 h-4" />
            Avaliar Receita
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Avaliar Receita</DialogTitle>
          <DialogDescription>
            Sua avaliação ajuda outros usuários a encontrar receitas de qualidade.
          </DialogDescription>
        </DialogHeader>
        
        {!isLoggedIn ? (
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
                <RatingStars 
                  initialRating={rating} 
                  onRatingChange={handleRatingChange} 
                  size="lg"
                />
              </div>
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
                className="w-full sm:w-auto bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white"
              >
                Enviar Avaliação
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RateRecipeForm;
