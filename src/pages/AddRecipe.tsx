import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RecipeCategory } from '@/data/mockData';

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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate auth state
  
  // Recipe basic information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Médio');
  const [selectedCategories, setSelectedCategories] = useState<RecipeCategory[]>([]);
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
  
  // Calculate validation progress
  const validationProgress = Math.round(
    (validationItems.filter(item => item.isValid).length / validationItems.length) * 100
  );
  
  // Mock ingredients database for search
  const ingredientsDatabase = [
    { name: 'Peito de Frango', protein: 31, carbs: 0, fat: 3.6, calories: 165, unit: 'g' },
    { name: 'Arroz Branco', protein: 2.7, carbs: 28, fat: 0.3, calories: 130, unit: 'g' },
    { name: 'Batata Doce', protein: 1.6, carbs: 20, fat: 0.1, calories: 86, unit: 'g' },
    { name: 'Whey Protein', protein: 24, carbs: 3, fat: 1.5, calories: 120, unit: 'g' },
    { name: 'Ovo', protein: 6, carbs: 0.6, fat: 5, calories: 70, unit: 'unidade' },
    { name: 'Azeite de Oliva', protein: 0, carbs: 0, fat: 14, calories: 126, unit: 'ml' },
    { name: 'Aveia', protein: 16.9, carbs: 66.3, fat: 6.9, calories: 389, unit: 'g' },
    { name: 'Brócolis', protein: 2.8, carbs: 6.6, fat: 0.4, calories: 34, unit: 'g' },
  ];
  
  const filteredIngredients = ingredientsDatabase.filter(
    ing => ing.name.toLowerCase().includes(ingredientSearchTerm.toLowerCase())
  );
  
  // Handler for multiple image uploads
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      const newMediaItems: MediaItem[] = files.map((file, index) => {
        // Create preview for each file
        const reader = new FileReader();
        
        return {
          id: Date.now().toString() + index,
          type: 'image',
          file: file,
          preview: URL.createObjectURL(file),
          isMain: mediaItems.length === 0 && index === 0 // First image is main by default
        };
      });
      
      setMediaItems(prev => [...prev, ...newMediaItems]);
    }
  };
  
  // Handler for adding video file instead of URL
  const handleAddVideoFile = (file: File) => {
    const newMediaItem: MediaItem = {
      id: Date.now().toString(),
      type: 'video',
      file: file,
      preview: URL.createObjectURL(file),
      isMain: false
    };
    
    setMediaItems(prev => [...prev, newMediaItem]);
  };
  
  // Update the handleAddVideoUrl to work with both URLs and files
  const handleAddVideoUrl = (urlOrFile: string | File) => {
    if (typeof urlOrFile === 'string') {
      // Handle URL (legacy support)
      const newMediaItem: MediaItem = {
        id: Date.now().toString(),
        type: 'video',
        url: urlOrFile,
        isMain: false
      };
      
      setMediaItems(prev => [...prev, newMediaItem]);
    } else {
      // Handle File
      handleAddVideoFile(urlOrFile);
    }
  };
  
  // Handler for removing media item
  const handleRemoveMediaItem = (id: string) => {
    const updatedMediaItems = mediaItems.filter(item => item.id !== id);
    
    // If removing the main image, set first available image as main
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
  const handleSelectIngredient = (index: number, ingredient: typeof ingredientsDatabase[0]) => {
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
    const customIngredient = {
      name: newIngredientName,
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0,
      unit: 'g'
    };
    
    // Add to current recipe
    handleSelectIngredient(currentIngredientIndex, customIngredient);
    
    // Reset form
    setNewIngredientName('');
    setShowAddIngredientForm(false);
    setShowIngredientSelector(false);
    
    toast({
      title: "Ingrediente adicionado",
      description: "Por favor, atualize os valores nutricionais.",
      duration: 3000,
    });
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
  const toggleCategory = (category: RecipeCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
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
    
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    
    handleSubmit();
  };
  
  // Submit form
  const handleSubmit = () => {
    // Form validation complete, proceed with submission
    toast({
      title: "Receita enviada com sucesso!",
      description: "Sua receita será analisada e publicada em breve.",
      duration: 3000,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setPreparationTime('');
    setServings('');
    setDifficulty('Médio');
    setSelectedCategories([]);
    setMediaItems([]);
    setIngredients([{ id: '1', name: '', quantity: 0, unit: 'g', protein: 0, carbs: 0, fat: 0, calories: 0 }]);
    setSteps([{ id: '1', order: 1, description: '' }]);
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
                  <Button type="submit" className="w-full" size="lg">
                    Publicar Receita
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
        filteredIngredients={filteredIngredients}
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
