
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChefHat } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    preparationTime: '',
    rating: 0
  });

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || 
      recipe.categories.some(cat => cat.toLowerCase().includes(filters.category.toLowerCase()));
    
    const matchesDifficulty = !filters.difficulty || 
      recipe.dificuldade.toLowerCase() === filters.difficulty.toLowerCase();
    
    const matchesTime = !filters.preparationTime || (() => {
      const time = recipe.tempo_preparo;
      switch (filters.preparationTime) {
        case 'quick': return time <= 30;
        case 'medium': return time > 30 && time <= 60;
        case 'long': return time > 60;
        default: return true;
      }
    })();
    
    const matchesRating = !filters.rating || 
      (recipe.nota_media && recipe.nota_media >= filters.rating);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesTime && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-12 pt-40">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle 
            title="Receitas Deliciosas"
            subtitle="Descubra pratos incríveis criados pela nossa comunidade de chefs apaixonados"
          />

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar receitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-fitcooker-orange focus:ring-fitcooker-orange"
              />
            </div>
            
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden h-12 border-gray-200">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <RecipeFilters filters={filters} onFiltersChange={setFilters} />
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-32">
                <RecipeFilters filters={filters} onFiltersChange={setFilters} />
              </div>
            </div>

            {/* Recipes Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <RecipeCardSkeleton key={index} />
                  ))}
                </div>
              ) : filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index % 9) }}
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
