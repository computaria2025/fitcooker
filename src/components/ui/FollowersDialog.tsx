
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'followers' | 'following';
  data: any[];
  onFetch: () => void;
}

const FollowersDialog: React.FC<FollowersDialogProps> = ({
  open,
  onOpenChange,
  type,
  data,
  onFetch
}) => {
  useEffect(() => {
    if (open) {
      onFetch();
    }
  }, [open, onFetch]);

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
                
                return (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
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
