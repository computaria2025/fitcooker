
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Users, Star } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useRecipes } from '@/hooks/useRecipes';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const { recipes, loading, fetchRecipes } = useRecipes();
  const { categories, loading: categoriesLoading } = useCategories();

  useEffect(() => {
    fetchRecipes({
      search: searchTerm,
      category: selectedCategory === 'Todas' ? undefined : selectedCategory
    });
  }, [searchTerm, selectedCategory, fetchRecipes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes({
      search: searchTerm,
      category: selectedCategory === 'Todas' ? undefined : selectedCategory
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Receitas <span className="text-gradient">FitCooker</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra receitas saudáveis e deliciosas criadas por nossa comunidade de chefs
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Buscar receitas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-3 text-lg"
                  />
                </div>
                <Button type="submit" className="bg-fitcooker-orange hover:bg-fitcooker-orange/90 px-8">
                  <Search size={20} className="mr-2" />
                  Buscar
                </Button>
              </div>
            </form>

            {/* Categories Filter */}
            <div className="flex items-center gap-4 mb-4">
              <Filter className="text-gray-600" size={20} />
              <span className="font-medium text-gray-700">Categorias:</span>
            </div>
            
            {categoriesLoading ? (
              <div className="flex flex-wrap gap-2">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'Todas' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('Todas')}
                  className={selectedCategory === 'Todas' ? 'bg-fitcooker-orange hover:bg-fitcooker-orange/90' : ''}
                >
                  Todas
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.nome ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.nome)}
                    className={selectedCategory === category.nome ? 'bg-fitcooker-orange hover:bg-fitcooker-orange/90' : ''}
                  >
                    {category.nome}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-600">
              {loading ? 'Carregando...' : `${recipes.length} receita(s) encontrada(s)`}
            </p>
          </div>

          {/* Recipes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍳</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma receita encontrada</h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros ou termos de busca
              </p>
              <Link to="/add-recipe">
                <Button className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
                  Adicionar Primeira Receita
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative overflow-hidden">
                    {recipe.imagem_url ? (
                      <img
                        src={recipe.imagem_url}
                        alt={recipe.titulo}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-fitcooker-orange to-fitcooker-yellow flex items-center justify-center">
                        <span className="text-6xl">🍽️</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className={getDifficultyColor(recipe.dificuldade)}>
                        {recipe.dificuldade}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-fitcooker-orange transition-colors">
                      {recipe.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {recipe.descricao}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {recipe.receita_categorias.slice(0, 2).map((rc, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {rc.categorias.nome}
                        </Badge>
                      ))}
                      {recipe.receita_categorias.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{recipe.receita_categorias.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {formatTime(recipe.tempo_preparo)}
                      </div>
                      <div className="flex items-center">
                        <Users size={16} className="mr-1" />
                        {recipe.porcoes} porções
                      </div>
                      <div className="flex items-center">
                        <Star size={16} className="mr-1 fill-yellow-400 text-yellow-400" />
                        {recipe.nota_media || 0}
                      </div>
                    </div>
                    
                    {recipe.informacao_nutricional && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 text-center">
                          {Math.round(recipe.informacao_nutricional.calorias_totais / recipe.porcoes)} cal/porção
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        {recipe.profiles.avatar_url ? (
                          <img
                            src={recipe.profiles.avatar_url}
                            alt={recipe.profiles.nome}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-fitcooker-orange text-white flex items-center justify-center mr-2 text-sm font-medium">
                            {recipe.profiles.nome.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{recipe.profiles.nome}</p>
                          {recipe.profiles.is_chef && (
                            <Badge variant="secondary" className="text-xs">Chef</Badge>
                          )}
                        </div>
                      </div>
                      
                      <Link to={`/recipe/${recipe.id}`}>
                        <Button size="sm" className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
                          Ver Receita
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Recipes;
