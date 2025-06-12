
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Star, TrendingUp, BookOpen, Users, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRecipes } from '@/hooks/useRecipes';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RecipeCard from '@/components/ui/RecipeCard';
import { Recipe } from '@/types/recipe';

interface DashboardStats {
  totalRecipes: number;
  userRecipes: number;
  followers: number;
  following: number;
}

interface FeaturedChef {
  id: string;
  nome: string;
  avatar_url: string;
  receitas_count: number;
  seguidores_count: number;
  nota_media: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: allRecipes, loading: recipesLoading } = useRecipes();
  const [stats, setStats] = useState<DashboardStats>({
    totalRecipes: 0,
    userRecipes: 0,
    followers: 0,
    following: 0
  });
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [featuredChefs, setFeaturedChefs] = useState<FeaturedChef[]>([]);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      checkIfNewUser();
    }
  }, [user, allRecipes]);

  const checkIfNewUser = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('data_cadastro')
        .eq('id', user.id)
        .single();

      if (error) return;

      // Check if user was created in the last 24 hours
      const createdAt = new Date(data.data_cadastro);
      const now = new Date();
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      
      setIsNewUser(hoursDiff < 24);
    } catch (error) {
      console.error('Error checking new user status:', error);
    }
  };

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user profile stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('receitas_count, seguidores_count, seguindo_count')
        .eq('id', user.id)
        .single();

      // Fetch user's recipes
      const { data: recipes } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(nome, avatar_url),
          receita_categorias(categorias(nome)),
          informacao_nutricional(*)
        `)
        .eq('usuario_id', user.id)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false })
        .limit(6);

      // Transform user recipes
      const transformedUserRecipes = recipes?.map(recipe => ({
        id: recipe.id,
        titulo: recipe.titulo,
        title: recipe.titulo,
        descricao: recipe.descricao,
        description: recipe.descricao,
        imagem_url: recipe.imagem_url,
        imageUrl: recipe.imagem_url,
        tempo_preparo: recipe.tempo_preparo,
        preparationTime: recipe.tempo_preparo,
        porcoes: recipe.porcoes,
        servings: recipe.porcoes,
        dificuldade: recipe.dificuldade,
        difficulty: recipe.dificuldade,
        nota_media: recipe.nota_media,
        rating: recipe.nota_media,
        avaliacoes_count: recipe.avaliacoes_count,
        created_at: recipe.created_at,
        usuario_id: recipe.usuario_id,
        status: recipe.status,
        author: {
          id: recipe.profiles?.id || recipe.usuario_id,
          name: recipe.profiles?.nome || 'Chef Anônimo',
          avatarUrl: recipe.profiles?.avatar_url || '',
        },
        categories: recipe.receita_categorias?.map((rc: any) => rc.categorias?.nome).filter(Boolean) || [],
        macros: recipe.informacao_nutricional?.[0] ? {
          calories: Math.round(recipe.informacao_nutricional[0].calorias_totais / recipe.porcoes),
          protein: Math.round(recipe.informacao_nutricional[0].proteinas_totais / recipe.porcoes),
          carbs: Math.round(recipe.informacao_nutricional[0].carboidratos_totais / recipe.porcoes),
          fat: Math.round(recipe.informacao_nutricional[0].gorduras_totais / recipe.porcoes),
        } : { calories: 0, protein: 0, carbs: 0, fat: 0 },
      })) || [];

      // Get featured recipes (highest rated)
      const featured = allRecipes
        .filter(recipe => recipe.nota_media > 0)
        .sort((a, b) => (b.nota_media || 0) - (a.nota_media || 0))
        .slice(0, 6);

      // Fetch featured chefs
      const { data: chefs } = await supabase
        .from('profiles')
        .select('id, nome, avatar_url, receitas_count, seguidores_count')
        .eq('is_chef', true)
        .gt('receitas_count', 0)
        .order('seguidores_count', { ascending: false })
        .limit(6);

      // Calculate average ratings for chefs
      const chefsWithRatings = await Promise.all(
        (chefs || []).map(async (chef) => {
          const { data: chefRecipes } = await supabase
            .from('receitas')
            .select('nota_media')
            .eq('usuario_id', chef.id)
            .not('nota_media', 'is', null);

          let averageRating = 0;
          if (chefRecipes && chefRecipes.length > 0) {
            const validRatings = chefRecipes.filter(r => r.nota_media > 0);
            if (validRatings.length > 0) {
              averageRating = validRatings.reduce((sum, recipe) => sum + recipe.nota_media, 0) / validRatings.length;
            }
          }

          return {
            ...chef,
            nota_media: Number(averageRating.toFixed(1))
          };
        })
      );

      setStats({
        totalRecipes: allRecipes.length,
        userRecipes: profile?.receitas_count || 0,
        followers: profile?.seguidores_count || 0,
        following: profile?.seguindo_count || 0
      });
      
      setUserRecipes(transformedUserRecipes);
      setFeaturedRecipes(featured);
      setFeaturedChefs(chefsWithRatings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitcooker-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-8">
        <div className="container mx-auto px-4 md:px-6">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-fitcooker-orange/20 to-orange-500/20 blur-3xl rounded-full transform scale-150"></div>
              <div className="relative bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 rounded-3xl p-8 text-white overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                
                <div className="relative">
                  {isNewUser ? (
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <ChefHat className="w-10 h-10 text-white" />
                      </motion.div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Bem-vindo ao FitCooker, {user?.user_metadata?.nome || user?.email?.split('@')[0]}! 🎉
                      </h1>
                      <p className="text-orange-100 text-lg max-w-2xl mx-auto">
                        Agora você é um chef! Cozinhe, poste suas receitas incríveis ou simplesmente explore e se inspire com nossa comunidade culinária.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Olá, Chef {user?.user_metadata?.nome || user?.email?.split('@')[0]}! 👨‍🍳
                      </h1>
                      <p className="text-orange-100 text-lg">
                        Bem-vindo de volta! Vamos cozinhar algo incrível hoje?
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total de Receitas</p>
                    <p className="text-3xl font-bold">{stats.totalRecipes}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Minhas Receitas</p>
                    <p className="text-3xl font-bold">{stats.userRecipes}</p>
                  </div>
                  <ChefHat className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Seguidores</p>
                    <p className="text-3xl font-bold">{stats.followers}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Seguindo</p>
                    <p className="text-3xl font-bold">{stats.following}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-br from-fitcooker-orange/10 to-orange-100 border-fitcooker-orange/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Adicionar Nova Receita</h3>
                    <p className="text-gray-600 mb-4">Compartilhe suas criações culinárias com a comunidade</p>
                    <Button asChild className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
                      <a href="/add-recipe">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Receita
                      </a>
                    </Button>
                  </div>
                  <ChefHat className="w-16 h-16 text-fitcooker-orange/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Explorar Receitas</h3>
                    <p className="text-gray-600 mb-4">Descubra novas receitas da nossa comunidade de chefs</p>
                    <Button asChild variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                      <a href="/recipes">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Ver Receitas
                      </a>
                    </Button>
                  </div>
                  <Star className="w-16 h-16 text-blue-300" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Sections */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* My Recent Recipes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Minhas Receitas Recentes</span>
                    <Button asChild variant="outline" size="sm">
                      <a href="/profile">Ver Todas</a>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Suas últimas criações culinárias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userRecipes.length > 0 ? (
                    <div className="space-y-4">
                      {userRecipes.slice(0, 3).map((recipe) => (
                        <div key={recipe.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <img
                            src={recipe.imagem_url || '/placeholder.svg'}
                            alt={recipe.titulo}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{recipe.titulo}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">{recipe.descricao}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">{recipe.dificuldade}</Badge>
                              <span className="text-xs text-gray-500">{recipe.tempo_preparo} min</span>
                            </div>
                          </div>
                          <Button asChild size="sm" variant="ghost">
                            <a href={`/recipe/${recipe.id}`}>Ver</a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">Você ainda não criou nenhuma receita</p>
                      <Button asChild size="sm" className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
                        <a href="/add-recipe">Criar Primeira Receita</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Featured Chefs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Chefs em Destaque</span>
                    <Button asChild variant="outline" size="sm">
                      <a href="/cooks">Ver Todos</a>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Os chefs mais populares da comunidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {featuredChefs.length > 0 ? (
                    <div className="space-y-4">
                      {featuredChefs.slice(0, 3).map((chef) => (
                        <div key={chef.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={chef.avatar_url || ''} />
                            <AvatarFallback><ChefHat className="w-6 h-6" /></AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{chef.nome}</h4>
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                              <span>{chef.receitas_count} receitas</span>
                              <span>{chef.seguidores_count} seguidores</span>
                              {chef.nota_media > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  <span>{chef.nota_media}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button asChild size="sm" variant="ghost">
                            <a href={`/cook/${chef.id}`}>Ver Perfil</a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Nenhum chef em destaque ainda</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Featured Recipes */}
          {featuredRecipes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Receitas em Destaque</span>
                    <Button asChild variant="outline" size="sm">
                      <a href="/recipes">Ver Todas</a>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    As receitas mais bem avaliadas da comunidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredRecipes.slice(0, 3).map((recipe) => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
