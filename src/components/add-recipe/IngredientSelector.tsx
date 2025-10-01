import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Check, X, Loader2 } from 'lucide-react';
import { useUSDAIngredients } from '@/hooks/useUSDAIngredients';
import { useOFFIngredients } from '@/hooks/useOFFIngredients';

interface ProcessedIngredient {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
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
  setNewIngredientName
}) => {
  const { searchUSDAIngredients, addCustomIngredient, isLoading: isLoadingUSDA } = useUSDAIngredients();
  const { searchOFFIngredients, isLoading: isLoadingOFF } = useOFFIngredients();

  const [searchResults, setSearchResults] = useState<ProcessedIngredient[]>([]);
  const [source] = useState<'USDA' | 'OFF'>('USDA'); // alternar automaticamente
  const [calorias, setCalorias] = useState<string>('0');
  const [proteinas, setProteinas] = useState<string>('0');
  const [carboidratos, setCarboidratos] = useState<string>('0');
  const [gorduras, setGorduras] = useState<string>('0');
  const [fibras, setFibras] = useState<string>('0');
  const [sodio, setSodio] = useState<string>('0');
  const [unidadePadrao, setUnidadePadrao] = useState<string>('g');

  const isLoading = isLoadingUSDA || isLoadingOFF;

  // Debounce da busca
  useEffect(() => {
    if (ingredientSearchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const [usdaResults, offResults] = await Promise.all([
          searchUSDAIngredients(ingredientSearchTerm),
          searchOFFIngredients(ingredientSearchTerm)
        ]);
        setSearchResults([...usdaResults, ...offResults]);
      } catch (error) {
        console.error("Erro ao buscar ingredientes:", error);
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [ingredientSearchTerm]);

  // Reset campos ao abrir o formulário
  useEffect(() => {
    if (showAddIngredientForm) {
      setCalorias('0');
      setProteinas('0');
      setCarboidratos('0');
      setGorduras('0');
      setFibras('0');
      setSodio('0');
      setUnidadePadrao('g');
    }
  }, [showAddIngredientForm]);

  const handleCustomIngredientSubmit = async () => {
    if (!newIngredientName.trim()) return;

    const newIngredientData: ProcessedIngredient = {
      name: newIngredientName.trim(),
      calories: parseFloat(calorias) || 0,
      protein: parseFloat(proteinas) || 0,
      carbs: parseFloat(carboidratos) || 0,
      fat: parseFloat(gorduras) || 0,
      fiber: parseFloat(fibras) || 0,
      sodium: parseFloat(sodio) || 0,
      unit: unidadePadrao || 'g',
    };

    const newIngredient = await addCustomIngredient(newIngredientData);
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
            Busque ingredientes na USDA e OpenFoodFacts automaticamente, ou adicione personalizados.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Buscar ingrediente..."
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
                      P: {Number(ingredient.protein || 0).toFixed(1)}g | C: {Number(ingredient.carbs || 0).toFixed(1)}g | G: {Number(ingredient.fat || 0).toFixed(1)}g  F: {Number(ingredient.fiber || 0).toFixed(1)}g  S: {Number(ingredient.sodium || 0).toFixed(1)}g
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">{Number(ingredient.calories || 0).toFixed(0)} kcal/100g</span>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Calorias por 100g" value={calorias} setValue={setCalorias} placeholder="kcal" />
                <InputField label="Proteínas por 100g" value={proteinas} setValue={setProteinas} placeholder="g" />
                <InputField label="Carboidratos por 100g" value={carboidratos} setValue={setCarboidratos} placeholder="g" />
                <InputField label="Gorduras por 100g" value={gorduras} setValue={setGorduras} placeholder="g" />
                <InputField label="Fibras por 100g" value={fibras} setValue={setFibras} placeholder="g" />
                <InputField label="Sódio por 100g" value={sodio} setValue={setSodio} placeholder="mg" />
                <InputField label="Unidade padrão" value={unidadePadrao} setValue={setUnidadePadrao} placeholder="g, ml, un" />
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

interface InputFieldProps {
  label: string;
  value: string;
  setValue: (v: string) => void;
  placeholder?: string;
}
const InputField: React.FC<InputFieldProps> = ({ label, value, setValue, placeholder }) => (
  <div>
    <Label>{label}</Label>
    <Input
      type="number"
      min="0"
      step="0.1"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="mt-1"
      placeholder={placeholder}
    />
  </div>
);

export default IngredientSelector;
