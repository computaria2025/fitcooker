
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface BasicInformationProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  preparationTime: string;
  setPreparationTime: (value: string) => void;
  servings: string;
  setServings: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  showNewCategoryDialog: boolean;
  setShowNewCategoryDialog: (show: boolean) => void;
  servingsOptions: string[];
  difficultyOptions: string[];
  categories: any[];
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  preparationTime,
  setPreparationTime,
  servings,
  setServings,
  difficulty,
  setDifficulty,
  selectedCategories,
  toggleCategory,
  showNewCategoryDialog,
  setShowNewCategoryDialog,
  servingsOptions,
  difficultyOptions,
  categories
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Informações Básicas *</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block font-medium mb-1">Título da Receita *</label>
          <Input
            id="title"
            placeholder="Ex: Bowl de Proteína com Legumes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block font-medium mb-1">Descrição *</label>
          <Textarea
            id="description"
            placeholder="Descreva sua receita em poucas palavras..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full resize-none"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="preparationTime" className="block font-medium mb-1">Tempo de Preparo (min) *</label>
            <Input
              id="preparationTime"
              type="number"
              placeholder="Minutos"
              value={preparationTime}
              onChange={(e) => setPreparationTime(e.target.value)}
              min="1"
              className="w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="servings" className="block font-medium mb-1">Porções *</label>
            <Select value={servings} onValueChange={setServings}>
              <SelectTrigger id="servings" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {servingsOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="difficulty" className="block font-medium mb-1">Dificuldade *</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="block font-medium mb-1">Categorias *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id.toString())}
                className={`
                  transition-all duration-200 rounded-full px-4 py-2.5 flex items-center justify-center text-sm
                  ${selectedCategories.includes(category.id.toString())
                    ? 'bg-fitcooker-orange text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
                `}
              >
                {category.nome}
              </button>
            ))}
          </div>
          
          <div className="mt-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowNewCategoryDialog(true)}
              className="text-sm flex items-center gap-1"
            >
              <Plus size={16} />
              <span>Sugerir categoria</span>
            </Button>
          </div>
          
          {selectedCategories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Categorias selecionadas:</p>
              <div className="flex flex-wrap gap-1">
                {selectedCategories.map((categoryId) => {
                  const category = categories.find(c => c.id.toString() === categoryId);
                  return (
                    <Badge key={categoryId} variant="secondary" className="px-3 py-1.5 text-sm">
                      {category?.nome}
                      <button 
                        type="button"
                        onClick={() => toggleCategory(categoryId)}
                        className="ml-1.5 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
