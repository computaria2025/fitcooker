
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChefHat } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useCategories } from '@/hooks/useCategories';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import RecipeCardSkeleton from '@/components/ui/RecipeCardSkeleton';
import RecipeFilters from '@/components/recipes/RecipeFilters';
import SectionTitle from '@/components/ui/SectionTitle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Recipes: React.FC = () => {
  const { data: recipes, loading } = useRecipes();
  const { data: categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [timeRange, setTimeRange] = useState([5, 180]);
  const [servingsRange, setServingsRange] = useState([1, 12]);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      recipe.categories.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    const matchesDifficulty = selectedDifficulty === 'all' || 
      recipe.dificuldade.toLowerCase() === selectedDifficulty.toLowerCase();
    
    const matchesTime = recipe.tempo_preparo >= timeRange[0] && recipe.tempo_preparo <= timeRange[1];
    
    const matchesServings = recipe.porcoes >= servingsRange[0] && recipe.porcoes <= servingsRange[1];

    return matchesSearch && matchesCategory && matchesDifficulty && matchesTime && matchesServings;
  });

  // Sort filtered recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'rating':
        return (b.nota_media || 0) - (a.nota_media || 0);
      case 'time':
        return a.tempo_preparo - b.tempo_preparo;
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSortBy('newest');
    setTimeRange([5, 180]);
    setServingsRange([1, 12]);
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || selectedDifficulty !== 'all' || 
    timeRange[0] !== 5 || timeRange[1] !== 180 || servingsRange[0] !== 1 || servingsRange[1] !== 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-12 pt-40">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle 
            title="Receitas Deliciosas"
            subtitle="Descubra pratos incríveis criados pela nossa comunidade de chefs apaixonados"
          />

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar receitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-fitcooker-orange focus:ring-fitcooker-orange"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            {/* Mobile Filter Button */}
            <div className="md:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full h-12 border-gray-200">
                    <Filter className="w-5 h-5 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <RecipeFilters 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedDifficulty={selectedDifficulty}
                    setSelectedDifficulty={setSelectedDifficulty}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    categories={categories}
                    clearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                    servingsRange={servingsRange}
                    setServingsRange={setServingsRange}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:block">
              <RecipeFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedDifficulty={selectedDifficulty}
                setSelectedDifficulty={setSelectedDifficulty}
                sortBy={sortBy}
                setSortBy={setSortBy}
                categories={categories}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                servingsRange={servingsRange}
                setServingsRange={setServingsRange}
              />
            </div>
          </div>

          {/* Recipes Grid */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <RecipeCardSkeleton key={index} />
                ))}
              </div>
            ) : sortedRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index % 12) }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-600 mb-3">
                  Nenhuma receita encontrada
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Tente ajustar seus filtros ou termos de busca para encontrar receitas deliciosas.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
