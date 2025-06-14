import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Calendar, Users, ChefHat, Star, Trash2, Edit, Heart, UserPlus, UserMinus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRecipes } from '@/hooks/useRecipes';
import { useDeleteRecipe } from '@/hooks/useDeleteRecipe';
import { useUserStats } from '@/hooks/useUserStats';
import { useFollowers } from '@/hooks/useFollowers';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload';
import FollowersDialog from '@/components/ui/FollowersDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Recipe } from '@/types/recipe';
import { useToast } from '@/hooks/use-toast';
import PreferencesSelector from '@/components/ui/PreferencesSelector';

const Profile: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const { data: allRecipes, loading, refetch } = useRecipes();
  const { deleteRecipe, isDeleting } = useDeleteRecipe();
  const { stats, loading: statsLoading, refetch: refetchStats } = useUserStats(user?.id);
  const { 
    followers, 
    following, 
    fetchFollowers, 
    fetchFollowing 
  } = useFollowers(user?.id);
  const { toast } = useToast();

  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    nome: profile?.nome || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
    preferencias: profile?.preferencias || []
  });

  useEffect(() => {
    if (allRecipes && user) {
      const recipes = allRecipes.filter(recipe => recipe.usuario_id === user.id);
      setUserRecipes(recipes);
    }
  }, [allRecipes, user]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        nome: profile.nome || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        preferencias: profile.preferencias || []
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
    }
  }, [user]);

  const fetchSavedRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('receitas_salvas')
        .select(`
          receita_id,
          receitas (
            *,
            profiles(nome, avatar_url),
            receita_categorias(categorias(nome)),
            informacao_nutricional(*)
          )
        `)
        .eq('usuario_id', user.id);

      if (error) throw error;

      const formattedSavedRecipes: Recipe[] = (data || []).map((item: any) => {
        const recipe = item.receitas;
        return {
          id: recipe.id,
          titulo: recipe.titulo,
          descricao: recipe.descricao,
          imagem_url: recipe.imagem_url || '/placeholder.svg',
          tempo_preparo: recipe.tempo_preparo,
          porcoes: recipe.porcoes,
          dificuldade: recipe.dificuldade,
          nota_media: recipe.nota_media || 0,
          avaliacoes_count: recipe.avaliacoes_count || 0,
          created_at: recipe.created_at,
          usuario_id: recipe.usuario_id,
          title: recipe.titulo,
          description: recipe.descricao,
          imageUrl: recipe.imagem_url || '/placeholder.svg',
          preparationTime: recipe.tempo_preparo,
          servings: recipe.porcoes,
          difficulty: recipe.dificuldade,
          rating: recipe.nota_media || 0,
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

      setSavedRecipes(formattedSavedRecipes);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    }
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    const success = await deleteRecipe(recipeId);
    if (success) {
      setUserRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      refetch();
      refetchStats();
    }
  };

  const handleUnsaveRecipe = async (recipeId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('receitas_salvas')
        .delete()
        .eq('usuario_id', user.id)
        .eq('receita_id', recipeId);

      if (error) throw error;

      setSavedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      toast({
        title: "Receita removida!",
        description: "A receita foi removida dos seus favoritos.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a receita dos favoritos.",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    try {
      await updateProfile({
        nome: profileData.nome,
        bio: profileData.bio,
        preferencias: profileData.preferencias
      });

      setEditingProfile(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = (url: string) => {
    setProfileData(prev => ({ ...prev, avatar_url: url }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p>Você precisa estar logado para ver seu perfil.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-12 pt-40">
        <div className="container mx-auto px-4 md:px-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <ProfilePictureUpload
                  currentAvatarUrl={profile?.avatar_url}
                  onUploadComplete={handleAvatarUpload}
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{profile?.nome || 'Chef'}</h1>
                  <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Perfil</DialogTitle>
                        <DialogDescription>
                          Atualize suas informações pessoais
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nome">Nome</Label>
                          <Input
                            id="nome"
                            value={profileData.nome}
                            onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            placeholder="Conte um pouco sobre você..."
                          />
                        </div>
                        <PreferencesSelector
                          preferences={profileData.preferencias}
                          onChange={(preferences) => setProfileData({ ...profileData, preferencias })}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingProfile(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleProfileUpdate}>
                          Salvar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <p className="text-gray-600 mb-4">{profile?.bio || 'Apaixonado por culinária e vida saudável'}</p>

                {/* Display preferences */}
                {profile?.preferencias && profile.preferencias.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.preferencias.map((preference, index) => (
                      <Badge key={index} variant="outline" className="text-fitcooker-orange border-fitcooker-orange">
                        {preference}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Membro desde {new Date(profile?.data_cadastro || '').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </div>
                  <button
                    onClick={() => setFollowersDialogOpen(true)}
                    className="flex items-center gap-1 hover:text-fitcooker-orange transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    {statsLoading ? '...' : stats.seguidores_count} seguidores
                  </button>
                  <button
                    onClick={() => setFollowingDialogOpen(true)}
                    className="flex items-center gap-1 hover:text-fitcooker-orange transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    {statsLoading ? '...' : stats.seguindo_count} seguindo
                  </button>
                  <div className="flex items-center gap-1">
                    <ChefHat className="w-4 h-4" />
                    {statsLoading ? '...' : stats.receitas_count} receitas
                  </div>
                </div>

                {profile?.is_chef && (
                  <Badge className="bg-fitcooker-orange text-white">
                    Chef Verificado
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center"
            >
              <ChefHat className="w-12 h-12 text-fitcooker-orange mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : stats.receitas_count}
              </h3>
              <p className="text-gray-600">Receitas Criadas</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center"
            >
              <Users className="w-12 h-12 text-fitcooker-orange mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : stats.seguidores_count}
              </h3>
              <p className="text-gray-600">Seguidores</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center"
            >
              <Star className="w-12 h-12 text-fitcooker-orange mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : (stats.nota_media || '0.0')}
              </h3>
              <p className="text-gray-600">Avaliação Média</p>
            </motion.div>
          </div>

          {/* User Recipes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Minhas Receitas</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <p>Carregando receitas...</p>
              </div>
            ) : userRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userRecipes.map((recipe) => (
                  <div key={recipe.id} className="relative group">
                    <RecipeCard recipe={recipe} />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Receita</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a receita "{recipe.titulo}"? 
                            Esta ação não pode ser desfeita e a receita será removida permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteRecipe(recipe.id)}
                            className="bg-red-500 hover:bg-red-600"
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Excluindo...' : 'Excluir'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-600 mb-3">
                  Nenhuma receita encontrada
                </h3>
                <p className="text-gray-500">
                  Que tal criar sua primeira receita deliciosa?
                </p>
                <Button className="mt-4 bg-fitcooker-orange hover:bg-orange-600">
                  Criar Receita
                </Button>
              </div>
            )}
          </motion.div>

          {/* Saved Recipes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Receitas Favoritas</h2>
            
            {savedRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((recipe) => (
                  <div key={recipe.id} className="relative group">
                    <RecipeCard recipe={recipe} />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover dos Favoritos</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover "{recipe.titulo}" dos seus favoritos?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleUnsaveRecipe(recipe.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-600 mb-3">
                  Nenhuma receita favorita
                </h3>
                <p className="text-gray-500">
                  Explore receitas e adicione suas favoritas aqui!
                </p>
              </div>
            )}
          </motion.div>

          {/* Dialogs */}
          <FollowersDialog
            open={followersDialogOpen}
            onOpenChange={setFollowersDialogOpen}
            type="followers"
            data={followers}
            onFetch={() => fetchFollowers(user.id)}
            onUpdate={refetchStats}
          />

          <FollowersDialog
            open={followingDialogOpen}
            onOpenChange={setFollowingDialogOpen}
            type="following"
            data={following}
            onFetch={() => fetchFollowing(user.id)}
            onUpdate={refetchStats}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
