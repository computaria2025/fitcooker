import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Clock, Users, TrendingUp, BookOpen, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryBadge from '@/components/ui/CategoryBadge';
import RatingStars from '@/components/ui/RatingStars';
import SaveRecipeButton from '@/components/recipe/SaveRecipeButton';
import RateRecipeButton from '@/components/recipe/RateRecipeButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem,CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import NutritionDisplay from '@/components/ui/NutritionDisplay';
import CommentsDialog from '@/components/ui/CommentsDialog';
import { useCommentActions } from '@/hooks/useCommentActions';
import EditCommentDialog from '@/components/ui/EditCommentDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<any>(null);
  const [authorProfile, setAuthorProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portionCount, setPortionCount] = useState<number>(1);
  const { deleteComment, isLoading: isDeletingComment } = useCommentActions();

  useEffect(() => {
    if (id) {
      fetchRecipe();
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    if (recipe?.porcoes) {
      setPortionCount(recipe.porcoes);
    }
  }, [recipe]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('receitas')
        .select(`
          *,
          receita_categorias(categorias(nome)),
          receita_ingredientes(*),
          receita_passos(*),
          receita_media(*)
        `)
        .eq('id', Number(id))
        .eq('status', 'ativa')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setError('Receita não encontrada');
        return;
      }

      // Enforce recipe media order
      data.receita_media.sort((media1, media2) => media1.ordem - media2.ordem);

      // Enrich ingredients with names
      let enriched = data;
      const ingredientIds = (data.receita_ingredientes || []).map((ri: any) => ri.ingrediente_id).filter(Boolean);
      if (ingredientIds.length > 0) {
        const { data: ingList } = await supabase
          .from('ingredientes')
          .select('id, nome, unidade_padrao')
          .in('id', ingredientIds);
        const ingMap = Object.fromEntries((ingList || []).map((i: any) => [i.id, { nome: i.nome, unidade_padrao: i.unidade_padrao }]));
        enriched = {
          ...data,
          receita_ingredientes: (data.receita_ingredientes || []).map((ri: any) => ({
            ...ri,
            ingredientes: ingMap[ri.ingrediente_id] || null,
          })),
        };
      }

      setRecipe(enriched);

      // Fetch author profile separately
      const { data: author, error: authorError } = await supabase
        .from('profiles')
        .select('user_id, nome, avatar_url')
        .eq('user_id', data.usuario_id)
        .maybeSingle();

      if (!authorError) {
        setAuthorProfile(author || null);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError('Erro ao carregar receita');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          *,
          profiles(nome, avatar_url)
        `)
        .eq('receita_id', Number(id))
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleCommentUpdated = () => {
    fetchReviews();
    fetchRecipe();
  };

  const macros = recipe ? {
    calories: Math.round((recipe.calorias_total || 0) / (recipe.porcoes || 1)),
    protein: Math.round((recipe.proteinas_total || 0) / (recipe.porcoes || 1)),
    carbs: Math.round((recipe.carboidratos_total || 0) / (recipe.porcoes || 1)),
    fat: Math.round((recipe.gorduras_total || 0) / (recipe.porcoes || 1)),
    fiber: Math.round((recipe.fibras_total || 0) / (recipe.porcoes || 1)),
    sodium: Math.round((recipe.sodio_total || 0) / (recipe.porcoes || 1)),
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-24">
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
        <main className="flex-grow flex items-center justify-center pt-24">
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

      <main className="py-8 pt-40">
        <div className="container mx-auto responsive-padding">
          <div className="max-w-6xl mx-auto">
            {/* Recipe Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                {/* Media Carousel */}
                <div className="relative space-y-4">
                {recipe.receita_media && recipe.receita_media.length > 0 ? (
                  <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {recipe.receita_media.map((media: any, index: number) => (
                          <CarouselItem key={media.id || index} className="aspect-[4/3]">
                            {media.tipo === "image" ? (
                              <img
                                src={media.url}
                                alt={`${recipe.titulo} - media ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={media.url}
                                controls
                                className="w-full h-full object-cover"
                              />
                            )}
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
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
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    <div className="text-center p-4 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm">
                      <Clock className="w-6 h-6 text-fitcooker-orange mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{recipe.tempo_preparo}</div>
                      <div className="text-sm text-gray-600">minutos</div>
                    </div>
                    <div className="text-center p-4 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm">
                      <Users className="w-6 h-6 text-fitcooker-orange mx-auto mb-2" />
                      <select
                        value={portionCount}
                        onChange={(e) => setPortionCount(parseInt(e.target.value))}
                        className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:ring-2 focus:ring-fitcooker-orange/30 text-center"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
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
                            {recipe.nota_media.toFixed(1)} ({recipe.avaliacoes_count} avaliações)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <SaveRecipeButton recipeId={recipe.id} />
                      {user && (
                        <RateRecipeButton 
                          recipeId={recipe.id}
                          onRatingUpdate={handleCommentUpdated} 
                          currentRating={0}                        
                        />
                      )}
                    </div>
                  </div>

                  {/* Author Info */}
                  <div 
                    className="flex items-center space-x-4 p-4 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => window.location.href = `/cook/${recipe.usuario_id}`}
                  >
                    <Avatar className="w-16 h-16 border-2 border-fitcooker-orange/20">
                      <AvatarImage src={authorProfile?.avatar_url || ''} />
                      <AvatarFallback className="bg-fitcooker-orange text-white text-lg">
                        {authorProfile?.nome?.[0] || <ChefHat className="w-8 h-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">Chef {authorProfile?.nome || 'Anônimo'}</p>
                      <p className="text-gray-600">Clique para ver o perfil</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recipe Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
              {/* Left Column - Ingredients and Nutrition */}
              <div className="lg:col-span-1 space-y-6">
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
                          ?.sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0))
                          .map((item: any) => (
                            <li key={item.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors">
                              <div className="w-2 h-2 bg-fitcooker-orange rounded-full flex-shrink-0"></div>
                              <span className="text-gray-700">
                                <span className="font-semibold">
                                  {((item.quantidade * portionCount) / recipe.porcoes).toFixed(2)} {item.unidade}
                                </span> de {item.ingredientes?.nome || ''}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

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
                      fiber={macros.fiber}
                      sodium={macros.sodium}
                    />
                  </motion.div>
                )}
              </div>

              {/* Right Column - Instructions and Reviews */}
              <div className="lg:col-span-2 space-y-8">
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
                          ?.sort((a: any, b: any) => (a.numero_passo ?? 0) - (b.numero_passo ?? 0))
                          .map((step: any) => (
                            <div key={step.id} className="flex space-x-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-25 hover:from-orange-100 hover:to-orange-50 transition-colors">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                                {step.numero_passo}
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

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-fitcooker-orange/10 to-orange-100">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-fitcooker-orange" />
                          <span>Avaliações ({reviews.length})</span>
                        </div>
                        {reviews.length > 3 && (
                          <CommentsDialog 
                            recipeId={recipe.id} 
                            commentCount={reviews.length}
                            onCommentsUpdate={handleCommentUpdated}
                          />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {reviews.length > 0 ? (
                        <div className="space-y-6">
                          {reviews.slice(0, 3).map((review: any) => (
                            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                              <div className="flex items-start space-x-4">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={review.profiles?.avatar_url || ''} />
                                  <AvatarFallback className="bg-fitcooker-orange text-white text-sm">
                                    {review.profiles?.nome?.[0] || <ChefHat className="w-4 h-4" />}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                      <span className="font-semibold text-gray-900">
                                        {review.profiles?.nome || 'Usuário Anônimo'}
                                      </span>
                                      <RatingStars initialRating={review.nota} readOnly size="sm" />
                                      <span className="text-sm text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString('pt-BR')}
                                      </span>
                                    </div>

                                    {user && user.id === review.usuario_id && (
                                      <div className="flex items-center space-x-2">
                                        <EditCommentDialog 
                                          comment={review}
                                          onCommentUpdated={handleCommentUpdated}
                                        />
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                                              disabled={isDeletingComment}
                                            >
                                              <Trash2 className="w-3 h-3 mr-1" />
                                              Excluir
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Excluir comentário</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() => {
                                                  deleteComment(review.id).then(success => {
                                                    if (success) handleCommentUpdated();
                                                  });
                                                }}
                                                className="bg-red-600 hover:bg-red-700"
                                              >
                                                Excluir
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </div>
                                    )}
                                  </div>
                                  {review.comentario && (
                                    <p className="text-gray-700 leading-relaxed">
                                      {review.comentario}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Nenhuma avaliação ainda</p>
                          <p className="text-gray-400 text-sm">Seja o primeiro a avaliar esta receita!</p>
                        </div>
                      )}
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