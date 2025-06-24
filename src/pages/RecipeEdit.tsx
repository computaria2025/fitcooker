
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';

// Import components
import BasicInformation from '@/components/add-recipe/BasicInformation';
import MediaUpload from '@/components/add-recipe/MediaUpload';
import Ingredients from '@/components/add-recipe/Ingredients';
import Steps from '@/components/add-recipe/Steps';
import RecipePreview from '@/components/add-recipe/RecipePreview';
import IngredientSelector from '@/components/add-recipe/IngredientSelector';
import CategoryDialog from '@/components/add-recipe/CategoryDialog';

interface IngredientInput {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

interface RecipeStep {
  id: string;
  order: number;
  description: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  file?: File;
  preview?: string;
  url?: string;
  isMain: boolean;
}

const RecipeEdit: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { categories } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Recipe basic information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Médio');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Images and media
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  
  // Ingredients management
  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { id: '1', name: '', quantity: 0, unit: 'g', protein: 0, carbs: 0, fat: 0, calories: 0 }
  ]);
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [newIngredientName, setNewIngredientName] = useState('');
  const [showAddIngredientForm, setShowAddIngredientForm] = useState(false);
  const [showIngredientSelector, setShowIngredientSelector] = useState(false);
  const [currentIngredientIndex, setCurrentIngredientIndex] = useState(0);
  
  // Steps management
  const [steps, setSteps] = useState<RecipeStep[]>([
    { id: '1', order: 1, description: '' }
  ]);
  
  // Predefined options
  const difficultyOptions = ['Fácil', 'Médio', 'Difícil'];
  const servingsOptions = ['1', '2', '3', '4', '5', '6', '8', '10', '12'];
  const unitOptions = ['g', 'kg', 'ml', 'l', 'unidade', 'colher de sopa', 'colher de chá', 'xícara'];

  // Load recipe data
  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;

      try {
        // Fetch recipe data
        const { data: recipe, error: recipeError } = await supabase
          .from('receitas')
          .select(`
            *,
            receita_categorias(categoria_id),
            receita_ingredientes(
              quantidade,
              unidade,
              ordem,
              ingredientes(nome, proteina, carboidratos, gorduras, calorias)
            ),
            receita_passos(ordem, descricao)
          `)
          .eq('id', id)
          .single();

        if (recipeError) throw recipeError;

        // Check if user is the owner
        if (recipe.usuario_id !== user?.id) {
          toast({
            title: "Acesso negado",
            description: "Você só pode editar suas próprias receitas.",
            variant: "destructive",
          });
          navigate('/profile');
          return;
        }

        // Set basic information
        setTitle(recipe.titulo);
        setDescription(recipe.descricao);
        setPreparationTime(recipe.tempo_preparo.toString());
        setServings(recipe.porcoes.toString());
        setDifficulty(recipe.dificuldade);

        // Set categories
        const recipeCategories = recipe.receita_categorias?.map((rc: any) => rc.categoria_id.toString()) || [];
        setSelectedCategories(recipeCategories);

        // Set media
        if (recipe.imagem_url) {
          setMediaItems([{
            id: '1',
            type: 'image',
            url: recipe.imagem_url,
            isMain: true
          }]);
        }

        // Set ingredients
        const recipeIngredients = recipe.receita_ingredientes?.map((ri: any, index: number) => ({
          id: (index + 1).toString(),
          name: ri.ingredientes.nome,
          quantity: ri.quantidade,
          unit: ri.unidade,
          protein: ri.ingredientes.proteina || 0,
          carbs: ri.ingredientes.carboidratos || 0,
          fat: ri.ingredientes.gorduras || 0,
          calories: ri.ingredientes.calorias || 0
        })) || [];
        
        if (recipeIngredients.length > 0) {
          setIngredients(recipeIngredients);
        }

        // Set steps
        const recipeSteps = recipe.receita_passos?.map((rp: any) => ({
          id: rp.ordem.toString(),
          order: rp.ordem,
          description: rp.descricao
        })) || [];
        
        if (recipeSteps.length > 0) {
          setSteps(recipeSteps);
        }

      } catch (error) {
        console.error('Erro ao carregar receita:', error);
        toast({
          title: "Erro ao carregar receita",
          description: "Não foi possível carregar os dados da receita.",
          variant: "destructive",
        });
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadRecipe();
    }
  }, [id, user, navigate, toast]);

  // Calculate total macros
  const totalMacros = ingredients.reduce(
    (acc, ingredient) => {
      return {
        calories: acc.calories + (ingredient.calories * ingredient.quantity / 100),
        protein: acc.protein + (ingredient.protein * ingredient.quantity / 100),
        carbs: acc.carbs + (ingredient.carbs * ingredient.quantity / 100),
        fat: acc.fat + (ingredient.fat * ingredient.quantity / 100)
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Validation and progress tracking
  const validationItems = [
    { title: 'Título da receita', isValid: title.trim() !== '' },
    { title: 'Descrição da receita', isValid: description.trim() !== '' },
    { title: 'Tempo de preparo', isValid: preparationTime !== '' },
    { title: 'Porções', isValid: servings !== '' },
    { title: 'Pelo menos uma categoria', isValid: selectedCategories.length > 0 },
    { title: 'Imagem principal', isValid: mediaItems.some(item => item.isMain) },
    { title: 'Pelo menos um ingrediente', isValid: ingredients.some(ing => ing.name.trim() !== '' && ing.quantity > 0) },
    { title: 'Pelo menos um passo', isValid: steps.some(step => step.description.trim() !== '') }
  ];
  
  const validationProgress = Math.round(
    (validationItems.filter(item => item.isValid).length / validationItems.length) * 100
  );

  // Handler for multiple image uploads
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      const newMediaItems: MediaItem[] = files.map((file, index) => ({
        id: Date.now().toString() + index,
        type: 'image',
        file: file,
        preview: URL.createObjectURL(file),
        isMain: mediaItems.length === 0 && index === 0
      }));
      
      setMediaItems(prev => [...prev, ...newMediaItems]);
    }
  };
  
  // Handler for adding video file
  const handleAddVideoUrl = (urlOrFile: string | File) => {
    if (typeof urlOrFile === 'string') {
      const newMediaItem: MediaItem = {
        id: Date.now().toString(),
        type: 'video',
        url: urlOrFile,
        isMain: false
      };
      setMediaItems(prev => [...prev, newMediaItem]);
    } else {
      const newMediaItem: MediaItem = {
        id: Date.now().toString(),
        type: 'video',
        file: urlOrFile,
        preview: URL.createObjectURL(urlOrFile),
        isMain: false
      };
      setMediaItems(prev => [...prev, newMediaItem]);
    }
  };
  
  // Handler for removing media item
  const handleRemoveMediaItem = (id: string) => {
    const updatedMediaItems = mediaItems.filter(item => item.id !== id);
    
    if (mediaItems.find(item => item.id === id)?.isMain && updatedMediaItems.length > 0) {
      const itemsWithMain = updatedMediaItems.map((item, index) => ({
        ...item,
        isMain: index === 0
      }));
      setMediaItems(itemsWithMain);
    } else {
      setMediaItems(updatedMediaItems);
    }
  };
  
  // Handler for setting an image as main
  const handleSetMainImage = (id: string) => {
    const updatedMediaItems = mediaItems.map(item => ({
      ...item,
      isMain: item.id === id
    }));
    setMediaItems(updatedMediaItems);
  };
  
  // Handler for selecting an ingredient from search
  const handleSelectIngredient = (index: number, ingredient: any) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      name: ingredient.name,
      unit: ingredient.unit,
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      calories: ingredient.calories
    };
    setIngredients(newIngredients);
    setIngredientSearchTerm('');
    setShowIngredientSelector(false);
  };
  
  // Handler for adding a custom ingredient
  const handleAddCustomIngredient = () => {
    setNewIngredientName('');
    setShowAddIngredientForm(false);
    setShowIngredientSelector(false);
  };
  
  // Open ingredient selector
  const openIngredientSelector = (index: number) => {
    setCurrentIngredientIndex(index);
    setShowIngredientSelector(true);
    setIngredientSearchTerm('');
  };
  
  // Add new ingredient field
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: '', quantity: 0, unit: 'g', protein: 0, carbs: 0, fat: 0, calories: 0 }
    ]);
  };
  
  // Remove ingredient field
  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ing => ing.id !== id));
    }
  };
  
  // Add new step field
  const addStep = () => {
    const newOrder = steps.length + 1;
    setSteps([
      ...steps,
      { id: Date.now().toString(), order: newOrder, description: '' }
    ]);
  };
  
  // Remove step field
  const removeStep = (id: string) => {
    if (steps.length > 1) {
      const newSteps = steps.filter(step => step.id !== id)
        .map((step, index) => ({ ...step, order: index + 1 }));
      setSteps(newSteps);
    }
  };
  
  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  // Handle adding new category
  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      toast({
        title: "Nova categoria sugerida",
        description: "Sua sugestão será analisada pela nossa equipe.",
        duration: 3000,
      });
      setNewCategoryName('');
      setShowNewCategoryDialog(false);
    }
  };
  
  // Update ingredient quantity
  const updateIngredientQuantity = (id: string, quantity: number) => {
    setIngredients(
      ingredients.map(ing => 
        ing.id === id ? { ...ing, quantity } : ing
      )
    );
  };

  // Update ingredient unit
  const updateIngredientUnit = (id: string, unit: string) => {
    setIngredients(
      ingredients.map(ing => 
        ing.id === id ? { ...ing, unit } : ing
      )
    );
  };
  
  // Update step description
  const updateStepDescription = (id: string, description: string) => {
    setSteps(
      steps.map(step => 
        step.id === id ? { ...step, description } : step
      )
    );
  };
  
  // Check if recipe is valid for submission
  const isRecipeValid = () => {
    return validationProgress === 100;
  };

  // Upload media files to Supabase Storage
  const uploadMediaFiles = async (): Promise<{ mainImageUrl?: string; videoUrl?: string }> => {
    const results: { mainImageUrl?: string; videoUrl?: string } = {};
    
    for (const mediaItem of mediaItems) {
      if (mediaItem.file) {
        const fileExt = mediaItem.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `recipes/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('recipe-media')
          .upload(filePath, mediaItem.file);
        
        if (error) {
          console.error('Erro no upload:', error);
          continue;
        }
        
        const { data: urlData } = supabase.storage
          .from('recipe-media')
          .getPublicUrl(filePath);
        
        if (mediaItem.isMain) {
          results.mainImageUrl = urlData.publicUrl;
        } else if (mediaItem.type === 'video') {
          results.videoUrl = urlData.publicUrl;
        }
      } else if (mediaItem.url) {
        if (mediaItem.isMain) {
          results.mainImageUrl = mediaItem.url;
        } else if (mediaItem.type === 'video') {
          results.videoUrl = mediaItem.url;
        }
      }
    }
    
    return results;
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !id) return;
    
    if (!isRecipeValid()) {
      toast({
        title: "Formulário incompleto",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Upload media files
      const { mainImageUrl, videoUrl } = await uploadMediaFiles();
      
      // 2. Update recipe
      const { error: recipeError } = await supabase
        .from('receitas')
        .update({
          titulo: title,
          descricao: description,
          tempo_preparo: parseInt(preparationTime),
          porcoes: parseInt(servings),
          dificuldade: difficulty,
          imagem_url: mainImageUrl,
          video_url: videoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (recipeError) throw recipeError;
      
      // 3. Delete existing ingredients, steps, and categories
      await supabase.from('receita_ingredientes').delete().eq('receita_id', id);
      await supabase.from('receita_passos').delete().eq('receita_id', id);
      await supabase.from('receita_categorias').delete().eq('receita_id', id);
      
      // 4. Add updated ingredients
      const validIngredients = ingredients.filter(ing => ing.name.trim() && ing.quantity > 0);
      for (let i = 0; i < validIngredients.length; i++) {
        const ingredient = validIngredients[i];
        
        // Find or create ingredient in database
        let { data: existingIngredient } = await supabase
          .from('ingredientes')
          .select('id')
          .eq('nome', ingredient.name)
          .single();
        
        let ingredientId = existingIngredient?.id;
        
        if (!ingredientId) {
          const { data: newIngredient, error: ingredientError } = await supabase
            .from('ingredientes')
            .insert({
              nome: ingredient.name,
              proteina: ingredient.protein,
              carboidratos: ingredient.carbs,
              gorduras: ingredient.fat,
              calorias: ingredient.calories,
              unidade_padrao: ingredient.unit
            })
            .select()
            .single();
          
          if (ingredientError) throw ingredientError;
          ingredientId = newIngredient.id;
        }
        
        // Link ingredient to recipe
        const { error: linkError } = await supabase
          .from('receita_ingredientes')
          .insert({
            receita_id: parseInt(id),
            ingrediente_id: ingredientId,
            quantidade: ingredient.quantity,
            unidade: ingredient.unit,
            ordem: i + 1
          });
        
        if (linkError) throw linkError;
      }
      
      // 5. Add updated steps
      const validSteps = steps.filter(step => step.description.trim());
      for (const step of validSteps) {
        const { error: stepError } = await supabase
          .from('receita_passos')
          .insert({
            receita_id: parseInt(id),
            ordem: step.order,
            descricao: step.description
          });
        
        if (stepError) throw stepError;
      }
      
      // 6. Add updated categories
      for (const categoryId of selectedCategories) {
        const { error: categoryError } = await supabase
          .from('receita_categorias')
          .insert({
            receita_id: parseInt(id),
            categoria_id: parseInt(categoryId)
          });
        
        if (categoryError) throw categoryError;
      }
      
      // 7. Recalculate nutritional information
      const { error: macroError } = await supabase.rpc('calcular_macros_receita', {
        receita_id_param: parseInt(id)
      });
      
      if (macroError) console.error('Erro ao calcular macros:', macroError);
      
      toast({
        title: "Receita atualizada com sucesso!",
        description: "Suas alterações foram salvas.",
        duration: 3000,
      });
      
      // Redirect to recipe detail
      navigate(`/recipe/${id}`);
      
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      toast({
        title: "Erro ao atualizar receita",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get main image preview
  const getMainImagePreview = () => {
    const mainItem = mediaItems.find(item => item.isMain);
    return mainItem?.preview || mainItem?.url || null;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitcooker-orange mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando receita...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 bg-gray-50">
        <section className="container mx-auto px-4 md:px-6">
          <h1 className="heading-lg mb-6 text-center">Editar Receita</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <BasicInformation 
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  preparationTime={preparationTime}
                  setPreparationTime={setPreparationTime}
                  servings={servings}
                  setServings={setServings}
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  showNewCategoryDialog={showNewCategoryDialog}
                  setShowNewCategoryDialog={setShowNewCategoryDialog}
                  servingsOptions={servingsOptions}
                  difficultyOptions={difficultyOptions}
                  categories={categories}
                />
                
                <MediaUpload 
                  mediaItems={mediaItems}
                  handleImageChange={handleImageChange}
                  handleAddVideoUrl={handleAddVideoUrl}
                  handleRemoveMediaItem={handleRemoveMediaItem}
                  handleSetMainImage={handleSetMainImage}
                />
                
                <Ingredients 
                  ingredients={ingredients}
                  updateIngredientQuantity={updateIngredientQuantity}
                  updateIngredientUnit={updateIngredientUnit}
                  removeIngredient={removeIngredient}
                  addIngredient={addIngredient}
                  openIngredientSelector={openIngredientSelector}
                  unitOptions={unitOptions}
                />
                
                <Steps 
                  steps={steps}
                  updateStepDescription={updateStepDescription}
                  removeStep={removeStep}
                  addStep={addStep}
                />
                
                <div className="lg:hidden">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Preview Section (Desktop) */}
            <div className="hidden lg:block">
              <RecipePreview 
                title={title}
                description={description}
                selectedCategories={selectedCategories}
                preparationTime={preparationTime}
                servings={servings}
                difficulty={difficulty}
                totalMacros={totalMacros}
                getMainImagePreview={getMainImagePreview}
                isRecipeValid={isRecipeValid()}
                checkLoginBeforeSubmit={handleSubmit}
                ingredientsCount={ingredients.filter(ing => ing.name.trim() !== '').length}
                stepsCount={steps.filter(step => step.description.trim() !== '').length}
                validationProgress={validationProgress}
                validationItems={validationItems}
                isSubmitting={isSubmitting}
                categories={categories}
              />
            </div>
          </div>
        </section>
      </main>
      
      <IngredientSelector 
        showIngredientSelector={showIngredientSelector}
        setShowIngredientSelector={setShowIngredientSelector}
        ingredientSearchTerm={ingredientSearchTerm}
        setIngredientSearchTerm={setIngredientSearchTerm}
        handleSelectIngredient={handleSelectIngredient}
        currentIngredientIndex={currentIngredientIndex}
        showAddIngredientForm={showAddIngredientForm}
        setShowAddIngredientForm={setShowAddIngredientForm}
        newIngredientName={newIngredientName}
        setNewIngredientName={setNewIngredientName}
        handleAddCustomIngredient={handleAddCustomIngredient}
      />
      
      <CategoryDialog 
        showNewCategoryDialog={showNewCategoryDialog}
        setShowNewCategoryDialog={setShowNewCategoryDialog}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        handleAddNewCategory={handleAddNewCategory}
      />
      
      <Footer />
    </div>
  );
};

export default RecipeEdit;
