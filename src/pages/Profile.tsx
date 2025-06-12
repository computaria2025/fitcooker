
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, BookOpen, Heart, Save, Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RecipeCard from '@/components/ui/RecipeCard';
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload';
import { Recipe } from '@/types/recipe';

interface ProfileStats {
  receitas_count: number;
  seguidores_count: number;
  seguindo_count: number;
}

interface SavedRecipe {
  id: number;
  created_at: string;
  receitas: Recipe;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<ProfileStats>({ receitas_count: 0, seguidores_count: 0, seguindo_count: 0 });
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    bio: '',
    preferencias: [] as string[],
  });
  const [newPreference, setNewPreference] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserRecipes();
      fetchSavedRecipes();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setStats({
        receitas_count: data.receitas_count || 0,
        seguidores_count: data.seguidores_count || 0,
        seguindo_count: data.seguindo_count || 0,
      });
      setFormData({
        nome: data.nome || '',
        bio: data.bio || '',
        preferencias: data.preferencias || [],
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(nome, avatar_url),
          receita_categorias(categorias(nome)),
          informacao_nutricional(*)
        `)
        .eq('usuario_id', user.id)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedRecipes = data?.map(recipe => ({
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

      setUserRecipes(transformedRecipes);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    }
  };

  const fetchSavedRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('receitas_salvas')
        .select(`
          *,
          receitas(
            *,
            profiles(nome, avatar_url),
            receita_categorias(categorias(nome)),
            informacao_nutricional(*)
          )
        `)
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedRecipes(data || []);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: formData.nome,
          bio: formData.bio,
          preferencias: formData.preferencias,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { nome: formData.nome }
      });

      if (authError) console.error('Error updating auth metadata:', authError);

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });

      fetchProfile();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (avatarUrl: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (error) throw error;

      // Update user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl }
      });

      if (authError) console.error('Error updating auth metadata:', authError);

      setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const addPreference = () => {
    if (newPreference.trim() && !formData.preferencias.includes(newPreference.trim())) {
      setFormData(prev => ({
        ...prev,
        preferencias: [...prev.preferencias, newPreference.trim()]
      }));
      setNewPreference('');
    }
  };

  const removePreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      preferencias: prev.preferencias.filter(p => p !== preference)
    }));
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    try {
      const { error } = await supabase
        .from('receitas')
        .update({ status: 'inativa' })
        .eq('id', recipeId)
        .eq('usuario_id', user?.id);

      if (error) throw error;

      toast({
        title: "Receita excluída!",
        description: "A receita foi removida com sucesso.",
      });

      fetchUserRecipes();
      fetchProfile(); // Update recipe count
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a receita.",
        variant: "destructive",
      });
    }
  };

  const handleUnsaveRecipe = async (recipeId: number) => {
    try {
      const { error } = await supabase
        .from('receitas_salvas')
        .delete()
        .eq('receita_id', recipeId)
        .eq('usuario_id', user?.id);

      if (error) throw error;

      toast({
        title: "Receita removida!",
        description: "A receita foi removida dos seus favoritos.",
      });

      fetchSavedRecipes();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a receita dos favoritos.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitcooker-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando perfil...</p>
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
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 rounded-3xl p-8 mb-8 text-white"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage src={profile?.avatar_url} className="object-cover" />
                  <AvatarFallback className="text-4xl bg-white text-fitcooker-orange">
                    <User className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile?.nome || 'Usuário'}</h1>
                {profile?.bio && (
                  <p className="text-orange-100 text-lg mb-4">{profile.bio}</p>
                )}
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.receitas_count}</div>
                    <div className="text-orange-200 text-sm">Receitas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.seguidores_count}</div>
                    <div className="text-orange-200 text-sm">Seguidores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.seguindo_count}</div>
                    <div className="text-orange-200 text-sm">Seguindo</div>
                  </div>
                </div>

                {profile?.preferencias && profile.preferencias.length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {profile.preferencias.map((pref: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-white/20 border-white/30 text-white">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="perfil" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="receitas">Minhas Receitas</TabsTrigger>
              <TabsTrigger value="favoritas">Favoritas</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="perfil">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nome</label>
                      <Input
                        value={formData.nome}
                        onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Bio</label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Conte um pouco sobre você..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleProfileUpdate} disabled={updating} className="w-full">
                      {updating ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Foto de Perfil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfilePictureUpload
                      currentAvatarUrl={profile?.avatar_url}
                      onUploadComplete={handleAvatarUpload}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preferências Culinárias</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newPreference}
                        onChange={(e) => setNewPreference(e.target.value)}
                        placeholder="Adicionar preferência..."
                        onKeyPress={(e) => e.key === 'Enter' && addPreference()}
                      />
                      <Button onClick={addPreference}>Adicionar</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.preferencias.map((pref, index) => (
                        <Badge key={index} variant="outline" className="group">
                          {pref}
                          <button
                            onClick={() => removePreference(pref)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Button onClick={handleProfileUpdate} disabled={updating} className="w-full">
                      {updating ? 'Salvando...' : 'Salvar Preferências'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* My Recipes Tab */}
            <TabsContent value="receitas">
              <Card>
                <CardHeader>
                  <CardTitle>Minhas Receitas ({userRecipes.length})</CardTitle>
                  <CardDescription>
                    Gerencie suas receitas criadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userRecipes.map((recipe) => (
                        <div key={recipe.id} className="relative group">
                          <RecipeCard recipe={recipe} />
                          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white/90"
                              onClick={() => window.open(`/recipe/edit/${recipe.id}`, '_blank')}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="bg-red-500/90"
                              onClick={() => handleDeleteRecipe(recipe.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Você ainda não criou nenhuma receita</p>
                      <Button asChild>
                        <a href="/add-recipe">Criar Primeira Receita</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Saved Recipes Tab */}
            <TabsContent value="favoritas">
              <Card>
                <CardHeader>
                  <CardTitle>Receitas Salvas ({savedRecipes.length})</CardTitle>
                  <CardDescription>
                    Suas receitas favoritas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedRecipes.map((savedRecipe) => {
                        const recipe = savedRecipe.receitas;
                        const transformedRecipe: Recipe = {
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
                            id: (recipe as any).profiles?.id || recipe.usuario_id,
                            name: (recipe as any).profiles?.nome || 'Chef Anônimo',
                            avatarUrl: (recipe as any).profiles?.avatar_url || '',
                          },
                          categories: (recipe as any).receita_categorias?.map((rc: any) => rc.categorias?.nome).filter(Boolean) || [],
                          macros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
                        };

                        return (
                          <div key={savedRecipe.id} className="relative group">
                            <RecipeCard recipe={transformedRecipe} />
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="destructive"
                                className="bg-red-500/90"
                                onClick={() => handleUnsaveRecipe(recipe.id)}
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Você ainda não salvou nenhuma receita</p>
                      <Button asChild>
                        <a href="/recipes">Explorar Receitas</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="configuracoes">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Conta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <Input value={user?.email || ''} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Data de Cadastro</label>
                      <Input value={profile?.data_cadastro ? new Date(profile.data_cadastro).toLocaleDateString('pt-BR') : ''} disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
