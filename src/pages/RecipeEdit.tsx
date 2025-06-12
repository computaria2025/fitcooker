
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader } from 'lucide-react';

const RecipeEdit: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [recipe, setRecipe] = useState({
    titulo: '',
    descricao: '',
    tempo_preparo: 0,
    porcoes: 0,
    dificuldade: 'Fácil',
    imagem_url: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (id) {
      fetchRecipe();
    }
  }, [id, user, navigate]);

  const fetchRecipe = async () => {
    if (!id || !user) return;

    try {
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .eq('id', id)
        .eq('usuario_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching recipe:', error);
        toast({
          title: "Erro",
          description: "Receita não encontrada ou você não tem permissão para editá-la.",
          variant: "destructive",
        });
        navigate('/profile');
        return;
      }

      setRecipe({
        titulo: data.titulo,
        descricao: data.descricao,
        tempo_preparo: data.tempo_preparo,
        porcoes: data.porcoes,
        dificuldade: data.dificuldade,
        imagem_url: data.imagem_url || ''
      });
    } catch (error) {
      console.error('Error fetching recipe:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a receita.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('receitas')
        .update({
          titulo: recipe.titulo,
          descricao: recipe.descricao,
          tempo_preparo: recipe.tempo_preparo,
          porcoes: recipe.porcoes,
          dificuldade: recipe.dificuldade,
          imagem_url: recipe.imagem_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('usuario_id', user.id);

      if (error) throw error;

      toast({
        title: "Receita atualizada!",
        description: "Suas alterações foram salvas com sucesso.",
      });

      navigate('/profile');
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar a receita.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-fitcooker-orange/20 border-t-fitcooker-orange mx-auto mb-6"></div>
            <Loader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-fitcooker-orange" />
          </div>
          <p className="text-gray-600 font-medium">Carregando receita...</p>
        </motion.div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Perfil
            </Button>
            
            <div className="bg-gradient-to-r from-fitcooker-orange to-orange-600 rounded-xl p-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Editar Receita</h1>
              <p className="text-orange-100">
                Atualize as informações da sua receita
              </p>
            </div>
          </motion.div>

          {/* Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Informações da Receita</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                        Título da Receita
                      </label>
                      <Input
                        id="titulo"
                        type="text"
                        value={recipe.titulo}
                        onChange={(e) => setRecipe(prev => ({ ...prev, titulo: e.target.value }))}
                        placeholder="Nome da sua receita"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="imagem_url" className="block text-sm font-medium text-gray-700 mb-2">
                        URL da Imagem
                      </label>
                      <Input
                        id="imagem_url"
                        type="url"
                        value={recipe.imagem_url}
                        onChange={(e) => setRecipe(prev => ({ ...prev, imagem_url: e.target.value }))}
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <Textarea
                      id="descricao"
                      value={recipe.descricao}
                      onChange={(e) => setRecipe(prev => ({ ...prev, descricao: e.target.value }))}
                      placeholder="Descreva sua receita..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="tempo_preparo" className="block text-sm font-medium text-gray-700 mb-2">
                        Tempo de Preparo (min)
                      </label>
                      <Input
                        id="tempo_preparo"
                        type="number"
                        value={recipe.tempo_preparo}
                        onChange={(e) => setRecipe(prev => ({ ...prev, tempo_preparo: parseInt(e.target.value) || 0 }))}
                        placeholder="30"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="porcoes" className="block text-sm font-medium text-gray-700 mb-2">
                        Porções
                      </label>
                      <Input
                        id="porcoes"
                        type="number"
                        value={recipe.porcoes}
                        onChange={(e) => setRecipe(prev => ({ ...prev, porcoes: parseInt(e.target.value) || 0 }))}
                        placeholder="4"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="dificuldade" className="block text-sm font-medium text-gray-700 mb-2">
                        Dificuldade
                      </label>
                      <select
                        id="dificuldade"
                        value={recipe.dificuldade}
                        onChange={(e) => setRecipe(prev => ({ ...prev, dificuldade: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fitcooker-orange focus:border-transparent"
                        required
                      >
                        <option value="Fácil">Fácil</option>
                        <option value="Médio">Médio</option>
                        <option value="Difícil">Difícil</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/profile')}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                    >
                      {isSaving ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Salvando...
                        </div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeEdit;
