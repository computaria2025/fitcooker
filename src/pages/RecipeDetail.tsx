
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Clock, Users, TrendingUp, BookOpen, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryBadge from '@/components/ui/CategoryBadge';
import RatingStars from '@/components/ui/RatingStars';
import SaveRecipeButton from '@/components/recipe/SaveRecipeButton';
import RateRecipeButton from '@/components/recipe/RateRecipeButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ImageCarousel from '@/components/ui/ImageCarousel';
import NutritionDisplay from '@/components/ui/NutritionDisplay';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(id, nome, avatar_url),
          receita_categorias(categorias(nome)),
          receita_ingredientes(*, ingredientes(nome, unidade_padrao)),
          receita_passos(*),
          receita_midias(*),
          informacao_nutricional(*)
        `)
        .eq('id', id)
        .eq('status', 'ativa')
        .single();

      if (error) throw error;

      if (!data) {
        setError('Receita não encontrada');
        return;
      }

      setRecipe(data);

      // Increment view count
      await supabase
        .from('receitas')
        .update({ visualizacoes: (data.visualizacoes || 0) + 1 })
        .eq('id', id);

    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError('Erro ao carregar receita');
    } finally {
      setLoading(false);
    }
  };

  const macros = recipe?.informacao_nutricional?.[0] ? {
    calories: Math.round(recipe.informacao_nutricional[0].calorias_totais / recipe.porcoes),
    protein: Math.round(recipe.informacao_nutricional[0].proteinas_totais / recipe.porcoes),
    carbs: Math.round(recipe.informacao_nutricional[0].carboidratos_totais / recipe.porcoes),
    fat: Math.round(recipe.informacao_nutricional[0].gorduras_totais / recipe.porcoes),
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitcooker-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando receita...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-16">
          <div className="text-center">
            <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Erro ao carregar receita</h2>
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
      
      <main className="py-8 pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Recipe Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="relative">
                  {recipe.receita_midias && recipe.receita_midias.length > 0 ? (
                    <ImageCarousel 
                      images={recipe.receita_midias.map((media: any) => media.url)} 
                      title={recipe.titulo}
                    />
                  ) : recipe.imagem_url ? (
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                      <img 
                        src={recipe.imagem_url} 
                        alt={recipe.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-2xl">
                      <ChefHat className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Recipe Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                      {recipe.titulo}
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {recipe.descricao}
                    </p>
                  </div>

                  {/* Categories */}
                  {recipe.receita_categorias && recipe.receita_categorias.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {recipe.receita_categorias.map((cat: any, index: number) => (
                        <CategoryBadge key={index} category={cat.categorias.nome} />
                      ))}
                    </div>
                  )}

                  {/* Recipe Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm">
                      <Clock className="w-6 h-6 text-fitcooker-orange mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{recipe.tempo_preparo}</div>
                      <div className="text-sm text-gray-600">minutos</div>
                    </div>
                    <div className="text-center p-4 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm">
                      <Users className="w-6 h-6 text-fitcooker-orange mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{recipe.porcoes}</div>
                      <div className="text-sm text-gray-600">porções</div>
                    </div>
                    <div className="text-center p-4 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm">
                      <TrendingUp className="w-6 h-6 text-fitcooker-orange mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 capitalize">{recipe.dificuldade}</div>
                      <div className="text-sm text-gray-600">dificuldade</div>
                    </div>
                  </div>

                  {/* Rating and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {recipe.nota_media && (
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            <RatingStars initialRating={recipe.nota_media} readOnly />
                          </div>
                          <span className="text-lg font-semibold text-gray-700">
                            {recipe.nota_media} ({recipe.avaliacoes_count} avaliações)
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <SaveRecipeButton recipeId={recipe.id} />
                      {user && (
                        <RateRecipeButton 
                          recipeId={recipe.id}
                          currentRating={recipe.nota_media || 0}
                          onRatingUpdate={fetchRecipe}
                        />
                      )}
                    </div>
                  </div>

                  {/* Author Info */}
                  <div 
                    className="flex items-center space-x-4 p-4 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => window.location.href = `/cook/${recipe.profiles.id}`}
                  >
                    <Avatar className="w-16 h-16 border-2 border-fitcooker-orange/20">
                      <AvatarImage src={recipe.profiles.avatar_url} />
                      <AvatarFallback className="bg-fitcooker-orange text-white text-lg">
                        {recipe.profiles.nome?.[0] || <ChefHat className="w-8 h-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">Chef {recipe.profiles.nome}</p>
                      <p className="text-gray-600">Clique para ver o perfil</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recipe Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Ingredients and Nutrition */}
              <div className="lg:col-span-1 space-y-6">
                {/* Ingredients */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-fitcooker-orange/10 to-orange-100">
                      <CardTitle className="flex items-center space-x-2">
                        <ShoppingCart className="w-5 h-5 text-fitcooker-orange" />
                        <span>Ingredientes</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        {recipe.receita_ingredientes
                          ?.sort((a: any, b: any) => a.ordem - b.ordem)
                          .map((item: any, index: number) => (
                            <li key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors">
                              <div className="w-2 h-2 bg-fitcooker-orange rounded-full flex-shrink-0"></div>
                              <span className="text-gray-700">
                                <span className="font-semibold">{item.quantidade} {item.unidade}</span> de {item.ingredientes.nome}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Nutrition Information */}
                {macros && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <NutritionDisplay
                      calories={macros.calories}
                      protein={macros.protein}
                      carbs={macros.carbs}
                      fat={macros.fat}
                    />
                  </motion.div>
                )}
              </div>

              {/* Right Column - Instructions */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-fitcooker-orange/10 to-orange-100">
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-fitcooker-orange" />
                        <span>Modo de Preparo</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {recipe.receita_passos
                          ?.sort((a: any, b: any) => a.ordem - b.ordem)
                          .map((step: any, index: number) => (
                            <div key={index} className="flex space-x-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-25 hover:from-orange-100 hover:to-orange-50 transition-colors">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                                {step.ordem}
                              </div>
                              <p className="text-gray-700 leading-relaxed flex-1">
                                {step.descricao}
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeDetail;
