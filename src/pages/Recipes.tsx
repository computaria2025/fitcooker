
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Users, Star, SlidersHorizontal, X } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useCategories } from '@/hooks/useCategories';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import RecipeCardSkeleton from '@/components/ui/RecipeCardSkeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const Recipes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [maxTime, setMaxTime] = useState<number>(180);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const { data: recipes, isLoading } = useRecipes();
  const { data: categories } = useCategories();

  const difficulties = ['Fácil', 'Médio', 'Difícil'];

  const filteredRecipes = recipes?.filter(recipe => {
    const matchesSearch = recipe.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
                           recipe.categories?.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    const matchesCategories = selectedCategories.length === 0 ||
                             selectedCategories.some(cat => 
                               recipe.categories?.some(recipeCategory => 
                                 recipeCategory.toLowerCase().includes(cat.toLowerCase())
                               )
                             );
    
    const matchesDifficulty = !selectedDifficulty || recipe.dificuldade === selectedDifficulty;
    const matchesTime = recipe.tempo_preparo <= maxTime;
    const matchesRating = recipe.nota_media >= minRating;

    return matchesSearch && matchesCategory && matchesCategories && matchesDifficulty && matchesTime && matchesRating;
  }) || [];

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedDifficulty('');
    setMaxTime(180);
    setMinRating(0);
    setSelectedCategories([]);
    setSearchTerm('');
  };

  const hasActiveFilters = selectedCategory || selectedDifficulty || maxTime < 180 || minRating > 0 || selectedCategories.length > 0 || searchTerm;

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-2">
        {/* Enhanced Hero Section with Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 text-white py-16 mb-8"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Descubra Receitas Incríveis
              </h1>
              <p className="text-orange-100 text-lg max-w-2xl mx-auto">
                Explore nossa coleção de receitas saudáveis e deliciosas
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6">
          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar receitas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-fitcooker-orange"
                  />
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-3 lg:flex-nowrap">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full lg:w-40 h-12">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.nome}>
                          {category.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-full lg:w-32 h-12">
                      <SelectValue placeholder="Dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {difficulties.map(difficulty => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-12 px-4 border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Time Filter */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">
                        Tempo máximo: {maxTime} min
                      </label>
                      <Slider
                        value={[maxTime]}
                        onValueChange={([value]) => setMaxTime(value)}
                        max={180}
                        min={10}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">
                        Avaliação mínima: {minRating}★
                      </label>
                      <Slider
                        value={[minRating]}
                        onValueChange={([value]) => setMinRating(value)}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    {/* Categories Filter */}
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">
                        Categorias específicas
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories?.slice(0, 8).map(category => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.nome}
                              checked={selectedCategories.includes(category.nome)}
                              onCheckedChange={() => toggleCategory(category.nome)}
                            />
                            <label htmlFor={category.nome} className="text-sm cursor-pointer">
                              {category.nome}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Filtros ativos:</span>
                  
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Busca: "{searchTerm}"
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                    </Badge>
                  )}
                  
                  {selectedCategory && selectedCategory !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {selectedCategory}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
                    </Badge>
                  )}
                  
                  {selectedDifficulty && selectedDifficulty !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {selectedDifficulty}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDifficulty('')} />
                    </Badge>
                  )}
                  
                  {selectedCategories.map(category => (
                    <Badge key={category} variant="secondary" className="flex items-center gap-1">
                      {category}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCategory(category)} />
                    </Badge>
                  ))}
                  
                  {maxTime < 180 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      ≤ {maxTime} min
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxTime(180)} />
                    </Badge>
                  )}
                  
                  {minRating > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      ≥ {minRating}★
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
                    </Badge>
                  )}
                  
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-fitcooker-orange">
                    Limpar todos
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Results Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm || hasActiveFilters 
                  ? `Resultados da busca (${filteredRecipes.length})` 
                  : `Todas as Receitas (${filteredRecipes.length})`
                }
              </h2>
            </div>
          </motion.div>

          {/* Recipes Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }, (_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index % 8) }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Nenhuma receita encontrada
                </h3>
                <p className="text-gray-600 text-lg mb-8">
                  Tente ajustar seus filtros ou buscar por outros termos
                </p>
                <Button onClick={clearFilters} className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
                  Limpar Filtros
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
