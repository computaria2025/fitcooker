
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Calendar, Users, ChefHat, Star, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRecipes } from '@/hooks/useRecipes';
import { useDeleteRecipe } from '@/hooks/useDeleteRecipe';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Recipe } from '@/types/recipe';

const Profile: React.FC = () => {
  const { user, profile } = useAuth();
  const { data: allRecipes, loading, refetch } = useRecipes();
  const { deleteRecipe, isDeleting } = useDeleteRecipe();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    nome: profile?.nome || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || ''
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
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  const handleDeleteRecipe = async (recipeId: number) => {
    const success = await deleteRecipe(recipeId);
    if (success) {
      // Atualizar a lista local de receitas
      setUserRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      // Refetch para sincronizar com o banco
      refetch();
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: profileData.nome,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url
        })
        .eq('id', user.id);

      if (error) throw error;

      setEditingProfile(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
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
                <img
                  src={profile?.avatar_url || '/placeholder.svg'}
                  alt={profile?.nome || 'Usuário'}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-2 right-2 bg-fitcooker-orange text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
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
                        <div>
                          <Label htmlFor="avatar">URL da Foto</Label>
                          <Input
                            id="avatar"
                            value={profileData.avatar_url}
                            onChange={(e) => setProfileData({ ...profileData, avatar_url: e.target.value })}
                            placeholder="https://exemplo.com/foto.jpg"
                          />
                        </div>
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

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Membro desde {new Date(profile?.data_cadastro || '').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {profile?.seguidores_count || 0} seguidores
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="w-4 h-4" />
                    {userRecipes.length} receitas
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
              <h3 className="text-2xl font-bold text-gray-900">{userRecipes.length}</h3>
              <p className="text-gray-600">Receitas Criadas</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center"
            >
              <Users className="w-12 h-12 text-fitcooker-orange mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">{profile?.seguidores_count || 0}</h3>
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
                {userRecipes.length > 0 
                  ? (userRecipes.reduce((acc, recipe) => acc + (recipe.nota_media || 0), 0) / userRecipes.length).toFixed(1)
                  : '0.0'
                }
              </h3>
              <p className="text-gray-600">Avaliação Média</p>
            </motion.div>
          </div>

          {/* User Recipes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-lg p-8"
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
                    
                    {/* Delete Button Overlay */}
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
