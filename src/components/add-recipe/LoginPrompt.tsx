
import React from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface LoginPromptProps {
  showLoginPrompt: boolean;
  setShowLoginPrompt: (show: boolean) => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({
  showLoginPrompt,
  setShowLoginPrompt
}) => {
  return (
    <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login Necessário</DialogTitle>
          <DialogDescription>
            Para publicar receitas, você precisa estar logado na plataforma.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setShowLoginPrompt(false)}>Cancelar</Button>
          <Button asChild>
            <Link to="/login">Fazer Login</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPrompt;
