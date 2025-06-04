
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CategoryDialogProps {
  showNewCategoryDialog: boolean;
  setShowNewCategoryDialog: (show: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  handleAddNewCategory: () => void;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  showNewCategoryDialog,
  setShowNewCategoryDialog,
  newCategoryName,
  setNewCategoryName,
  handleAddNewCategory
}) => {
  return (
    <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sugerir Nova Categoria</DialogTitle>
          <DialogDescription>
            Sugira uma nova categoria que você acredita que seria útil para classificar receitas.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="newCategory">Nome da Categoria</Label>
          <Input
            id="newCategory"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Ex: Low Carb"
            className="mt-1"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddNewCategory}>Enviar Sugestão</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
