
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Check, X, Loader2 } from 'lucide-react';
import { useUSDAIngredients } from '@/hooks/useUSDAIngredients';

interface ProcessedIngredient {
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
  handleSelectIngredient: (index: number, ingredient: ProcessedIngredient) => void;
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
  handleSelectIngredient,
  currentIngredientIndex,
  showAddIngredientForm,
  setShowAddIngredientForm,
  newIngredientName,
  setNewIngredientName,
  handleAddCustomIngredient
}) => {
  const { searchUSDAIngredients, addCustomIngredient, isLoading } = useUSDAIngredients();
  const [searchResults, setSearchResults] = useState<ProcessedIngredient[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Buscar ingredientes quando o termo de busca mudar
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (ingredientSearchTerm.trim().length >= 2) {
      const timeout = setTimeout(async () => {
        const results = await searchUSDAIngredients(ingredientSearchTerm);
        setSearchResults(results);
      }, 500); // Debounce de 500ms
      
      setSearchTimeout(timeout);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [ingredientSearchTerm, searchUSDAIngredients]);

  const handleCustomIngredientSubmit = async () => {
    if (!newIngredientName.trim()) return;
    
    const newIngredient = await addCustomIngredient(newIngredientName);
    if (newIngredient) {
      handleSelectIngredient(currentIngredientIndex, newIngredient);
      setShowAddIngredientForm(false);
      setNewIngredientName('');
      setShowIngredientSelector(false);
    }
  };

  return (
    <Dialog open={showIngredientSelector} onOpenChange={setShowIngredientSelector}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Selecionar Ingrediente</DialogTitle>
          <DialogDescription>
            Busque ingredientes em nossa base de dados ou na API USDA. Você também pode adicionar ingredientes personalizados.
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
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={18} />
          )}
        </div>
        
        <div className="max-h-60 overflow-auto">
          {isLoading ? (
            <div className="py-6 text-center">
              <Loader2 className="animate-spin mx-auto mb-2" />
              <p className="text-gray-500">Buscando ingredientes...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-1">
              {searchResults.map((ingredient, index) => (
                <button
                  key={`${ingredient.name}-${index}`}
                  type="button"
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 rounded-md flex justify-between items-start border border-gray-100"
                  onClick={() => handleSelectIngredient(currentIngredientIndex, ingredient)}
                >
                  <div className="flex-1">
                    <span className="font-medium">{ingredient.name}</span>
                    <div className="text-xs text-gray-500 mt-1">
                      P: {ingredient.protein.toFixed(1)}g | C: {ingredient.carbs.toFixed(1)}g | G: {ingredient.fat.toFixed(1)}g
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">{ingredient.calories.toFixed(0)} kcal/100g</span>
                </button>
              ))}
            </div>
          ) : ingredientSearchTerm.trim().length >= 2 ? (
            <div className="py-6 text-center">
              <p className="text-gray-500">Nenhum ingrediente encontrado</p>
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-gray-500">Digite pelo menos 2 caracteres para buscar</p>
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
              Adicionar ingrediente personalizado
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
                  placeholder="Ex: Quinoa orgânica"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Você poderá adicionar os valores nutricionais após selecionar o ingrediente
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  onClick={handleCustomIngredientSubmit}
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
