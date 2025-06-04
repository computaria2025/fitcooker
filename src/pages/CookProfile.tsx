
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChefHat, Users, BookOpen, Star, MapPin, Calendar, Heart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useProfiles } from '@/hooks/useProfiles';
import { useRecipes } from '@/hooks/useRecipes';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const CookProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getProfile, toggleFollow, isFollowing } = useProfiles();
  const { fetchRecipes } = useRecipes();
  
  const [profile, setProfile] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recipesLoading, setRecipesLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) return;
      
      setLoading(true);
      const profileData = await getProfile(id);
      setProfile(profileData);
      
      if (user) {
        const followStatus = await isFollowing(id);
        setFollowing(followStatus);
      }
      
      setLoading(false);
    };

    const loadRecipes = async () => {
      if (!id) return;
      
      setRecipesLoading(true);
      // Note: This would need to be implemented in useRecipes hook
      // For now, we'll use an empty array
      setRecipes([]);
      setRecipesLoading(false);
    };

    loadProfile();
    loadRecipes();
  }, [id, getProfile, isFollowing, user]);

  const handleFollow = async () => {
    if (!user || !id) return;
    
    const newFollowState = await toggleFollow(id);
    if (newFollowState !== undefined) {
      setFollowing(newFollowState);
      if (profile) {
        setProfile({
          ...profile,
          seguidores_count: newFollowState
            ? profile.seguidores_count + 1
            : profile.seguidores_count - 1
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              {/* Profile Header Skeleton */}
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <Skeleton className="w-32 h-32 rounded-full" />
                    <div className="flex-1 text-center md:text-left">
                      <Skeleton className="h-8 w-48 mx-auto md:mx-0 mb-2" />
                      <Skeleton className="h-4 w-32 mx-auto md:mx-0 mb-4" />
                      <Skeleton className="h-16 w-full mb-4" />
                      <div className="flex justify-center md:justify-start gap-4 mb-4">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Content Skeleton */}
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Perfil não encontrado</h1>
            <Link to="/cooks">
              <Button>Voltar para Chefs</Button>
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
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage src={profile.avatar_url} alt={profile.nome} />
                      <AvatarFallback className="text-4xl font-bold bg-fitcooker-orange text-white">
                        {profile.nome.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {profile.is_chef && (
                      <div className="absolute -bottom-2 -right-2">
                        <Badge className="bg-fitcooker-orange text-white">
                          <ChefHat size={14} className="mr-1" />
                          Chef
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profile.nome}
                    </h1>
                    
                    <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                      <Calendar size={16} className="mr-2" />
                      <span>Membro desde {new Date(profile.data_cadastro).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    {profile.bio && (
                      <p className="text-gray-600 mb-6 max-w-2xl">
                        {profile.bio}
                      </p>
                    )}
                    
                    <div className="flex justify-center md:justify-start gap-6 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center text-fitcooker-orange">
                          <BookOpen size={20} className="mr-1" />
                          <span className="text-2xl font-bold">{profile.receitas_count}</span>
                        </div>
                        <span className="text-gray-500 text-sm">Receitas</span>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center text-fitcooker-orange">
                          <Users size={20} className="mr-1" />
                          <span className="text-2xl font-bold">{profile.seguidores_count}</span>
                        </div>
                        <span className="text-gray-500 text-sm">Seguidores</span>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center text-fitcooker-orange">
                          <Heart size={20} className="mr-1" />
                          <span className="text-2xl font-bold">{profile.seguindo_count}</span>
                        </div>
                        <span className="text-gray-500 text-sm">Seguindo</span>
                      </div>
                    </div>
                    
                    {user && user.id !== profile.id && (
                      <Button
                        onClick={handleFollow}
                        className={`${
                          following
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white'
                        }`}
                      >
                        {following ? 'Seguindo' : 'Seguir Chef'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="recipes" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recipes">Receitas</TabsTrigger>
                <TabsTrigger value="about">Sobre</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recipes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Receitas do Chef</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recipesLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <Skeleton key={i} className="h-32 w-full" />
                        ))}
                      </div>
                    ) : recipes.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🍳</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma receita ainda</h3>
                        <p className="text-gray-600">
                          {profile.nome} ainda não publicou nenhuma receita.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recipes.map((recipe) => (
                          <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                            <Card className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  {recipe.imagem_url ? (
                                    <img
                                      src={recipe.imagem_url}
                                      alt={recipe.titulo}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-fitcooker-orange rounded-lg flex items-center justify-center">
                                      <span className="text-2xl">🍽️</span>
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                      {recipe.titulo}
                                    </h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                      {recipe.descricao}
                                    </p>
                                    <div className="flex items-center mt-2 text-xs text-gray-500">
                                      <Star size={12} className="mr-1 fill-yellow-400 text-yellow-400" />
                                      {recipe.nota_media || 0}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre {profile.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.bio ? (
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {profile.bio}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">👤</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sem informações ainda</h3>
                        <p className="text-gray-600">
                          {profile.nome} ainda não adicionou informações sobre si.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Avaliações Recebidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">⭐</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Em breve</h3>
                      <p className="text-gray-600">
                        Sistema de avaliações de chefs em desenvolvimento.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CookProfile;
