import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import RatingStars from '@/components/ui/RatingStars';
import { Edit2 } from 'lucide-react';
import { useCommentActions } from '@/hooks/useCommentActions';

interface EditCommentDialogProps {
  comment: {
    id: number;
    nota: number;
    comentario: string | null;
  };
  onCommentUpdated: () => void;
}

export const EditCommentDialog: React.FC<EditCommentDialogProps> = ({ 
  comment, 
  onCommentUpdated 
}) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(comment.nota);
  const [commentText, setCommentText] = useState(comment.comentario || '');
  const { editComment, isLoading } = useCommentActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) return;

    const success = await editComment(comment.id, commentText, rating);
    if (success) {
      setOpen(false);
      onCommentUpdated();
    }
  };

  const handleCancel = () => {
    setRating(comment.nota);
    setCommentText(comment.comentario || '');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
        >
          <Edit2 className="w-3 h-3 mr-1" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Avaliação</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-3">
            <label className="text-sm font-medium text-gray-700">Sua avaliação:</label>
            <RatingStars 
              initialRating={rating}
              onRatingChange={setRating}
              size="md"
            />
          </div>
          
          <div>
            <label htmlFor="edit-comment" className="block text-sm font-medium text-gray-700 mb-1">
              Comentário (opcional)
            </label>
            <Textarea
              id="edit-comment"
              placeholder="Compartilhe sua experiência com essa receita..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="resize-none focus:ring-fitcooker-orange focus:border-fitcooker-orange"
              rows={4}
            />
          </div>
          
          <div className="flex space-x-3 pt-2">
            <Button 
              type="submit"
              disabled={isLoading || rating === 0}
              className="bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white flex-1"
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommentDialog;