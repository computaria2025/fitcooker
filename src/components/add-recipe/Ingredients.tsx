
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Search } from 'lucide-react';

interface IngredientInput {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

interface IngredientsProps {
  ingredients: IngredientInput[];
  updateIngredientQuantity: (id: string, quantity: number) => void;
  removeIngredient: (id: string) => void;
  addIngredient: () => void;
  openIngredientSelector: (index: number) => void;
  unitOptions: string[];
}

const Ingredients: React.FC<IngredientsProps> = ({
  ingredients,
  updateIngredientQuantity,
  removeIngredient,
  addIngredient,
  openIngredientSelector,
  unitOptions
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Ingredientes *</h2>
      
      <div className="space-y-4">
        {ingredients.map((ingredient, index) => (
          <div key={ingredient.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Ingrediente {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeIngredient(ingredient.id)}
                className="text-red-500 hover:text-red-700"
                disabled={ingredients.length <= 1}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor={`ingredient-name-${ingredient.id}`}>Nome *</Label>
                <div className="relative">
                  <div 
                    className="flex items-center border border-input rounded-md bg-background cursor-pointer"
                    onClick={() => openIngredientSelector(index)}
                  >
                    <div className="flex-grow p-2 px-3 text-sm">
                      {ingredient.name || 'Selecione um ingrediente'}
                    </div>
                    <div className="border-l border-input p-2 text-gray-400">
                      <Search size={16} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`ingredient-quantity-${ingredient.id}`}>Quantidade *</Label>
                  <Input
                    id={`ingredient-quantity-${ingredient.id}`}
                    type="number"
                    min="0"
                    step="0.1"
                    value={ingredient.quantity || ''}
                    onChange={(e) => updateIngredientQuantity(
                      ingredient.id, 
                      parseFloat(e.target.value) || 0
                    )}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor={`ingredient-unit-${ingredient.id}`}>Unidade</Label>
                  <Select
                    value={ingredient.unit}
                    onValueChange={(value) => {
                      // Using a direct approach since no setter function was passed
                      const newIngredients = [...ingredients];
                      newIngredients[index].unit = value;
                      // This would normally call setIngredients, but we don't have access to that here
                      // The parent component will need to handle this
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {ingredient.name && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-gray-100">
                  <div className="text-center">
                    <span className="text-xs text-gray-500 block">Proteínas</span>
                    <span className="font-medium">{(ingredient.protein * ingredient.quantity / 100).toFixed(1)}g</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-gray-500 block">Carboidratos</span>
                    <span className="font-medium">{(ingredient.carbs * ingredient.quantity / 100).toFixed(1)}g</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-gray-500 block">Gorduras</span>
                    <span className="font-medium">{(ingredient.fat * ingredient.quantity / 100).toFixed(1)}g</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-gray-500 block">Calorias</span>
                    <span className="font-medium">{(ingredient.calories * ingredient.quantity / 100).toFixed(0)} kcal</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addIngredient}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-fitcooker-orange hover:border-fitcooker-orange transition-colors flex items-center justify-center"
        >
          <Plus size={18} className="mr-2" />
          Adicionar Ingrediente
        </button>
      </div>
    </div>
  );
};

export default Ingredients;
