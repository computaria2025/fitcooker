
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, ChefHat, Heart, Share2, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RateRecipeForm from '@/components/recipe/RateRecipeForm';
import { useRecipes } from '@/hooks/useRecipes';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRecipeById, toggleSaveRecipe, isRecipeSaved } = useRecipes();
  
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) {
        navigate('/recipes');
        return;
      }

      setLoading(true);
      const recipeData = await getRecipeById(parseInt(id));
      
      if (!recipeData) {
        navigate('/recipes');
        return;
      }
      
      setRecipe(recipeData);
      
      // Check if recipe is saved
      if (user) {
        setCheckingSaved(true);
        const isSaved = await isRecipeSaved(parseInt(id));
        setSaved(isSaved);
        setCheckingSaved(false);
      }
      
      setLoading(false);
    };

    loadRecipe();
  }, [id, getRecipeById, isRecipeSaved, navigate, user]);

  const handleSaveRecipe = async () => {
    if (!user) {
      toast.error('Faça login para salvar receitas');
      return;
    }

    if (!id) return;

    const newSavedState = await toggleSaveRecipe(parseInt(id));
    if (newSavedState !== undefined) {
      setSaved(newSavedState);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleShare = () => {
    if (navigator.share && recipe) {
      navigator.share({
        title: recipe.titulo,
        text: recipe.descricao,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="w-full h-64 md:h-96 rounded-2xl mb-6" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <Skeleton className="h-40 w-full rounded-2xl mb-4" />
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Receita não encontrada</h1>
            <Link to="/recipes">
              <Button>Voltar para Receitas</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Recipe Image */}
              <div className="relative mb-6">
                {recipe.imagem_url ? (
                  <img
                    src={recipe.imagem_url}
                    alt={recipe.titulo}
                    className="w-full h-64 md:h-96 object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-64 md:h-96 bg-gradient-to-br from-fitcooker-orange to-fitcooker-yellow rounded-2xl flex items-center justify-center">
                    <span className="text-8xl">🍽️</span>
                  </div>
                )}
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleShare}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Share2 size={16} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSaveRecipe}
                    disabled={checkingSaved}
                    className="bg-white/90 hover:bg-white"
                  >
                    {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </Button>
                </div>
              </div>

              {/* Recipe Header */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.receita_categorias.map((rc: any, index: number) => (
                    <Badge key={index} variant="secondary">
                      {rc.categorias.nome}
                    </Badge>
                  ))}
                  <Badge className={getDifficultyColor(recipe.dificuldade)}>
                    {recipe.dificuldade}
                  </Badge>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {recipe.titulo}
                </h1>
                
                <p className="text-xl text-gray-600 mb-6">
                  {recipe.descricao}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center">
                    <Clock size={20} className="mr-2" />
                    <span>{formatTime(recipe.tempo_preparo)}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={20} className="mr-2" />
                    <span>{recipe.porcoes} porções</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={20} className="mr-2 fill-yellow-400 text-yellow-400" />
                    <span>{recipe.nota_media || 0} ({recipe.avaliacoes_count} avaliações)</span>
                  </div>
                </div>
              </div>

              {/* Chef Info */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <Link to={`/cook/${recipe.profiles.id}`} className="flex items-center hover:opacity-80 transition-opacity">
                      <Avatar className="w-12 h-12 mr-4">
                        <AvatarImage src={recipe.profiles.avatar_url} alt={recipe.profiles.nome} />
                        <AvatarFallback>{recipe.profiles.nome.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{recipe.profiles.nome}</h3>
                        {recipe.profiles.is_chef && (
                          <div className="flex items-center text-sm text-gray-600">
                            <ChefHat size={14} className="mr-1" />
                            Chef Verificado
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <RateRecipeForm
                      recipeId={id!}
                      recipeName={recipe.titulo}
                      isLoggedIn={!!user}
                      prominentDisplay={true}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ingredients */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Ingredientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recipe.receita_ingredientes
                      .sort((a: any, b: any) => a.ordem - b.ordem)
                      .map((ri: any) => (
                      <li key={ri.id} className="flex items-center">
                        <div className="w-2 h-2 bg-fitcooker-orange rounded-full mr-3 flex-shrink-0"></div>
                        <span>
                          <strong>{ri.quantidade}</strong> {ri.unidade} de <strong>{ri.ingredientes.nome}</strong>
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Modo de Preparo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {recipe.receita_passos
                      .sort((a: any, b: any) => a.ordem - b.ordem)
                      .map((step: any) => (
                      <li key={step.id} className="flex">
                        <div className="flex-shrink-0 w-8 h-8 bg-fitcooker-orange text-white rounded-full flex items-center justify-center font-semibold mr-4 mt-1">
                          {step.ordem}
                        </div>
                        <p className="text-gray-700 leading-relaxed pt-1">
                          {step.descricao}
                        </p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Reviews */}
              {recipe.avaliacoes && recipe.avaliacoes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Avaliações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recipe.avaliacoes.map((review: any) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Avatar className="w-8 h-8 mr-3">
                                <AvatarImage src={review.profiles?.avatar_url} alt={review.profiles?.nome} />
                                <AvatarFallback>{review.profiles?.nome?.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-gray-900">{review.profiles?.nome}</span>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < review.nota ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comentario && (
                            <p className="text-gray-600">{review.comentario}</p>
                          )}
                          <p className="text-sm text-gray-400 mt-1">
                            {new Date(review.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Nutrition Info */}
              {recipe.informacao_nutricional && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Nutricionais</CardTitle>
                    <p className="text-sm text-gray-600">Por porção</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Calorias</span>
                        <span className="font-semibold">
                          {Math.round(recipe.informacao_nutricional.calorias_totais / recipe.porcoes)} kcal
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Proteínas</span>
                        <span className="font-semibold">
                          {Math.round(recipe.informacao_nutricional.proteinas_totais / recipe.porcoes)}g
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Carboidratos</span>
                        <span className="font-semibold">
                          {Math.round(recipe.informacao_nutricional.carboidratos_totais / recipe.porcoes)}g
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Gorduras</span>
                        <span className="font-semibold">
                          {Math.round(recipe.informacao_nutricional.gorduras_totais / recipe.porcoes)}g
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleSaveRecipe}
                    variant={saved ? "default" : "outline"}
                    className="w-full"
                    disabled={checkingSaved}
                  >
                    {saved ? <BookmarkCheck size={16} className="mr-2" /> : <Bookmark size={16} className="mr-2" />}
                    {saved ? 'Receita Salva' : 'Salvar Receita'}
                  </Button>
                  
                  <Button onClick={handleShare} variant="outline" className="w-full">
                    <Share2 size={16} className="mr-2" />
                    Compartilhar
                  </Button>
                  
                  <Link to={`/cook/${recipe.profiles.id}`} className="block">
                    <Button variant="outline" className="w-full">
                      <ChefHat size={16} className="mr-2" />
                      Ver Perfil do Chef
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RecipeDetail;
