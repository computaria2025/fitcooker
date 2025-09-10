import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import RatingStars from '@/components/ui/RatingStars';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCommentActions } from '@/hooks/useCommentActions';
import EditCommentDialog from '@/components/ui/EditCommentDialog';
import { ChefHat, MessageSquare, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Comment {
  id: number;
  nota: number;
  comentario: string | null;
  created_at: string;
  usuario_id: string;
  profiles: {
    nome: string;
    avatar_url: string | null;
  } | null;
}

interface CommentsDialogProps {
  recipeId: number;
  commentCount: number;
  trigger?: React.ReactNode;
  onCommentsUpdate?: () => void;
}

export const CommentsDialog: React.FC<CommentsDialogProps> = ({ 
  recipeId, 
  commentCount, 
  trigger,
  onCommentsUpdate 
}) => {
  const { user } = useAuth();
  const { deleteComment, isLoading: isDeletingComment } = useCommentActions();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchComments = async () => {
    if (!open) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          id,
          nota,
          comentario,
          created_at,
          usuario_id,
          profiles(nome, avatar_url)
        `)
        .eq('receita_id', recipeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const success = await deleteComment(commentId);
    if (success) {
      fetchComments();
      onCommentsUpdate?.();
    }
  };

  const handleCommentUpdated = () => {
    fetchComments();
    onCommentsUpdate?.();
  };

  useEffect(() => {
    fetchComments();
  }, [open, recipeId]);

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <MessageSquare className="w-4 h-4 mr-2" />
      Ver todos ({commentCount})
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-fitcooker-orange" />
            <span>Avaliações e Comentários ({commentCount})</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitcooker-orange mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando comentários...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum comentário ainda</p>
            </div>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="border-l-4 border-l-fitcooker-orange/30">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={comment.profiles?.avatar_url || ''} />
                      <AvatarFallback className="bg-fitcooker-orange text-white">
                        {comment.profiles?.nome?.[0] || <ChefHat className="w-6 h-6" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-gray-900">
                            {comment.profiles?.nome || 'Usuário Anônimo'}
                          </span>
                          <RatingStars initialRating={comment.nota} readOnly size="sm" />
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        {/* Action buttons for comment owner */}
                        {user && user.id === comment.usuario_id && (
                          <div className="flex items-center space-x-1">
                            <EditCommentDialog 
                              comment={comment}
                              onCommentUpdated={handleCommentUpdated}
                            />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-600 hover:text-red-600"
                                  disabled={isDeletingComment}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir comentário</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                      {comment.comentario && (
                        <p className="text-gray-700 leading-relaxed">
                          {comment.comentario}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;