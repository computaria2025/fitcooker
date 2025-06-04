
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader
} from '@/components/ui/dialog';
import { Search, X, Flame, History, Star, TrendingUp } from 'lucide-react';
import { allRecipes } from '@/data/mockData';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularSearches = [
  { text: 'Proteico', icon: <Flame className="w-3 h-3 text-fitcooker-orange" /> },
  { text: 'Café da Manhã', icon: <Star className="w-3 h-3 text-fitcooker-orange" /> },
  { text: 'Low Carb', icon: <TrendingUp className="w-3 h-3 text-fitcooker-orange" /> },
  { text: 'Vegetariano', icon: <Star className="w-3 h-3 text-fitcooker-orange" /> },
];

const recentSearches = [
  'Bowl de proteína',
  'Salada de frango',
  'Panqueca proteica'
];

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allRecipes>([]);
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      const results = allRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  
  const handleRecipeClick = (id: number) => {
    onOpenChange(false);
    navigate(`/recipe/${id}`);
  };
  
  const handlePopularSearchClick = (term: string) => {
    setSearchTerm(term);
    const results = allRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(term.toLowerCase()) ||
      recipe.description.toLowerCase().includes(term.toLowerCase()) ||
      recipe.categories.some(category => category.toLowerCase() === term.toLowerCase())
    );
    
    setSearchResults(results);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-3xl w-[90vw] p-0 bg-white/95 backdrop-blur-md"
        onEscapeKeyDown={() => onOpenChange(false)} 
        onPointerDownOutside={() => onOpenChange(false)}
      >
        <DialogHeader className="border-b border-gray-100 p-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-gray-100 hover:bg-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-fitcooker-orange focus-within:shadow-md transition-all rounded-lg px-4 py-3">
              <Search className="text-gray-500 mr-2" size={20} />
              <input
                type="text"
                placeholder="Procurar receitas, categorias ou cozinheiros..."
                className="bg-transparent border-0 outline-none flex-grow text-lg focus:ring-0 placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchTerm && (
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>
        </DialogHeader>
        
        <div className="py-6 px-4 max-h-[80vh] overflow-y-auto">
          {!searchTerm.trim() ? (
            <>
              {/* Popular Searches */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 mb-4">PESQUISAS POPULARES</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="group hover:bg-fitcooker-orange/10 hover:border-fitcooker-orange/20"
                      onClick={() => handlePopularSearchClick(item.text)}
                    >
                      {item.icon}
                      <span className="ml-1">{item.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Recent Searches */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-4">PESQUISAS RECENTES</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                      onClick={() => handlePopularSearchClick(search)}
                    >
                      <div className="flex items-center">
                        <History size={16} className="text-gray-400 mr-3" />
                        <span>{search}</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-700 p-1">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500">RESULTADOS ({searchResults.length})</h3>
              {searchResults.map((recipe) => (
                <div 
                  key={recipe.id}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleRecipeClick(recipe.id)}
                >
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{recipe.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-1">{recipe.description}</p>
                    <div className="flex gap-1 mt-1">
                      {recipe.categories.slice(0, 2).map((category, i) => (
                        <Badge key={i} variant="category" className="text-xs py-0">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            searchTerm.trim() && (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhum resultado encontrado para "{searchTerm}"</p>
                <p className="text-sm text-gray-400 mt-2">Tente outra palavra-chave ou explore as categorias populares</p>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
