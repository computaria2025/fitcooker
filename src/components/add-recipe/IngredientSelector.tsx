import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Check, X, Loader2 } from 'lucide-react';
import { useUSDAIngredients } from '@/hooks/useUSDAIngredients';

interface ProcessedIngredient {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibers: number;
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

  // Estados novos para dados nutricionais e unidade
  const [calorias, setCalorias] = useState<string>('0');
  const [proteinas, setProteinas] = useState<string>('0');
  const [carboidratos, setCarboidratos] = useState<string>('0');
  const [gorduras, setGorduras] = useState<string>('0');
  const [fibras, setFibras] = useState<string>('0');
  const [sodio, setSodio] = useState<string>('0');
  const [unidadePadrao, setUnidadePadrao] = useState<string>('g');

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

  // Limpar os campos nutricionais e nome quando abrir o formulário
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

    // Montar objeto com valores numéricos convertidos
    const newIngredientData : ProcessedIngredient = {
      name: newIngredientName.trim(),
      calories: parseFloat(calorias) || 0,
      protein: parseFloat(proteinas) || 0,
      carbs: parseFloat(carboidratos) || 0,
      fat: parseFloat(gorduras) || 0,
      fibers: parseFloat(fibras) || 0,
      sodium: parseFloat(sodio) || 0,
      unit: unidadePadrao || 'g',
    };

    // Submeter para o backend (via hook ou função addCustomIngredient)
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

              {/* NOVOS CAMPOS NUTRICIONAIS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calorias">Calorias por 100g</Label>
                  <Input
                    id="calorias"
                    type="number"
                    min="0"
                    step="0.1"
                    value={calorias}
                    onChange={(e) => setCalorias(e.target.value)}
                    className="mt-1"
                    placeholder="kcal"
                  />
                </div>
                <div>
                  <Label htmlFor="proteinas">Proteínas por 100g</Label>
                  <Input
                    id="proteinas"
                    type="number"
                    min="0"
                    step="0.1"
                    value={proteinas}
                    onChange={(e) => setProteinas(e.target.value)}
                    className="mt-1"
                    placeholder="g"
                  />
                </div>
                <div>
                  <Label htmlFor="carboidratos">Carboidratos por 100g</Label>
                  <Input
                    id="carboidratos"
                    type="number"
                    min="0"
                    step="0.1"
                    value={carboidratos}
                    onChange={(e) => setCarboidratos(e.target.value)}
                    className="mt-1"
                    placeholder="g"
                  />
                </div>
                <div>
                  <Label htmlFor="gorduras">Gorduras por 100g</Label>
                  <Input
                    id="gorduras"
                    type="number"
                    min="0"
                    step="0.1"
                    value={gorduras}
                    onChange={(e) => setGorduras(e.target.value)}
                    className="mt-1"
                    placeholder="g"
                  />
                </div>
                <div>
                  <Label htmlFor="fibras">Fibras por 100g</Label>
                  <Input
                    id="fibras"
                    type="number"
                    min="0"
                    step="0.1"
                    value={fibras}
                    onChange={(e) => setFibras(e.target.value)}
                    className="mt-1"
                    placeholder="g"
                  />
                </div>
                <div>
                  <Label htmlFor="sodio">Sódio por 100g</Label>
                  <Input
                    id="sodio"
                    type="number"
                    min="0"
                    step="0.1"
                    value={sodio}
                    onChange={(e) => setSodio(e.target.value)}
                    className="mt-1"
                    placeholder="mg"
                  />
                </div>
                <div>
                  <Label htmlFor="unidadePadrao">Unidade padrão</Label>
                  <Input
                    id="unidadePadrao"
                    value={unidadePadrao}
                    onChange={(e) => setUnidadePadrao(e.target.value)}
                    className="mt-1"
                    placeholder="Ex: g, ml, un"
                  />
                </div>
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
