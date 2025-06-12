import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useCategories } from '@/hooks/useCategories';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionTitle from '@/components/ui/SectionTitle';
import RecipeCard from '@/components/ui/RecipeCard';
import RecipeCardSkeleton from '@/components/ui/RecipeCardSkeleton';
import RecipeFilters from '@/components/recipes/RecipeFilters';
import { Button } from '@/components/ui/button';

const Recipes: React.FC = () => {
  const { data: recipes, loading, error } = useRecipes();
  const { data: categories } = useCategories();
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [timeRange, setTimeRange] = useState<number[]>([5, 180]);
  const [servingsRange, setServingsRange] = useState<number[]>([1, 12]);

  useEffect(() => {
    let filtered = [...recipes];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(recipe =>
        recipe.categories.includes(selectedCategory)
      );
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(recipe =>
        recipe.dificuldade === selectedDifficulty
      );
    }

    // Apply time range filter
    filtered = filtered.filter(recipe =>
      recipe.tempo_preparo >= timeRange[0] && recipe.tempo_preparo <= timeRange[1]
    );

    // Apply servings range filter
    filtered = filtered.filter(recipe =>
      recipe.porcoes >= servingsRange[0] && recipe.porcoes <= servingsRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => (b.nota_media || 0) - (a.nota_media || 0));
        break;
      case 'time':
        filtered.sort((a, b) => a.tempo_preparo - b.tempo_preparo);
        break;
    }

    setFilteredRecipes(filtered);
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty, sortBy, timeRange, servingsRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSortBy('newest');
    setTimeRange([5, 180]);
    setServingsRange([1, 12]);
  };

  const hasActiveFilters = Boolean(
    searchTerm || 
    selectedCategory !== 'all' || 
    selectedDifficulty !== 'all' || 
    sortBy !== 'newest' || 
    timeRange[0] !== 5 || 
    timeRange[1] !== 180 || 
    servingsRange[0] !== 1 || 
    servingsRange[1] !== 12
  );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-16">
          <div className="text-center">
            <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Erro ao carregar receitas</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-12 pt-24">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle 
            title="Receitas Deliciosas"
            subtitle="Explore nossa coleção de receitas saudáveis e saborosas criadas por chefs apaixonados pela gastronomia."
          />

          {/* Enhanced Filters */}
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

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 mt-8"
          >
            <p className="text-gray-600 text-lg">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-fitcooker-orange"></div>
                  <span>Carregando receitas...</span>
                </div>
              ) : (
                `${filteredRecipes.length} receita${filteredRecipes.length !== 1 ? 's' : ''} encontrada${filteredRecipes.length !== 1 ? 's' : ''}`
              )}
            </p>
          </motion.div>

          {/* Recipes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }, (_, index) => (
                <RecipeCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-3">
                {hasActiveFilters ? 'Nenhuma receita encontrada' : 'Nenhuma receita cadastrada ainda'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {hasActiveFilters 
                  ? 'Tente ajustar os filtros ou limpe-os para ver todas as receitas disponíveis.' 
                  : 'Seja o primeiro a adicionar uma receita deliciosa à nossa plataforma!'
                }
              </p>
              {hasActiveFilters ? (
                <Button onClick={clearFilters} className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
                  Limpar Filtros
                </Button>
              ) : (
                <Button asChild className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
                  <a href="/add-recipe">Adicionar Primeira Receita</a>
                </Button>
              )}
            </motion.div>
          ) : (
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
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
