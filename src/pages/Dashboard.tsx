
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, Heart, BookOpen, Users, TrendingUp, PlusCircle } from 'lucide-react';
import { Recipe } from '@/types/recipe';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    recipesCount: 0,
    savedRecipesCount: 0,
    totalViews: 0
  });
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [featuredChefs, setFeaturedChefs] = useState<any[]>([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, loading, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch user statistics
      const [recipesCountResult, savedCountResult, userRecipesResult] = await Promise.all([
        supabase
          .from('receitas')
          .select('*', { count: 'exact', head: true })
          .eq('usuario_id', user.id),
        supabase
          .from('receitas_salvas')
          .select('*', { count: 'exact', head: true })
          .eq('usuario_id', user.id),
        supabase
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
          .limit(3)
      ]);

      // Fetch saved recipes
      const { data: savedRecipesData } = await supabase
        .from('receitas_salvas')
        .select(`
          receita_id,
          receitas(
            *,
            profiles(nome, avatar_url),
            receita_categorias(categorias(nome)),
            informacao_nutricional(*)
          )
        `)
        .eq('usuario_id', user.id)
        .limit(3);

      // Fetch featured chefs
      const { data: chefsData } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_chef', true)
        .order('receitas_count', { ascending: false })
        .limit(3);

      // Fetch recommended recipes
      const { data: recommendedData } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(nome, avatar_url),
          receita_categorias(categorias(nome)),
          informacao_nutricional(*)
        `)
        .eq('status', 'ativa')
        .neq('usuario_id', user.id)
        .order('nota_media', { ascending: false })
        .limit(6);

      setUserStats({
        recipesCount: recipesCountResult.count || 0,
        savedRecipesCount: savedCountResult.count || 0,
        totalViews: 0 // Calculate from views if needed
      });

      // Format user recipes
      const formattedUserRecipes = (userRecipesResult.data || []).map((recipe: any) => ({
        id: recipe.id,
        titulo: recipe.titulo,
        title: recipe.titulo,
        descricao: recipe.descricao,
        description: recipe.descricao,
        imagem_url: recipe.imagem_url || '/placeholder.svg',
        imageUrl: recipe.imagem_url || '/placeholder.svg',
        tempo_preparo: recipe.tempo_preparo,
        preparationTime: recipe.tempo_preparo,
        porcoes: recipe.porcoes,
        servings: recipe.porcoes,
        dificuldade: recipe.dificuldade,
        difficulty: recipe.dificuldade,
        nota_media: recipe.nota_media || 0,
        rating: recipe.nota_media || 0,
        avaliacoes_count: recipe.avaliacoes_count || 0,
        created_at: recipe.created_at,
        usuario_id: recipe.usuario_id,
        author: {
          id: recipe.usuario_id,
          name: recipe.profiles?.nome || 'Chef Anônimo',
          avatarUrl: recipe.profiles?.avatar_url || '/placeholder.svg'
        },
        categories: recipe.receita_categorias?.map((rc: any) => rc.categorias?.nome).filter(Boolean) || [],
        macros: {
          calories: recipe.informacao_nutricional?.[0]?.calorias_totais || 0,
          protein: recipe.informacao_nutricional?.[0]?.proteinas_totais || 0,
          carbs: recipe.informacao_nutricional?.[0]?.carboidratos_totais || 0,
          fat: recipe.informacao_nutricional?.[0]?.gorduras_totais || 0
        }
      }));

      // Format saved recipes
      const formattedSavedRecipes = (savedRecipesData || []).map((item: any) => {
        const recipe = item.receitas;
        return {
          id: recipe.id,
          titulo: recipe.titulo,
          title: recipe.titulo,
          descricao: recipe.descricao,
          description: recipe.descricao,
          imagem_url: recipe.imagem_url || '/placeholder.svg',
          imageUrl: recipe.imagem_url || '/placeholder.svg',
          tempo_preparo: recipe.tempo_preparo,
          preparationTime: recipe.tempo_preparo,
          porcoes: recipe.porcoes,
          servings: recipe.porcoes,
          dificuldade: recipe.dificuldade,
          difficulty: recipe.dificuldade,
          nota_media: recipe.nota_media || 0,
          rating: recipe.nota_media || 0,
          avaliacoes_count: recipe.avaliacoes_count || 0,
          created_at: recipe.created_at,
          usuario_id: recipe.usuario_id,
          author: {
            id: recipe.usuario_id,
            name: recipe.profiles?.nome || 'Chef Anônimo',
            avatarUrl: recipe.profiles?.avatar_url || '/placeholder.svg'
          },
          categories: recipe.receita_categorias?.map((rc: any) => rc.categorias?.nome).filter(Boolean) || [],
          macros: {
            calories: recipe.informacao_nutricional?.[0]?.calorias_totais || 0,
            protein: recipe.informacao_nutricional?.[0]?.proteinas_totais || 0,
            carbs: recipe.informacao_nutricional?.[0]?.carboidratos_totais || 0,
            fat: recipe.informacao_nutricional?.[0]?.gorduras_totais || 0
          }
        };
      });

      // Format recommended recipes
      const formattedRecommended = (recommendedData || []).map((recipe: any) => ({
        id: recipe.id,
        titulo: recipe.titulo,
        title: recipe.titulo,
        descricao: recipe.descricao,
        description: recipe.descricao,
        imagem_url: recipe.imagem_url || '/placeholder.svg',
        imageUrl: recipe.imagem_url || '/placeholder.svg',
        tempo_preparo: recipe.tempo_preparo,
        preparationTime: recipe.tempo_preparo,
        porcoes: recipe.porcoes,
        servings: recipe.porcoes,
        dificuldade: recipe.dificuldade,
        difficulty: recipe.dificuldade,
        nota_media: recipe.nota_media || 0,
        rating: recipe.nota_media || 0,
        avaliacoes_count: recipe.avaliacoes_count || 0,
        created_at: recipe.created_at,
        usuario_id: recipe.usuario_id,
        author: {
          id: recipe.usuario_id,
          name: recipe.profiles?.nome || 'Chef Anônimo',
          avatarUrl: recipe.profiles?.avatar_url || '/placeholder.svg'
        },
        categories: recipe.receita_categorias?.map((rc: any) => rc.categorias?.nome).filter(Boolean) || [],
        macros: {
          calories: recipe.informacao_nutricional?.[0]?.calorias_totais || 0,
          protein: recipe.informacao_nutricional?.[0]?.proteinas_totais || 0,
          carbs: recipe.informacao_nutricional?.[0]?.carboidratos_totais || 0,
          fat: recipe.informacao_nutricional?.[0]?.gorduras_totais || 0
        }
      }));

      setUserRecipes(formattedUserRecipes);
      setSavedRecipes(formattedSavedRecipes);
      setFeaturedChefs(chefsData || []);
      setRecommendedRecipes(formattedRecommended);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitcooker-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando seu dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-orange-50/20">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 text-white py-16"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Bem-vindo de volta, {user.user_metadata?.nome || user.email?.split('@')[0]}!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-orange-100 mb-8"
              >
                Seu mundo culinário te espera
              </motion.p>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6 py-12">
          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <ChefHat className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-blue-700 mb-2">{userStats.recipesCount}</p>
                <p className="text-blue-600">Suas Receitas</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-pink-700 mb-2">{userStats.savedRecipesCount}</p>
                <p className="text-pink-600">Receitas Salvas</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-green-700 mb-2">{userStats.totalViews}</p>
                <p className="text-green-600">Total de Visualizações</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center md:text-left mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold mb-2">Pronto para criar algo delicioso?</h3>
                    <p className="text-orange-100">Compartilhe uma nova receita com a comunidade</p>
                  </div>
                  <Button
                    onClick={() => navigate('/add-recipe')}
                    className="bg-white text-fitcooker-orange hover:bg-orange-50"
                    size="lg"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Nova Receita
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* User's Recipes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Suas Receitas</h2>
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="hover:bg-fitcooker-orange hover:text-white"
              >
                Ver Todas
              </Button>
            </div>
            {userRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Você ainda não criou nenhuma receita</p>
                  <Button
                    onClick={() => navigate('/add-recipe')}
                    className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                  >
                    Criar Primeira Receita
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Saved Recipes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Receitas Salvas</h2>
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="hover:bg-fitcooker-orange hover:text-white"
              >
                Ver Todas
              </Button>
            </div>
            {savedRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Você ainda não salvou nenhuma receita</p>
                  <Button
                    onClick={() => navigate('/recipes')}
                    className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                  >
                    Explorar Receitas
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Featured Chefs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chefs em Destaque</h2>
              <Button
                variant="outline"
                onClick={() => navigate('/cooks')}
                className="hover:bg-fitcooker-orange hover:text-white"
              >
                Ver Todos
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredChefs.map((chef, index) => (
                <motion.div
                  key={chef.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        {chef.avatar_url ? (
                          <img
                            src={chef.avatar_url}
                            alt={chef.nome}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-10 h-10 text-white" />
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{chef.nome}</h3>
                      <p className="text-gray-600 text-sm mb-3">{chef.bio || 'Chef apaixonado pela culinária'}</p>
                      <div className="flex justify-center space-x-4 text-sm text-gray-500">
                        <span>{chef.receitas_count || 0} receitas</span>
                        <span>{chef.seguidores_count || 0} seguidores</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recommended Recipes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Receitas Recomendadas</h2>
              <Button
                variant="outline"
                onClick={() => navigate('/recipes')}
                className="hover:bg-fitcooker-orange hover:text-white"
              >
                Ver Mais
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedRecipes.slice(0, 6).map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + (index * 0.1) }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
