
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Users, Star, Award, ArrowLeft, Calendar, UserPlus, UserMinus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFollowers } from '@/hooks/useFollowers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RecipeCard from '@/components/ui/RecipeCard';
import { Recipe } from '@/types/recipe';

interface ChefProfile {
  id: string;
  nome: string;
  bio: string | null;
  avatar_url: string | null;
  data_cadastro: string;
  is_chef: boolean;
  preferencias: string[] | null;
  receitas_count: number;
  seguidores_count: number;
  seguindo_count: number;
  nota_media: number | null;
}

const CookProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFollowing, loading: followLoading, toggleFollow } = useFollowers(id);
  const [chef, setChef] = useState<ChefProfile | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      let chefData = fetchChefProfile();
      fetchChefRecipes(chefData);
    }
  }, [id]);

  const fetchChefProfile = async () => {
    if (!id) return;

    try {
      console.log('Fetching chef profile for ID:', id);

      // Get profile data first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', id)
        .single();

      if (profileError) {
        console.error('Error fetching chef profile:', profileError);
        setError('Chef não encontrado');
        return;
      }

      // Get real recipe count
      const { data: recipesData, error: recipesError } = await supabase
        .from('receitas')
        .select('id')
        .eq('usuario_id', id)
        .eq('status', 'ativa');

      const realRecipeCount = recipesData?.length || 0;

      // Get real followers count
      const { data: followersData, error: followersError } = await supabase
        .from('seguidores')
        .select('id')
        .eq('seguido_id', id);

      const realFollowersCount = followersData?.length || 0;

      // Get real following count
      const { data: followingData, error: followingError } = await supabase
        .from('seguidores')
        .select('id')
        .eq('seguidor_id', id);

      const realFollowingCount = followingData?.length || 0;

      // Calculate average rating for this chef based on their recipes
      const { data: recipeRatings } = await supabase
        .from('receitas')
        .select('nota_media')
        .eq('usuario_id', id)
        .not('nota_media', 'is', null);

      let averageRating = null;
      if (recipeRatings && recipeRatings.length > 0) {
        const validRatings = recipeRatings.filter(r => r.nota_media > 0);
        if (validRatings.length > 0) {
          averageRating = validRatings.reduce((sum, recipe) => sum + recipe.nota_media, 0) / validRatings.length;
        }
      }

      let chefData : ChefProfile = {
        id: profileData.user_id,
        nome: profileData.nome,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url,
        data_cadastro: profileData.created_at,
        is_chef: realRecipeCount > 0,
        preferencias: profileData.restricoes_alimentares || [],
        receitas_count: realRecipeCount,
        seguidores_count: realFollowersCount,
        seguindo_count: realFollowingCount,
        nota_media: averageRating ? Number(averageRating.toFixed(1)) : null
      };
      setChef(chefData);
      return chefData;
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Erro ao carregar perfil do chef');
      return null;
    }
  };

  const fetchChefRecipes = async (chefPromise : Promise<ChefProfile>) => {
    if (!id) return;

    try {
      let chefData : ChefProfile = await chefPromise;
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .eq('usuario_id', id)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedRecipes = data?.map((recipe: any) => ({
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
          id: recipe.usuario_id,
          name: chefData?.nome || 'Chef Anônimo',
          avatarUrl: chefData?.avatar_url || '',
        },
        categories: [],
        macros: {
          calories: Math.round((recipe.calorias_total || 0) / (recipe.porcoes || 1)),
          protein: Math.round((recipe.proteinas_total || 0) / (recipe.porcoes || 1)),
          carbs: Math.round((recipe.carboidratos_total || 0) / (recipe.porcoes || 1)),
          fat: Math.round((recipe.gorduras_total || 0) / (recipe.porcoes || 1)),
          fiber: Math.round((recipe.fibras_total || 0) / (recipe.porcoes || 1)),
          sodium: Math.round((recipe.sodio_total || 0) / (recipe.porcoes || 1)),
        },
      })) || [];

      setRecipes(transformedRecipes);
    } catch (error) {
      console.error('Error fetching chef recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitcooker-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando perfil do chef...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !chef) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32">
          <div className="text-center">
            <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{error || 'Chef não encontrado'}</h2>
            <p className="text-gray-600 mb-8">O perfil que você está procurando não existe ou foi removido.</p>
            <Button onClick={() => navigate('/cooks')} className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Chefs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwnProfile = user?.id === chef.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-8 pt-32">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back Button */}
          <Button
            onClick={() => navigate('/cooks')}
            variant="outline"
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Chefs
          </Button>

          {/* Chef Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 rounded-3xl p-8 mb-8 text-white"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage src={chef.avatar_url || ''} className="object-cover" />
                  <AvatarFallback className="text-4xl bg-white text-fitcooker-orange">
                    <ChefHat className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
                {chef.is_chef && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Award className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{chef.nome}</h1>
                  {chef.is_chef && (
                    <Badge className="bg-white/20 border-white/30 text-white">
                      <ChefHat className="w-3 h-3 mr-1" />
                      Chef Verificado
                    </Badge>
                  )}
                </div>
                
                {chef.bio && (
                  <p className="text-orange-100 text-lg mb-6">{chef.bio}</p>
                )}
                
                <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{chef.receitas_count}</div>
                    <div className="text-orange-200">Receitas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{chef.seguidores_count}</div>
                    <div className="text-orange-200">Seguidores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{chef.seguindo_count}</div>
                    <div className="text-orange-200">Seguindo</div>
                  </div>
                  {chef.nota_media && (
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="w-6 h-6 text-yellow-300 fill-current" />
                        <span className="text-3xl font-bold">{chef.nota_media}</span>
                      </div>
                      <div className="text-orange-200">Avaliação</div>
                    </div>
                  )}
                </div>

                {/* Follow Button */}
                {user && !isOwnProfile && (
                  <div className="mb-6">
                    <Button
                      onClick={toggleFollow}
                      disabled={followLoading}
                      className={`${
                        isFollowing 
                          ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' 
                          : 'bg-white text-fitcooker-orange hover:bg-white/90'
                      } border`}
                      variant={isFollowing ? 'outline' : 'default'}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4 mr-2" />
                          Deixar de Seguir
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Seguir
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {chef.preferencias && chef.preferencias.length > 0 && (
                  <div>
                    <h3 className="text-orange-200 text-sm font-medium mb-2">Preferências:</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {chef.preferencias.map((pref, index) => (
                        <Badge key={index} variant="outline" className="bg-white/20 border-white/30 text-white">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center md:justify-start space-x-4 mt-6 text-orange-200 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Desde {new Date(chef.data_cadastro).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chef's Recipes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChefHat className="w-5 h-5 text-fitcooker-orange" />
                  <span>Receitas de {chef.nome} ({recipes.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe, index) => (
                      <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <RecipeCard recipe={recipe} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Este chef ainda não publicou nenhuma receita</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CookProfile;
