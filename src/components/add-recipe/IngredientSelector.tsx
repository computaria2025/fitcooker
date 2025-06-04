
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Check, X } from 'lucide-react';

interface IngredientDatabase {
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  unit: string;
}

interface IngredientSelectorProps {
  showIngredientSelector: boolean;
  setShowIngredientSelector: (show: boolean) => void;
  ingredientSearchTerm: string;
  setIngredientSearchTerm: (term: string) => void;
  filteredIngredients: IngredientDatabase[];
  handleSelectIngredient: (index: number, ingredient: IngredientDatabase) => void;
  currentIngredientIndex: number;
  showAddIngredientForm: boolean;
  setShowAddIngredientForm: (show: boolean) => void;
  newIngredientName: string;
  setNewIngredientName: (name: string) => void;
  handleAddCustomIngredient: () => void;
}

const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  showIngredientSelector,
  setShowIngredientSelector,
  ingredientSearchTerm,
  setIngredientSearchTerm,
  filteredIngredients,
  handleSelectIngredient,
  currentIngredientIndex,
  showAddIngredientForm,
  setShowAddIngredientForm,
  newIngredientName,
  setNewIngredientName,
  handleAddCustomIngredient
}) => {
  return (
    <Dialog open={showIngredientSelector} onOpenChange={setShowIngredientSelector}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Selecionar Ingrediente</DialogTitle>
          <DialogDescription>
            Escolha um ingrediente da nossa base de dados ou adicione um novo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar ingrediente..."
            className="pl-10"
            value={ingredientSearchTerm}
            onChange={(e) => setIngredientSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="max-h-60 overflow-auto">
          {filteredIngredients.length > 0 ? (
            <div className="space-y-1">
              {filteredIngredients.map((ing) => (
                <button
                  key={ing.name}
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md flex justify-between"
                  onClick={() => handleSelectIngredient(currentIngredientIndex, ing)}
                >
                  <span>{ing.name}</span>
                  <span className="text-gray-500">{ing.calories} kcal/100{ing.unit}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-gray-500">Nenhum ingrediente encontrado</p>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4 mt-2">
          {!showAddIngredientForm ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowAddIngredientForm(true);
                setNewIngredientName(ingredientSearchTerm);
              }}
            >
              <Plus size={16} className="mr-2" />
              Adicionar novo ingrediente
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="newIngredientName">Nome do ingrediente</Label>
                <Input
                  id="newIngredientName"
                  value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  className="mt-1"
                  placeholder="Ex: Quinoa"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  onClick={handleAddCustomIngredient}
                  className="flex-1"
                  disabled={!newIngredientName.trim()}
                >
                  <Check size={16} className="mr-2" />
                  Adicionar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddIngredientForm(false)}
                  className="flex-1"
                >
                  <X size={16} className="mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientSelector;
