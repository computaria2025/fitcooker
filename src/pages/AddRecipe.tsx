
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
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
import LoginPrompt from '@/components/add-recipe/LoginPrompt';

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

const AddRecipe: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories } = useCategories();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    // This is handled in the IngredientSelector component now
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
      } else if (mediaItem.url && mediaItem.type === 'video') {
        results.videoUrl = mediaItem.url;
      }
    }
    
    return results;
  };
  
  // Check if user is logged in before proceeding
  const checkLoginBeforeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isRecipeValid()) {
      toast({
        title: "Formulário incompleto",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    handleSubmit();
  };
  
  // Submit form
  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Upload media files
      const { mainImageUrl, videoUrl } = await uploadMediaFiles();
      
      // 2. Create recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from('receitas')
        .insert({
          titulo: title,
          descricao: description,
          tempo_preparo: parseInt(preparationTime),
          porcoes: parseInt(servings),
          dificuldade: difficulty,
          imagem_url: mainImageUrl,
          video_url: videoUrl,
          usuario_id: user.id
        })
        .select()
        .single();
      
      if (recipeError) throw recipeError;
      
      const recipeId = recipeData.id;
      
      // 3. Add ingredients
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
            receita_id: recipeId,
            ingrediente_id: ingredientId,
            quantidade: ingredient.quantity,
            unidade: ingredient.unit,
            ordem: i + 1
          });
        
        if (linkError) throw linkError;
      }
      
      // 4. Add steps
      const validSteps = steps.filter(step => step.description.trim());
      for (const step of validSteps) {
        const { error: stepError } = await supabase
          .from('receita_passos')
          .insert({
            receita_id: recipeId,
            ordem: step.order,
            descricao: step.description
          });
        
        if (stepError) throw stepError;
      }
      
      // 5. Add categories
      for (const categoryId of selectedCategories) {
        const { error: categoryError } = await supabase
          .from('receita_categorias')
          .insert({
            receita_id: recipeId,
            categoria_id: parseInt(categoryId)
          });
        
        if (categoryError) throw categoryError;
      }
      
      // 6. Calculate nutritional information
      const { error: macroError } = await supabase.rpc('calcular_macros_receita', {
        receita_id_param: recipeId
      });
      
      if (macroError) console.error('Erro ao calcular macros:', macroError);
      
      toast({
        title: "Receita criada com sucesso!",
        description: "Sua receita foi publicada e está disponível para a comunidade.",
        duration: 3000,
      });
      
      // Reset form and redirect
      navigate(`/recipe/${recipeId}`);
      
    } catch (error) {
      console.error('Erro ao criar receita:', error);
      toast({
        title: "Erro ao criar receita",
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
    return mainItem?.preview || null;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 bg-gray-50">
        <section className="container mx-auto px-4 md:px-6">
          <h1 className="heading-lg mb-6 text-center">Adicionar Nova Receita</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-8">
              <form onSubmit={checkLoginBeforeSubmit} className="space-y-8">
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
                    {isSubmitting ? "Publicando..." : "Publicar Receita"}
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
                checkLoginBeforeSubmit={checkLoginBeforeSubmit}
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
      
      <LoginPrompt 
        showLoginPrompt={showLoginPrompt}
        setShowLoginPrompt={setShowLoginPrompt}
      />
      
      <Footer />
    </div>
  );
};

export default AddRecipe;
