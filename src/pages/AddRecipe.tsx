import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Save, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BasicInformation from '@/components/add-recipe/BasicInformation';
import Ingredients from '@/components/add-recipe/Ingredients';
import Steps from '@/components/add-recipe/Steps';
import MediaUpload from '@/components/add-recipe/MediaUpload';
import RecipePreview from '@/components/add-recipe/RecipePreview';
import LoginPrompt from '@/components/add-recipe/LoginPrompt';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IngredientProcessingService } from '@/services/IngredientProcessingService';

const AddRecipe: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [recipeData, setRecipeData] = useState({
    titulo: '',
    descricao: '',
    tempo_preparo: 30,
    porcoes: 4,
    dificuldade: 'media' as 'facil' | 'media' | 'dificil',
    categorias: [] as number[],
    ingredientes: [] as Array<{
      ingrediente_id: number | null;
      nome: string;
      quantidade: number;
      unidade: string;
      ordem: number;
    }>,
    passos: [] as Array<{ numero_passo: number; descricao: string }>,
    media: [] as Array<{ file: File; type: 'image' | 'video'; ordem: number }>,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const updateRecipeData = (field: string, value: any) => {
    setRecipeData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const saveRecipe = async (status: 'rascunho' | 'ativa') => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para salvar uma receita.',
        variant: 'destructive',
      });
      return;
    }

    // Validações básicas
    if (!recipeData.titulo.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, adicione um título para a receita.',
        variant: 'destructive',
      });
      return;
    }

    if (status === 'ativa') {
      if (recipeData.ingredientes.length === 0) {
        toast({
          title: 'Erro',
          description: 'Por favor, adicione pelo menos um ingrediente.',
          variant: 'destructive',
        });
        return;
      }

      if (recipeData.passos.length === 0) {
        toast({
          title: 'Erro',
          description: 'Por favor, adicione pelo menos um passo.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsSaving(true);

    try {
      // Processar ingredientes e calcular macros
      const processedIngredients = await IngredientProcessingService.processIngredients(
        recipeData.ingredientes
      );

      const totals = IngredientProcessingService.calculateTotals(processedIngredients);

      // Inserir receita
      const { data: receitaData, error: receitaError } = await supabase
        .from('receitas')
        .insert({
          usuario_id: user.id,
          titulo: recipeData.titulo,
          descricao: recipeData.descricao,
          tempo_preparo: recipeData.tempo_preparo,
          porcoes: recipeData.porcoes,
          dificuldade: recipeData.dificuldade,
          calorias_total: totals.calories,
          proteinas_total: totals.protein,
          carboidratos_total: totals.carbs,
          gorduras_total: totals.fat,
          fibras_total: totals.fiber,
          sodio_total: totals.sodium,
          status: status,
        })
        .select()
        .single();

      if (receitaError) throw receitaError;

      // Inserir categorias
      if (recipeData.categorias.length > 0) {
        const categoriaInserts = recipeData.categorias.map(catId => ({
          receita_id: receitaData.id,
          categoria_id: catId,
        }));

        const { error: categoriaError } = await supabase
          .from('receita_categorias')
          .insert(categoriaInserts);

        if (categoriaError) throw categoriaError;
      }

      // Inserir ingredientes
      if (recipeData.ingredientes.length > 0) {
        const ingredienteInserts = processedIngredients.map((ing, index) => ({
          receita_id: receitaData.id,
          ingrediente_id: ing.ingrediente_id,
          quantidade: ing.quantidade,
          unidade: ing.unidade,
          ordem: index + 1,
        }));

        const { error: ingredienteError } = await supabase
          .from('receita_ingredientes')
          .insert(ingredienteInserts);

        if (ingredienteError) throw ingredienteError;
      }

      // Inserir passos
      if (recipeData.passos.length > 0) {
        const passoInserts = recipeData.passos.map(passo => ({
          receita_id: receitaData.id,
          numero_passo: passo.numero_passo,
          descricao: passo.descricao,
        }));

        const { error: passoError } = await supabase
          .from('receita_passos')
          .insert(passoInserts);

        if (passoError) throw passoError;
      }

      // Upload de mídia
      if (recipeData.media.length > 0) {
        for (const media of recipeData.media) {
          const fileExt = media.file.name.split('.').pop();
          const fileName = `${receitaData.id}_${Date.now()}_${media.ordem}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('recipe-media')
            .upload(filePath, media.file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('recipe-media')
            .getPublicUrl(filePath);

          const { error: mediaError } = await supabase
            .from('receita_media')
            .insert({
              receita_id: receitaData.id,
              url: urlData.publicUrl,
              tipo: media.type,
              ordem: media.ordem,
            });

          if (mediaError) throw mediaError;
        }
      }

      toast({
        title: status === 'rascunho' ? 'Rascunho salvo!' : 'Receita publicada!',
        description: status === 'rascunho' 
          ? 'Sua receita foi salva como rascunho.'
          : 'Sua receita foi publicada com sucesso!',
      });

      navigate(status === 'rascunho' ? '/profile' : `/recipe/${receitaData.id}`);
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar receita. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <LoginPrompt 
            showLoginPrompt={showLoginPrompt} 
            setShowLoginPrompt={setShowLoginPrompt}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />

      <main className="py-8 pt-32">
        <div className="container mx-auto responsive-padding">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <ChefHat className="w-12 h-12 text-fitcooker-orange mr-3" />
                <h1 className="text-4xl font-bold text-gray-900">Criar Nova Receita</h1>
              </div>
              <p className="text-center text-gray-600">
                Compartilhe sua receita com a comunidade FitCooker
              </p>
            </motion.div>

            <Tabs value={String(currentStep)} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="1" onClick={() => setCurrentStep(1)}>Básico</TabsTrigger>
                <TabsTrigger value="2" onClick={() => setCurrentStep(2)}>Ingredientes</TabsTrigger>
                <TabsTrigger value="3" onClick={() => setCurrentStep(3)}>Passos</TabsTrigger>
                <TabsTrigger value="4" onClick={() => setCurrentStep(4)}>Mídia</TabsTrigger>
                <TabsTrigger value="5" onClick={() => setCurrentStep(5)}>Prévia</TabsTrigger>
              </TabsList>

              <TabsContent value="1">
                <BasicInformation
                  data={recipeData}
                  onUpdate={updateRecipeData}
                  onNext={handleNext}
                />
              </TabsContent>

              <TabsContent value="2">
                <Ingredients
                  data={recipeData}
                  onUpdate={updateRecipeData}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </TabsContent>

              <TabsContent value="3">
                <Steps
                  data={recipeData}
                  onUpdate={updateRecipeData}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </TabsContent>

              <TabsContent value="4">
                <MediaUpload
                  data={recipeData}
                  onUpdate={updateRecipeData}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </TabsContent>

              <TabsContent value="5">
                <RecipePreview data={recipeData} />
                <div className="flex justify-between mt-8">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    size="lg"
                  >
                    Voltar
                  </Button>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => saveRecipe('rascunho')}
                      disabled={isSaving}
                      variant="outline"
                      size="lg"
                      className="bg-gray-100 hover:bg-gray-200"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Salvar como Rascunho
                    </Button>
                    <Button
                      onClick={() => saveRecipe('ativa')}
                      disabled={isSaving}
                      size="lg"
                      className="bg-fitcooker-orange hover:bg-orange-600"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {isSaving ? 'Publicando...' : 'Publicar Receita'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddRecipe;
