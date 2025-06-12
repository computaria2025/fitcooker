
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader
} from '@/components/ui/dialog';
import { Search, X, Flame, History, Star, TrendingUp, ChefHat, Users } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [chefResults, setChefResults] = useState<any[]>([]);
  const [ingredientResults, setIngredientResults] = useState<any[]>([]);
  const [categoryResults, setCategoryResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const navigate = useNavigate();
  const { data: recipes } = useRecipes();
  const { data: categories } = useCategories();

  const popularSearches = [
    { text: 'Proteico', icon: <Flame className="w-3 h-3 text-fitcooker-orange" />, type: 'category' },
    { text: 'Café da Manhã', icon: <Star className="w-3 h-3 text-fitcooker-orange" />, type: 'category' },
    { text: 'Low Carb', icon: <TrendingUp className="w-3 h-3 text-fitcooker-orange" />, type: 'category' },
    { text: 'Vegetariano', icon: <Star className="w-3 h-3 text-fitcooker-orange" />, type: 'category' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const searchAll = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setChefResults([]);
      setIngredientResults([]);
      setCategoryResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Search recipes
      const recipeResults = recipes?.filter(recipe => 
        recipe.titulo.toLowerCase().includes(term.toLowerCase()) ||
        recipe.descricao.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 5) || [];

      // Search categories
      const catResults = categories?.filter(category =>
        category.nome.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 3) || [];

      // Search chefs
      const { data: chefs } = await supabase
        .from('profiles')
        .select('id, nome, avatar_url, is_chef')
        .ilike('nome', `%${term}%`)
        .limit(3);

      // Search ingredients
      const { data: ingredients } = await supabase
        .from('ingredientes')
        .select('nome')
        .ilike('nome', `%${term}%`)
        .limit(3);

      setSearchResults(recipeResults);
      setChefResults(chefs || []);
      setIngredientResults(ingredients || []);
      setCategoryResults(catResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchAll(searchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, recipes, categories]);
  
  const handleResultClick = (type: string, id: string | number, term?: string) => {
    if (term) saveRecentSearch(term);
    onOpenChange(false);
    
    switch (type) {
      case 'recipe':
        navigate(`/recipe/${id}`);
        break;
      case 'chef':
        navigate(`/cook/${id}`);
        break;
      case 'category':
        navigate(`/recipes?category=${term}`);
        break;
      case 'ingredient':
        navigate(`/recipes?search=${term}`);
        break;
      default:
        navigate(`/recipes?search=${term}`);
    }
  };

  const handlePopularSearchClick = (item: any) => {
    setSearchTerm(item.text);
    saveRecentSearch(item.text);
  };

  const removeRecentSearch = (term: string) => {
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-4xl w-[95vw] p-0 bg-white/95 backdrop-blur-md border-0 shadow-2xl"
        onEscapeKeyDown={() => onOpenChange(false)} 
        onPointerDownOutside={() => onOpenChange(false)}
      >
        <DialogHeader className="border-b border-gray-100 p-6">
          <div className="relative">
            <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 hover:from-white hover:to-white focus-within:from-white focus-within:to-white focus-within:ring-2 focus-within:ring-fitcooker-orange focus-within:shadow-lg transition-all rounded-xl px-6 py-4">
              <Search className="text-fitcooker-orange mr-3 flex-shrink-0" size={24} />
              <input
                type="text"
                placeholder="Buscar receitas, chefs, ingredientes, categorias..."
                className="bg-transparent border-0 outline-none flex-grow text-lg focus:ring-0 placeholder:text-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchTerm && (
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-6 px-6 max-h-[70vh] overflow-y-auto">
          {!searchTerm.trim() ? (
            <div className="space-y-8">
              {/* Popular Searches */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Pesquisas Populares</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {popularSearches.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start p-4 h-auto border-gray-200 hover:border-fitcooker-orange hover:bg-fitcooker-orange/5"
                        onClick={() => handlePopularSearchClick(item)}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span className="font-medium">{item.text}</span>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Pesquisas Recentes</h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer group"
                        onClick={() => handleResultClick('search', '', search)}
                      >
                        <div className="flex items-center space-x-3">
                          <History size={16} className="text-gray-400 group-hover:text-fitcooker-orange transition-colors" />
                          <span className="group-hover:text-fitcooker-orange transition-colors">{search}</span>
                        </div>
                        <button 
                          className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(search);
                          }}
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fitcooker-orange mx-auto"></div>
                  <p className="text-gray-500 mt-2">Buscando...</p>
                </div>
              ) : (
                <>
                  {/* Recipe Results */}
                  {searchResults.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">
                        Receitas ({searchResults.length})
                      </h3>
                      <div className="space-y-3">
                        {searchResults.map((recipe) => (
                          <motion.div 
                            key={recipe.id}
                            whileHover={{ scale: 1.01 }}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-fitcooker-orange/20"
                            onClick={() => handleResultClick('recipe', recipe.id, searchTerm)}
                          >
                            <img 
                              src={recipe.imageUrl} 
                              alt={recipe.title}
                              className="w-16 h-16 rounded-lg object-cover shadow-sm"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{recipe.title}</h4>
                              <p className="text-sm text-gray-600 line-clamp-1">{recipe.description}</p>
                              <div className="flex gap-2 mt-2">
                                {recipe.categories?.slice(0, 2).map((category: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chef Results */}
                  {chefResults.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">
                        Chefs ({chefResults.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {chefResults.map((chef) => (
                          <motion.div 
                            key={chef.id}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-fitcooker-orange/20"
                            onClick={() => handleResultClick('chef', chef.id, searchTerm)}
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-fitcooker-orange to-orange-500 flex items-center justify-center text-white font-bold">
                              {chef.avatar_url ? (
                                <img src={chef.avatar_url} alt={chef.nome} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <ChefHat size={20} />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{chef.nome}</h4>
                              {chef.is_chef && (
                                <Badge variant="secondary" className="text-xs">
                                  Chef Verificado
                                </Badge>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Results */}
                  {categoryResults.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">
                        Categorias ({categoryResults.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {categoryResults.map((category) => (
                          <motion.div
                            key={category.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Badge 
                              variant="outline" 
                              className="cursor-pointer hover:bg-fitcooker-orange hover:text-white hover:border-fitcooker-orange transition-colors p-2"
                              onClick={() => handleResultClick('category', category.id, category.nome)}
                            >
                              {category.nome}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ingredient Results */}
                  {ingredientResults.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">
                        Ingredientes ({ingredientResults.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {ingredientResults.map((ingredient, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Badge 
                              variant="outline" 
                              className="cursor-pointer hover:bg-fitcooker-orange hover:text-white hover:border-fitcooker-orange transition-colors p-2"
                              onClick={() => handleResultClick('ingredient', index, ingredient.nome)}
                            >
                              {ingredient.nome}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {searchResults.length === 0 && chefResults.length === 0 && categoryResults.length === 0 && ingredientResults.length === 0 && !isSearching && (
                    <div className="text-center py-12">
                      <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                      <p className="text-gray-500 mb-6">Não encontramos nada para "{searchTerm}"</p>
                      <Button 
                        onClick={() => handleResultClick('search', '', searchTerm)}
                        className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                      >
                        Buscar mesmo assim
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
