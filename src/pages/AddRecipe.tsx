import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRecipes } from '@/hooks/useRecipes';
import { useIngredients } from '@/hooks/useIngredients';
import { useCategories } from '@/hooks/useCategories';
import BasicInformation from '@/components/add-recipe/BasicInformation';
import Ingredients from '@/components/add-recipe/Ingredients';
import Steps from '@/components/add-recipe/Steps';
import RecipePreview from '@/components/add-recipe/RecipePreview';
import LoginPrompt from '@/components/add-recipe/LoginPrompt';
import CategoryDialog from '@/components/add-recipe/CategoryDialog';
import IngredientSelector from '@/components/add-recipe/IngredientSelector';

interface IngredientInput {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  ingredientId?: number;
}

interface RecipeStep {
  id: string;
  order: number;
  description: string;
}

const AddRecipe = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveRecipe } = useRecipes();
  const { ingredients: dbIngredients, searchIngredients, addIngredient } = useIngredients();
  const { categories, suggestCategory } = useCategories();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<IngredientInput[]>([{
    id: '1',
    name: '',
    quantity: 0,
    unit: 'g',
    protein: 0,
    carbs: 0,
    fat: 0,
    calories: 0
  }]);
  const [steps, setSteps] = useState<RecipeStep[]>([{
    id: '1',
    order: 1,
    description: ''
  }]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showIngredientSelector, setShowIngredientSelector] = useState(false);
  const [currentIngredientIndex, setCurrentIngredientIndex] = useState(0);
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [showAddIngredientForm, setShowAddIngredientForm] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');

  // Filter ingredients based on search
  const filteredIngredients = searchIngredients(ingredientSearchTerm);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addIngredientToList = () => {
    const newIngredient: IngredientInput = {
      id: Date.now().toString(),
      name: '',
      quantity: 0,
      unit: 'g',
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ing => ing.id !== id));
    }
  };

  const updateIngredientQuantity = (id: string, quantity: number) => {
    setIngredients(ingredients.map(ing =>
      ing.id === id ? { ...ing, quantity } : ing
    ));
  };

  const openIngredientSelector = (index: number) => {
    setCurrentIngredientIndex(index);
    setShowIngredientSelector(true);
    setIngredientSearchTerm('');
  };

  const handleSelectIngredient = (index: number, selectedIngredient: any) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      name: selectedIngredient.nome,
      protein: selectedIngredient.proteina,
      carbs: selectedIngredient.carboidratos,
      fat: selectedIngredient.gorduras,
      calories: selectedIngredient.calorias,
      unit: selectedIngredient.unidade_padrao,
      ingredientId: selectedIngredient.id
    };
    setIngredients(updatedIngredients);
    setShowIngredientSelector(false);
  };

  const handleAddCustomIngredient = async () => {
    if (!newIngredientName.trim()) return;

    const { data, error } = await addIngredient({
      nome: newIngredientName.trim()
    });

    if (!error && data) {
      handleSelectIngredient(currentIngredientIndex, data);
      setNewIngredientName('');
      setShowAddIngredientForm(false);
    }
  };

  const addStep = () => {
    const newStep: RecipeStep = {
      id: Date.now().toString(),
      order: steps.length + 1,
      description: ''
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      const filteredSteps = steps.filter(step => step.id !== id);
      const reorderedSteps = filteredSteps.map((step, index) => ({
        ...step,
        order: index + 1
      }));
      setSteps(reorderedSteps);
    }
  };

  const updateStepDescription = (id: string, description: string) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, description } : step
    ));
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) return;

    const { error } = await suggestCategory(newCategoryName.trim());
    
    if (!error) {
      setNewCategoryName('');
      setShowNewCategoryDialog(false);
    }
  };

  const getTotalMacros = () => {
    const totalServings = parseInt(servings) || 1;
    
    const totals = ingredients.reduce((acc, ingredient) => {
      const quantity = ingredient.quantity || 0;
      const multiplier = quantity / 100; // Assuming nutritional info is per 100g/ml
      
      return {
        calories: acc.calories + (ingredient.calories * multiplier),
        protein: acc.protein + (ingredient.protein * multiplier),
        carbs: acc.carbs + (ingredient.carbs * multiplier),
        fat: acc.fat + (ingredient.fat * multiplier)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return {
      calories: totals.calories / totalServings,
      protein: totals.protein / totalServings,
      carbs: totals.carbs / totalServings,
      fat: totals.fat / totalServings
    };
  };

  const totalMacros = getTotalMacros();

  const isRecipeValid = () => {
    return (
      title.trim() &&
      description.trim() &&
      preparationTime &&
      servings &&
      difficulty &&
      selectedCategories.length > 0 &&
      ingredients.every(ing => ing.name && ing.quantity > 0) &&
      steps.every(step => step.description.trim())
    );
  };

  const getValidationProgress = () => {
    const items = [
      { title: 'Título preenchido', isValid: !!title.trim() },
      { title: 'Descrição preenchida', isValid: !!description.trim() },
      { title: 'Tempo de preparo', isValid: !!preparationTime },
      { title: 'Número de porções', isValid: !!servings },
      { title: 'Dificuldade selecionada', isValid: !!difficulty },
      { title: 'Categorias selecionadas', isValid: selectedCategories.length > 0 },
      { title: 'Ingredientes completos', isValid: ingredients.every(ing => ing.name && ing.quantity > 0) },
      { title: 'Passos de preparo', isValid: steps.every(step => step.description.trim()) }
    ];

    const validCount = items.filter(item => item.isValid).length;
    const progress = Math.round((validCount / items.length) * 100);

    return { progress, items };
  };

  const { progress: validationProgress, items: validationItems } = getValidationProgress();

  const getMainImagePreview = () => mainImagePreview;

  const checkLoginBeforeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (!isRecipeValid()) {
      return;
    }

    const recipeData = {
      title,
      description,
      preparationTime,
      servings,
      difficulty,
      selectedCategories,
      ingredients: ingredients.map(ing => ({
        ingredientId: ing.ingredientId,
        quantity: ing.quantity,
        unit: ing.unit
      })),
      steps,
      totalMacros,
      mainImageUrl: mainImagePreview
    };

    console.log('Submitting recipe:', recipeData);

    const { error } = await saveRecipe(recipeData);
    
    if (!error) {
      navigate('/recipes');
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      setShowLoginPrompt(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Adicionar Nova Receita</h1>
          <p className="mt-2 text-gray-600">Compartilhe suas receitas favoritas com a comunidade FitCooker</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
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
                servingsOptions={['1', '2', '3', '4', '5', '6', '8', '10', '12']}
                difficultyOptions={['Fácil', 'Médio', 'Difícil']}
              />
            </div>

            <Ingredients
              ingredients={ingredients}
              updateIngredientQuantity={updateIngredientQuantity}
              removeIngredient={removeIngredient}
              addIngredient={addIngredientToList}
              openIngredientSelector={openIngredientSelector}
              unitOptions={['g', 'kg', 'ml', 'l', 'xícara', 'colher de sopa', 'colher de chá', 'unidade', 'fatia', 'pitada']}
            />

            <Steps
              steps={steps}
              updateStepDescription={updateStepDescription}
              removeStep={removeStep}
              addStep={addStep}
            />
          </div>

          <div className="lg:col-span-1">
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
              ingredientsCount={ingredients.length}
              stepsCount={steps.length}
              validationProgress={validationProgress}
              validationItems={validationItems}
            />
          </div>
        </div>
      </div>

      <LoginPrompt
        showLoginPrompt={showLoginPrompt}
        setShowLoginPrompt={setShowLoginPrompt}
      />

      <CategoryDialog
        showNewCategoryDialog={showNewCategoryDialog}
        setShowNewCategoryDialog={setShowNewCategoryDialog}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        handleAddNewCategory={handleAddNewCategory}
      />

      <IngredientSelector
        showIngredientSelector={showIngredientSelector}
        setShowIngredientSelector={setShowIngredientSelector}
        ingredientSearchTerm={ingredientSearchTerm}
        setIngredientSearchTerm={setIngredientSearchTerm}
        filteredIngredients={filteredIngredients.map(ing => ({
          name: ing.nome,
          protein: ing.proteina,
          carbs: ing.carboidratos,
          fat: ing.gorduras,
          calories: ing.calorias,
          unit: ing.unidade_padrao
        }))}
        handleSelectIngredient={handleSelectIngredient}
        currentIngredientIndex={currentIngredientIndex}
        showAddIngredientForm={showAddIngredientForm}
        setShowAddIngredientForm={setShowAddIngredientForm}
        newIngredientName={newIngredientName}
        setNewIngredientName={setNewIngredientName}
        handleAddCustomIngredient={handleAddCustomIngredient}
      />
    </div>
  );
};

export default AddRecipe;
