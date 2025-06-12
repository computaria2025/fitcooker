
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChefHat } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useCategories } from '@/hooks/useCategories';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionTitle from '@/components/ui/SectionTitle';
import RecipeCard from '@/components/ui/RecipeCard';
import RecipeCardSkeleton from '@/components/ui/RecipeCardSkeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Recipes: React.FC = () => {
  const { data: recipes, loading, error } = useRecipes();
  const { data: categories } = useCategories();
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

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
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' || sortBy !== 'newest';

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
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
      
      <main className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle 
            title="Receitas Deliciosas"
            subtitle="Explore nossa coleção de receitas saudáveis e saborosas criadas por chefs apaixonados pela gastronomia."
          />

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar receitas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 border-gray-200 focus:border-fitcooker-orange rounded-xl"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-fitcooker-orange rounded-xl">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.nome}>
                      {category.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Difficulty Filter */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-fitcooker-orange rounded-xl">
                  <SelectValue placeholder="Dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as dificuldades</SelectItem>
                  <SelectItem value="Fácil">Fácil</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Difícil">Difícil</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-fitcooker-orange rounded-xl">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="oldest">Mais antigas</SelectItem>
                  <SelectItem value="rating">Melhor avaliadas</SelectItem>
                  <SelectItem value="time">Tempo de preparo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">Filtros ativos:</span>
                {searchTerm && (
                  <Badge variant="outline" className="bg-fitcooker-orange/10 border-fitcooker-orange text-fitcooker-orange">
                    Busca: {searchTerm}
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="outline" className="bg-fitcooker-orange/10 border-fitcooker-orange text-fitcooker-orange">
                    {selectedCategory}
                  </Badge>
                )}
                {selectedDifficulty !== 'all' && (
                  <Badge variant="outline" className="bg-fitcooker-orange/10 border-fitcooker-orange text-fitcooker-orange">
                    {selectedDifficulty}
                  </Badge>
                )}
                <Button onClick={clearFilters} variant="ghost" size="sm" className="ml-auto">
                  Limpar filtros
                </Button>
              </div>
            )}
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <p className="text-gray-600">
              {loading ? 'Carregando...' : `${filteredRecipes.length} receita${filteredRecipes.length !== 1 ? 's' : ''} encontrada${filteredRecipes.length !== 1 ? 's' : ''}`}
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
