
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, ChefHat, Star, ArrowLeft, Heart, Share2, BookOpen, Utensils } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SaveRecipeButton from '@/components/recipe/SaveRecipeButton';
import RateRecipeButton from '@/components/recipe/RateRecipeButton';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MacroDisplay from '@/components/ui/MacroDisplay';

interface RecipeData {
  id: number;
  titulo: string;
  descricao: string;
  imagem_url: string;
  tempo_preparo: number;
  porcoes: number;
  dificuldade: string;
  nota_media: number;
  avaliacoes_count: number;
  created_at: string;
  usuario_id: string;
  profiles: {
    nome: string;
    avatar_url: string;
  };
  receita_ingredientes: Array<{
    quantidade: number;
    unidade: string;
    ordem: number;
    ingredientes: {
      nome: string;
    };
  }>;
  receita_passos: Array<{
    ordem: number;
    descricao: string;
  }>;
  receita_categorias: Array<{
    categorias: {
      nome: string;
    };
  }>;
  informacao_nutricional: Array<{
    calorias_totais: number;
    proteinas_totais: number;
    carboidratos_totais: number;
    gorduras_totais: number;
  }>;
  avaliacoes: Array<{
    nota: number;
    comentario: string;
    created_at: string;
    profiles: {
      nome: string;
      avatar_url: string;
    };
  }>;
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    if (!id) return;

    try {
      setLoading(true);
      console.log('Fetching recipe with ID:', id);

      const { data, error } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(nome, avatar_url),
          receita_ingredientes(
            quantidade, unidade, ordem,
            ingredientes(nome)
          ),
          receita_passos(ordem, descricao),
          receita_categorias(categorias(nome)),
          informacao_nutricional(*),
          avaliacoes(
            nota, comentario, created_at,
            profiles(nome, avatar_url)
          )
        `)
        .eq('id', parseInt(id))
        .eq('status', 'ativa')
        .single();

      if (error) {
        console.error('Error fetching recipe:', error);
        if (error.code === 'PGRST116') {
          setError('Receita não encontrada');
        } else {
          setError('Erro ao carregar receita');
        }
        return;
      }

      console.log('Recipe data:', data);
      setRecipe(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Erro inesperado ao carregar receita');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingUpdate = () => {
    fetchRecipe();
  };

  const shareRecipe = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.titulo,
        text: recipe?.descricao,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitcooker-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando receita...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{error || 'Receita não encontrada'}</h2>
            <p className="text-gray-600 mb-8">A receita que você está procurando não existe ou foi removida.</p>
            <Button onClick={() => navigate('/recipes')} className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar às Receitas
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const nutrition = recipe.informacao_nutricional?.[0];
  const ingredients = recipe.receita_ingredientes?.sort((a, b) => a.ordem - b.ordem) || [];
  const steps = recipe.receita_passos?.sort((a, b) => a.ordem - b.ordem) || [];
  const categories = recipe.receita_categorias?.map(rc => rc.categorias?.nome).filter(Boolean) || [];
  const reviews = recipe.avaliacoes || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={recipe.imagem_url || '/placeholder.svg'}
            alt={recipe.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 md:px-6 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white"
              >
                <Button
                  onClick={() => navigate('/recipes')}
                  variant="outline"
                  className="mb-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category, index) => (
                    <Badge key={index} variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{recipe.titulo}</h1>
                <p className="text-xl text-gray-200 mb-6 max-w-3xl">{recipe.descricao}</p>
                
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{recipe.tempo_preparo} min</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{recipe.porcoes} porções</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400 fill-current" />
                    <span>{recipe.nota_media.toFixed(1)} ({recipe.avaliacoes_count} avaliações)</span>
                  </div>
                  <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    {recipe.dificuldade}
                  </Badge>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-4"
              >
                <SaveRecipeButton recipeId={recipe.id} />
                <RateRecipeButton 
                  recipeId={recipe.id} 
                  currentRating={recipe.nota_media}
                  onRatingUpdate={handleRatingUpdate}
                />
                <Button onClick={shareRecipe} variant="outline" className="border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </motion.div>

              {/* Ingredients */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-fitcooker-orange/10 to-orange-100">
                    <CardTitle className="flex items-center text-xl">
                      <Utensils className="w-6 h-6 mr-3 text-fitcooker-orange" />
                      Ingredientes ({ingredients.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="font-medium text-gray-800">{ingredient.ingredientes?.nome}</span>
                          <span className="text-fitcooker-orange font-bold bg-white px-3 py-1 rounded-full text-sm">
                            {ingredient.quantidade} {ingredient.unidade}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-fitcooker-orange/10 to-orange-100">
                    <CardTitle className="flex items-center text-xl">
                      <BookOpen className="w-6 h-6 mr-3 text-fitcooker-orange" />
                      Modo de Preparo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                            {step.ordem}
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-2 text-base">{step.descricao}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Reviews */}
              {reviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-500" />
                        Avaliações ({reviews.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {reviews.slice(0, 5).map((review, index) => (
                          <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                            <div className="flex items-start space-x-4">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={review.profiles?.avatar_url} />
                                <AvatarFallback>{review.profiles?.nome?.[0] || 'U'}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{review.profiles?.nome || 'Usuário'}</h4>
                                  <div className="flex items-center">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.nota ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                {review.comentario && (
                                  <p className="text-gray-600">{review.comentario}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-2">
                                  {new Date(review.created_at).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Chef Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Chef</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={recipe.profiles?.avatar_url} />
                        <AvatarFallback><ChefHat className="w-8 h-8" /></AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">{recipe.profiles?.nome || 'Chef Anônimo'}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/cook/${recipe.usuario_id}`)}
                          className="mt-2 border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white"
                        >
                          Ver Perfil
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Nutrition Info */}
              {nutrition && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-fitcooker-orange/10 to-orange-100">
                      <CardTitle>Informações Nutricionais</CardTitle>
                      <p className="text-sm text-gray-600">Por porção</p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <MacroDisplay
                        calories={Math.round(nutrition.calorias_totais / recipe.porcoes)}
                        protein={Math.round(nutrition.proteinas_totais / recipe.porcoes)}
                        carbs={Math.round(nutrition.carboidratos_totais / recipe.porcoes)}
                        fat={Math.round(nutrition.gorduras_totais / recipe.porcoes)}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Recipe Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Detalhes da Receita</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tempo de Preparo</span>
                        <span className="font-medium">{recipe.tempo_preparo} minutos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Porções</span>
                        <span className="font-medium">{recipe.porcoes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dificuldade</span>
                        <Badge variant="outline">{recipe.dificuldade}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Publicado em</span>
                        <span className="font-medium">
                          {new Date(recipe.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeDetail;
