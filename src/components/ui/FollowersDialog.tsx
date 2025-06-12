
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, UserMinus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'followers' | 'following';
  data: any[];
  onFetch: () => void;
  onUpdate?: () => void;
}

const FollowersDialog: React.FC<FollowersDialogProps> = ({
  open,
  onOpenChange,
  type,
  data,
  onFetch,
  onUpdate
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      onFetch();
    }
  }, [open, onFetch]);

  const handleUnfollow = async (userId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('seguidores')
        .delete()
        .eq('seguidor_id', user.id)
        .eq('seguido_id', userId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Você parou de seguir este chef.",
      });

      // Refresh the data
      onFetch();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível parar de seguir este chef.",
        variant: "destructive",
      });
    }
  };

  const title = type === 'followers' ? 'Seguidores' : 'Seguindo';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {data.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {type === 'followers' ? 'Nenhum seguidor ainda' : 'Não está seguindo ninguém ainda'}
            </p>
          ) : (
            <div className="space-y-3">
              {data.map((item, index) => {
                const profile = type === 'followers' 
                  ? item.profiles || {} 
                  : item.profiles || {};
                
                const userId = type === 'followers' 
                  ? item.seguidor_id 
                  : item.seguido_id;
                
                return (
                  <div key={index} className="flex items-center justify-between space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={profile.avatar_url} />
                        <AvatarFallback>
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{profile.nome || 'Usuário'}</p>
                      </div>
                    </div>
                    
                    {type === 'following' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnfollow(userId)}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        <UserMinus className="w-4 h-4 mr-1" />
                        Deixar de seguir
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersDialog;
