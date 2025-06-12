import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame, Check, AlertCircle, Utensils } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface RecipePreviewProps {
  title: string;
  description: string;
  selectedCategories: string[];
  preparationTime: string;
  servings: string;
  difficulty: string;
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  getMainImagePreview: () => string | null;
  isRecipeValid: boolean;
  checkLoginBeforeSubmit: (e: React.FormEvent) => void;
  ingredientsCount: number;
  stepsCount: number;
  validationProgress: number;
  validationItems: {
    title: string;
    isValid: boolean;
  }[];
  isSubmitting: boolean;
  categories: any[];
}

const RecipePreview: React.FC<RecipePreviewProps> = ({
  title,
  description,
  selectedCategories,
  preparationTime,
  servings,
  difficulty,
  totalMacros,
  getMainImagePreview,
  isRecipeValid,
  checkLoginBeforeSubmit,
  ingredientsCount,
  stepsCount,
  validationProgress,
  validationItems,
  isSubmitting,
  categories
}) => {
  const previewTitle = title || 'Nome da sua receita';
  const previewDesc = description || 'Descrição da sua receita, conte uma pequena história ou dê dicas sobre o prato.';

  // Macro percentage calculations based on standard daily values
  const proteinPercentage = Math.min(Math.round((totalMacros.protein || 0) / 50 * 100), 100);
  const carbsPercentage = Math.min(Math.round((totalMacros.carbs || 0) / 300 * 100), 100);
  const fatPercentage = Math.min(Math.round((totalMacros.fat || 0) / 70 * 100), 100);

  return (
    <div className="bg-white rounded-xl shadow-lg sticky top-24 overflow-hidden">
      <div className="aspect-[16/9] bg-gray-200 w-full overflow-hidden relative">
        {getMainImagePreview() ? (
          <img 
            src={getMainImagePreview() || ''} 
            alt="Prévia da receita" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <span className="text-sm">Prévia da imagem aparecerá aqui</span>
            <span className="text-xs mt-1">Adicione uma imagem para visualizar</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{previewTitle}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{previewDesc}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {selectedCategories.length > 0 ? (
            selectedCategories.map((categoryId) => {
              const category = categories.find(c => c.id.toString() === categoryId);
              return (
                <Badge key={categoryId} variant="secondary">{category?.nome}</Badge>
              );
            })
          ) : (
            <Badge variant="outline">Selecione categorias</Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <Clock className="w-5 h-5 mx-auto text-fitcooker-orange" />
            <p className="text-xs mt-1">Tempo</p>
            <p className="font-medium text-sm">{preparationTime ? `${preparationTime} min` : '--'}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <Utensils className="w-5 h-5 mx-auto text-fitcooker-orange" />
            <p className="text-xs mt-1">Porções</p>
            <p className="font-medium text-sm">{servings || '--'}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <Flame className="w-5 h-5 mx-auto text-fitcooker-orange" />
            <p className="text-xs mt-1">Dificuldade</p>
            <p className="font-medium text-sm">{difficulty || '--'}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md space-y-4">
          <h4 className="font-medium">Informação nutricional (por porção)</h4>
          
          <div className="text-center mb-3">
            <span className="text-2xl font-bold text-fitcooker-orange">{Math.round(totalMacros.calories || 0)}</span>
            <span className="text-sm text-gray-500 ml-1">kcal</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Proteínas</span>
                <span className="text-sm font-medium">{Math.round(totalMacros.protein || 0)}g</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${proteinPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Carboidratos</span>
                <span className="text-sm font-medium">{Math.round(totalMacros.carbs || 0)}g</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${carbsPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Gorduras</span>
                <span className="text-sm font-medium">{Math.round(totalMacros.fat || 0)}g</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full" 
                  style={{ width: `${fatPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Ingredientes</p>
            <span className="text-sm font-medium">{ingredientsCount}</span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-medium">Passos</p>
            <span className="text-sm font-medium">{stepsCount}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Progresso</h4>
            <span className="text-xs font-medium">{validationProgress}%</span>
          </div>
          <Progress value={validationProgress} className="h-2" />
          
          <div className="space-y-1 mt-2">
            {validationItems.map((item, index) => (
              <div key={index} className="flex items-center text-xs">
                {item.isValid ? (
                  <Check className="w-3 h-3 text-green-500 mr-1.5" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-gray-400 mr-1.5" />
                )}
                <span className={item.isValid ? 'text-green-700' : 'text-gray-500'}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {isRecipeValid ? (
          <Button 
            type="button" 
            className="w-full bg-fitcooker-orange hover:bg-fitcooker-orange/90 px-6 py-4 h-auto"
            onClick={checkLoginBeforeSubmit}
            disabled={isSubmitting}
          >
            <Check className="mr-2 h-5 w-5" />
            {isSubmitting ? "Publicando..." : "Publicar Receita"}
          </Button>
        ) : (
          <Button 
            type="button" 
            className="w-full bg-gray-300 hover:bg-gray-400 cursor-not-allowed px-6 py-4 h-auto"
            disabled
          >
            <AlertCircle className="mr-2 h-5 w-5" />
            Complete Todos os Campos
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipePreview;
