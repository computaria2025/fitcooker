
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryBadge from '@/components/ui/CategoryBadge';
import MacroDisplay from '@/components/ui/MacroDisplay';
import RateRecipeForm from '@/components/recipe/RateRecipeForm';
import { allRecipes, Recipe, RecipeStep, Ingredient, RecipeCategory } from '@/data/mockData';
import { Clock, Flame, ChefHat, Users, ChevronLeft, Star, MessageSquare, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock reviews data
interface Review {
  id: number;
  user: {
    name: string;
    avatarUrl: string;
  };
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

// Sample mock reviews
const mockReviews: Review[] = [
  {
    id: 1,
    user: {
      name: "Maria Silva",
      avatarUrl: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    rating: 5,
    comment: "Receita maravilhosa! Fácil de fazer e muito saborosa. Toda a família adorou.",
    date: "2024-03-10",
    likes: 8
  },
  {
    id: 2,
    user: {
      name: "João Santos",
      avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    rating: 4,
    comment: "Muito boa receita, apenas ajustei um pouco o tempero para o meu gosto.",
    date: "2024-03-05",
    likes: 3
  },
  {
    id: 3,
    user: {
      name: "Ana Oliveira",
      avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    rating: 5,
    comment: "Perfeita para minha dieta low-carb! Os macronutrientes batem certinho.",
    date: "2024-02-28",
    likes: 5
  }
];

// Mock similar recipes data
const getSimilarRecipes = (currentRecipeId: number, category: RecipeCategory | string) => {
  return allRecipes
    .filter(recipe => 
      recipe.id !== currentRecipeId && 
      recipe.categories.includes(category as RecipeCategory)
    )
    .slice(0, 3);
};

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'nutrition' | 'reviews'>('ingredients');
  const [similarRecipes, setSimilarRecipes] = useState<Recipe[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate API fetch
    setTimeout(() => {
      const foundRecipe = allRecipes.find(r => r.id === Number(id));
      setRecipe(foundRecipe || null);
      
      if (foundRecipe && foundRecipe.categories.length > 0) {
        setSimilarRecipes(getSimilarRecipes(foundRecipe.id, foundRecipe.categories[0]));
      }
      
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  const handleLikeReview = (reviewId: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Login necessário",
        description: "Faça login para curtir avaliações",
        variant: "destructive"
      });
      return;
    }
    
    // Handle like logic here
    toast({
      title: "Avaliação curtida",
      description: "Você curtiu esta avaliação"
    });
  };
  
  const handleSaveRecipe = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar receitas",
        variant: "destructive"
      });
      return;
    }
    
    // Handle save recipe logic here
    toast({
      title: "Receita salva",
      description: "Receita adicionada aos seus favoritos"
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="heading-lg mb-4">Receita não encontrada</h2>
            <p className="text-gray-600 mb-6">
              A receita que você está procurando não existe ou foi removida.
            </p>
            <Link to="/recipes" className="btn btn-primary">
              Ver todas as receitas
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const {
    title,
    description,
    categories,
    preparationTime,
    servings,
    difficulty,
    ingredients,
    steps,
    imageUrl,
    videoUrl,
    macros,
    author,
    rating,
    createdAt
  } = recipe;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Header */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center text-sm text-gray-500">
              <Link to="/" className="hover:text-fitcooker-orange transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/recipes" className="hover:text-fitcooker-orange transition-colors">Receitas</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700 truncate">{recipe?.title}</span>
            </div>
          </div>
        </div>
        
        {/* Recipe Image & Main Info */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image */}
              <div className="lg:w-1/2">
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video Play Button (if video exists) */}
                  {videoUrl && (
                    <button 
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                      aria-label="Assistir vídeo"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="w-8 h-8 text-fitcooker-orange ml-1"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </div>
                    </button>
                  )}
                  
                  {/* Categories */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[80%]">
                    {categories.map((category, index) => (
                      <CategoryBadge key={index} category={category} />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Info */}
              <div className="lg:w-1/2">
                <Link
                  to="/recipes"
                  className="inline-flex items-center text-fitcooker-orange hover:underline mb-4"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Voltar para receitas
                </Link>
                
                <h1 className="heading-lg mb-3">{recipe?.title}</h1>
                
                <p className="text-gray-600 mb-6">{recipe?.description}</p>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-4">
                    <img 
                      src={author.avatarUrl} 
                      alt={author.name} 
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>
                      <span className="block text-sm font-medium">por {author.name}</span>
                      <span className="block text-xs text-gray-500">
                        {new Date(createdAt).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-fitcooker-orange/10 text-fitcooker-orange px-3 py-1 rounded-full">
                    <Star size={16} className="mr-1 fill-fitcooker-orange" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Clock size={20} className="mx-auto mb-1 text-gray-500" />
                    <span className="block text-sm font-medium">{preparationTime} min</span>
                    <span className="block text-xs text-gray-500">Tempo</span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Users size={20} className="mx-auto mb-1 text-gray-500" />
                    <span className="block text-sm font-medium">{servings}</span>
                    <span className="block text-xs text-gray-500">Porções</span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Flame 
                      size={20} 
                      className={`mx-auto mb-1 ${
                        difficulty === 'Fácil' ? 'text-green-500' : 
                        difficulty === 'Médio' ? 'text-yellow-500' : 'text-red-500'
                      }`} 
                    />
                    <span className="block text-sm font-medium">{difficulty}</span>
                    <span className="block text-xs text-gray-500">Dificuldade</span>
                  </div>
                </div>
                
                {/* Macros */}
                <MacroDisplay 
                  calories={recipe?.macros.calories || 0}
                  protein={recipe?.macros.protein || 0}
                  carbs={recipe?.macros.carbs || 0}
                  fat={recipe?.macros.fat || 0}
                  className="mb-8"
                />
                
                {/* Actions */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button 
                    className="btn btn-primary flex-1"
                    onClick={handleSaveRecipe}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Salvar Receita
                  </Button>
                  <Button className="btn btn-outline flex-1">
                    Compartilhar
                  </Button>
                </div>
                
                {/* Add prominent Rate Recipe button */}
                <div className="mt-4">
                  <RateRecipeForm 
                    recipeId={id || ''} 
                    recipeName={recipe?.title || ''} 
                    isLoggedIn={isLoggedIn}
                    prominentDisplay={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recipe Content Section with Horizontal Tabs Layout */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              {/* Horizontal Tabs */}
              <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={cn(
                    'px-6 py-3 font-medium text-gray-600 hover:text-fitcooker-orange whitespace-nowrap',
                    activeTab === 'ingredients' && 'text-fitcooker-orange border-b-2 border-fitcooker-orange'
                  )}
                >
                  Ingredientes
                </button>
                
                <button
                  onClick={() => setActiveTab('steps')}
                  className={cn(
                    'px-6 py-3 font-medium text-gray-600 hover:text-fitcooker-orange whitespace-nowrap',
                    activeTab === 'steps' && 'text-fitcooker-orange border-b-2 border-fitcooker-orange'
                  )}
                >
                  Modo de Preparo
                </button>
                
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={cn(
                    'px-6 py-3 font-medium text-gray-600 hover:text-fitcooker-orange whitespace-nowrap',
                    activeTab === 'nutrition' && 'text-fitcooker-orange border-b-2 border-fitcooker-orange'
                  )}
                >
                  Informação Nutricional
                </button>
                
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={cn(
                    'px-6 py-3 font-medium text-gray-600 hover:text-fitcooker-orange whitespace-nowrap',
                    activeTab === 'reviews' && 'text-fitcooker-orange border-b-2 border-fitcooker-orange'
                  )}
                >
                  Avaliações
                </button>
              </div>
              
              {/* Tab Content */}
              <div>
                {activeTab === 'ingredients' && (
                  <div>
                    <h2 className="heading-md mb-4">Ingredientes</h2>
                    <ul className="space-y-3">
                      {ingredients.map((ingredient: Ingredient, index: number) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-fitcooker-orange mr-3"></div>
                          <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>
                          <span className="mx-2">de</span>
                          <span>{ingredient.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeTab === 'steps' && (
                  <div>
                    <h2 className="heading-md mb-4">Modo de Preparo</h2>
                    <ol className="space-y-6">
                      {steps.map((step: RecipeStep) => (
                        <li key={step.order} className="flex">
                          <div className="flex-shrink-0 mr-4">
                            <div className="w-8 h-8 bg-fitcooker-orange/10 rounded-full flex items-center justify-center text-fitcooker-orange font-bold">
                              {step.order}
                            </div>
                          </div>
                          <div className="pt-1">
                            <p>{step.description}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                
                {activeTab === 'nutrition' && (
                  <div>
                    <h2 className="heading-md mb-4">Informação Nutricional</h2>
                    
                    <Table className="border-collapse border border-gray-200 rounded-lg overflow-hidden">
                      <TableHeader className="bg-gradient-to-r from-fitcooker-orange/20 to-fitcooker-orange/10">
                        <TableRow>
                          <TableHead className="w-[180px] font-bold text-gray-700 py-3">Nutriente</TableHead>
                          <TableHead className="font-bold text-gray-700 py-3">Quantidade</TableHead>
                          <TableHead className="font-bold text-gray-700 py-3">% do Valor Diário*</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="hover:bg-orange-50 transition-colors">
                          <TableCell className="font-medium border-t border-gray-200 text-fitcooker-orange">Valor Energético</TableCell>
                          <TableCell className="border-t border-gray-200">{macros.calories} kcal</TableCell>
                          <TableCell className="border-t border-gray-200">
                            <div className="flex items-center">
                              <div className="h-2 bg-fitcooker-orange rounded-full w-16 mr-2" style={{ width: `${Math.min(100, Math.round((macros.calories / 2000) * 100))}px` }}></div>
                              {Math.round((macros.calories / 2000) * 100)}%
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-red-50 transition-colors">
                          <TableCell className="font-medium border-t border-gray-200 text-red-500">Proteínas</TableCell>
                          <TableCell className="border-t border-gray-200">{macros.protein}g</TableCell>
                          <TableCell className="border-t border-gray-200">
                            <div className="flex items-center">
                              <div className="h-2 bg-red-500 rounded-full w-16 mr-2" style={{ width: `${Math.min(100, Math.round((macros.protein / 50) * 100))}px` }}></div>
                              {Math.round((macros.protein / 50) * 100)}%
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-yellow-50 transition-colors">
                          <TableCell className="font-medium border-t border-gray-200 text-yellow-500">Carboidratos</TableCell>
                          <TableCell className="border-t border-gray-200">{macros.carbs}g</TableCell>
                          <TableCell className="border-t border-gray-200">
                            <div className="flex items-center">
                              <div className="h-2 bg-yellow-500 rounded-full w-16 mr-2" style={{ width: `${Math.min(100, Math.round((macros.carbs / 300) * 100))}px` }}></div>
                              {Math.round((macros.carbs / 300) * 100)}%
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-blue-50 transition-colors">
                          <TableCell className="font-medium border-t border-gray-200 text-blue-500">Gorduras Totais</TableCell>
                          <TableCell className="border-t border-gray-200">{macros.fat}g</TableCell>
                          <TableCell className="border-t border-gray-200">
                            <div className="flex items-center">
                              <div className="h-2 bg-blue-500 rounded-full w-16 mr-2" style={{ width: `${Math.min(100, Math.round((macros.fat / 65) * 100))}px` }}></div>
                              {Math.round((macros.fat / 65) * 100)}%
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-green-50 transition-colors">
                          <TableCell className="font-medium border-t border-gray-200 text-green-500">Fibra Alimentar</TableCell>
                          <TableCell className="border-t border-gray-200">~{Math.round(macros.carbs * 0.1)}g</TableCell>
                          <TableCell className="border-t border-gray-200">
                            <div className="flex items-center">
                              <div className="h-2 bg-green-500 rounded-full w-16 mr-2" style={{ width: `${Math.min(100, Math.round(((macros.carbs * 0.1) / 25) * 100))}px` }}></div>
                              {Math.round(((macros.carbs * 0.1) / 25) * 100)}%
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <div className="mt-6 bg-yellow-50 p-4 rounded-lg text-sm border border-yellow-200">
                      <p className="text-yellow-700">
                        * Percentual de valores diários fornecidos pela dieta de 2.000 kcal.
                        Os valores podem variar dependendo das suas necessidades energéticas.
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                      <h2 className="heading-md">Avaliações e Comentários</h2>
                      
                      <RateRecipeForm 
                        recipeId={id || ''} 
                        recipeName={recipe?.title || ''} 
                        isLoggedIn={isLoggedIn}
                        prominentDisplay={true}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      {mockReviews.map(review => (
                        <div 
                          key={review.id} 
                          className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start">
                            <img 
                              src={review.user.avatarUrl} 
                              alt={review.user.name} 
                              className="w-10 h-10 rounded-full object-cover mr-4"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{review.user.name}</h3>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              
                              <div className="flex items-center mt-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    size={16} 
                                    className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                                  />
                                ))}
                              </div>
                              
                              <p className="text-gray-700">{review.comment}</p>
                              
                              <div className="flex items-center mt-3">
                                <button 
                                  onClick={() => handleLikeReview(review.id)}
                                  className="text-sm flex items-center text-gray-500 hover:text-fitcooker-orange"
                                >
                                  <Heart size={14} className="mr-1" />
                                  <span>Curtir ({review.likes})</span>
                                </button>
                                
                                <button 
                                  className="text-sm flex items-center text-gray-500 hover:text-fitcooker-orange ml-4"
                                  onClick={() => {
                                    if (!isLoggedIn) {
                                      toast({
                                        title: "Login necessário",
                                        description: "Faça login para responder avaliações",
                                        variant: "destructive"
                                      });
                                      return;
                                    }
                                  }}
                                >
                                  <MessageSquare size={14} className="mr-1" />
                                  <span>Responder</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Similar Recipes Section */}
        {similarRecipes.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="heading-md mb-6">Receitas Semelhantes</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarRecipes.map(similarRecipe => (
                  <Link 
                    key={similarRecipe.id}
                    to={`/recipe/${similarRecipe.id}`}
                    className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-transform hover:scale-[1.02]"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={similarRecipe.imageUrl} 
                        alt={similarRecipe.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-2">{similarRecipe.title}</h3>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <img 
                          src={similarRecipe.author.avatarUrl} 
                          alt={similarRecipe.author.name} 
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span>por {similarRecipe.author.name}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeDetail;
