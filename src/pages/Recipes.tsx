import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { allRecipes, RecipeCategory } from '@/data/mockData';
import { Search, Filter, ChevronDown, X, Utensils, PlusCircle, SlidersHorizontal, Sparkles, Info, BookOpen, ChevronRight, Star, TrendingUp, Award, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Tutorial steps for first-time users
const tutorialSteps = [
  {
    title: "Pesquise Receitas",
    description: "Use a barra de pesquisa para encontrar receitas por nome, ingredientes ou categoria."
  },
  {
    title: "Filtre por Categorias",
    description: "Selecione categorias para encontrar receitas que atendam às suas preferências e objetivos."
  },
  {
    title: "Explore Detalhes",
    description: "Clique nas receitas para ver ingredientes, macros, passos de preparo e avaliações."
  },
  {
    title: "Salve suas Favoritas",
    description: "Ao criar uma conta, você pode salvar receitas para acessar facilmente depois."
  },
];

const Recipes: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [activeFilters, setActiveFilters] = useState<RecipeCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  
  // Parse URL params for category filter and search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Handle category parameter
    const categoryParam = params.get('category');
    if (categoryParam) {
      const categoryKey = Object.keys(RecipeCategory).find(
        (key) => key.toLowerCase() === categoryParam.toLowerCase()
      );
      
      if (categoryKey) {
        const category = RecipeCategory[categoryKey as keyof typeof RecipeCategory];
        setActiveFilters([category]);
      }
    }
    
    // Handle search parameter
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Check local storage to see if it's first visit
    const hasVisitedRecipes = localStorage.getItem('hasVisitedRecipes');
    if (!hasVisitedRecipes) {
      setShowTutorial(true);
      localStorage.setItem('hasVisitedRecipes', 'true');
    }
  }, [location]);
  
  const toggleFilter = (category: RecipeCategory) => {
    if (activeFilters.includes(category)) {
      setActiveFilters(activeFilters.filter(c => c !== category));
    } else {
      setActiveFilters([...activeFilters, category]);
    }
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  };
  
  const handleSuggestCategory = () => {
    if (newCategoryName.trim()) {
      toast({
        title: "Categoria sugerida com sucesso!",
        description: "Nossa equipe irá analisar sua sugestão em breve.",
        duration: 3000,
      });
      setNewCategoryName('');
      setNewCategoryDescription('');
    } else {
      toast({
        title: "Nome da categoria é obrigatório",
        description: "Por favor, informe um nome para a categoria.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  const nextTutorialStep = () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
      setCurrentTutorialStep(currentTutorialStep + 1);
    } else {
      setShowTutorial(false);
    }
  };
  
  const prevTutorialStep = () => {
    if (currentTutorialStep > 0) {
      setCurrentTutorialStep(currentTutorialStep - 1);
    }
  };
  
  // Filter recipes based on active filters and search term
  const filteredRecipes = allRecipes.filter(recipe => {
    // Filter by category if there are active filters
    const matchesCategory = activeFilters.length === 0 || 
      recipe.categories.some(category => activeFilters.includes(category));
    
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.categories.some(category => 
        category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return matchesCategory && matchesSearch;
  });
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 20
      }
    }
  };
  
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Tutorial Dialog */}
        <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-fitcooker-orange" />
                Como Explorar Receitas
              </DialogTitle>
              <DialogDescription>
                Aprenda a encontrar e utilizar as receitas perfeitas para seus objetivos.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {tutorialSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`pl-10 pb-6 relative ${index === currentTutorialStep ? 'opacity-100' : 'opacity-40'}`}
                  >
                    <div className={`absolute left-2 top-1 w-6 h-6 rounded-full flex items-center justify-center 
                      ${index === currentTutorialStep 
                        ? 'bg-fitcooker-orange text-white' 
                        : index < currentTutorialStep 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-500'}`}
                    >
                      {index < currentTutorialStep ? '✓' : index + 1}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={prevTutorialStep}
                disabled={currentTutorialStep === 0}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-500">
                {currentTutorialStep + 1} de {tutorialSteps.length}
              </span>
              <Button onClick={nextTutorialStep}>
                {currentTutorialStep < tutorialSteps.length - 1 ? 'Próximo' : 'Concluir'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Enhanced Header Section */}
        <section className="relative py-16 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-fitcooker-orange/5 via-transparent to-fitcooker-yellow/5"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-fitcooker-orange/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-fitcooker-yellow/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-fitcooker-orange/5 to-fitcooker-yellow/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow rounded-2xl mb-6 shadow-lg">
                <Utensils className="h-10 w-10 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-fitcooker-orange via-fitcooker-yellow to-fitcooker-orange bg-clip-text text-transparent">
                Receitas <span className="text-gray-900">Fit</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Descubra milhares de receitas saudáveis criadas especialmente para seus objetivos fitness. 
                Do <strong>bulking</strong> ao <strong>cutting</strong>, encontre a receita perfeita para cada momento da sua jornada.
              </p>
              
              {/* Statistics Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-fitcooker-orange mr-1" />
                    <span className="text-2xl font-bold text-gray-900">4.8</span>
                  </div>
                  <p className="text-sm text-gray-600">Avaliação Média</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">2K+</span>
                  </div>
                  <p className="text-sm text-gray-600">Receitas Ativas</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-blue-500 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">50K+</span>
                  </div>
                  <p className="text-sm text-gray-600">Usuários Ativos</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-center mb-2">
                    <Award className="h-5 w-5 text-purple-500 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">98%</span>
                  </div>
                  <p className="text-sm text-gray-600">Satisfação</p>
                </motion.div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setShowTutorial(true)}
                className="hover:bg-fitcooker-orange/10 hover:border-fitcooker-orange transition-all duration-300"
              >
                <Info className="mr-2 h-4 w-4" />
                Como usar a plataforma
              </Button>
            </motion.div>
            
            {/* Enhanced Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-fitcooker-orange" />
                  </div>
                  <input
                    type="text"
                    placeholder="Busque por receitas, ingredientes, objetivos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-5 pl-16 pr-6 bg-transparent border-none rounded-2xl focus:outline-none focus:ring-0 text-lg placeholder-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-6 flex items-center hover:text-gray-700 transition-colors"
                    >
                      <X className="h-6 w-6 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Mobile Filters Toggle */}
        <div className="md:hidden px-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <Filter size={20} className="mr-3 text-fitcooker-orange" />
              <span className="font-medium">Filtros Inteligentes</span>
            </div>
            <ChevronDown size={20} className={`transition-transform text-fitcooker-orange ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Recipe Grid with Enhanced Sidebar Layout */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Enhanced Sidebar Filters */}
              <div className={`lg:w-1/4 xl:w-1/5 ${showFilters || 'hidden lg:block'}`}>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-bold text-xl flex items-center text-gray-900">
                      <SlidersHorizontal size={20} className="mr-3 text-fitcooker-orange" />
                      Filtros
                    </h2>
                    {(activeFilters.length > 0 || searchTerm) && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center font-medium"
                      >
                        <X size={16} className="mr-1" />
                        Limpar
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-sm font-semibold mb-4 flex items-center text-gray-700">
                      <Sparkles className="w-4 h-4 text-fitcooker-orange mr-2" />
                      Categorias Disponíveis
                    </h3>
                    
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 mb-6 bg-gray-100">
                        <TabsTrigger value="all" className="data-[state=active]:bg-fitcooker-orange data-[state=active]:text-white">Todas</TabsTrigger>
                        <TabsTrigger value="popular" className="data-[state=active]:bg-fitcooker-orange data-[state=active]:text-white">Populares</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="mt-0">
                        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {Object.values(RecipeCategory).map((category) => (
                            <TooltipProvider key={category}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => toggleFilter(category)}
                                    className={`text-left px-4 py-3 rounded-xl transition-all group ${
                                      activeFilters.includes(category)
                                        ? 'bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow text-white shadow-lg transform scale-[1.02]'
                                        : 'hover:bg-gray-50 border border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-3 ${
                                          activeFilters.includes(category) ? 'bg-white' : 'bg-fitcooker-orange'
                                        }`}></div>
                                        <span className="font-medium">{category}</span>
                                      </div>
                                      {activeFilters.includes(category) && (
                                        <Sparkles size={14} className="text-white animate-pulse" />
                                      )}
                                    </div>
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Receitas focadas em {category}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="popular" className="mt-0">
                        <div className="flex flex-col gap-3">
                          {Object.values(RecipeCategory).slice(0, 6).map((category) => (
                            <button
                              key={category}
                              onClick={() => toggleFilter(category)}
                              className={`text-left px-4 py-3 rounded-xl transition-all ${
                                activeFilters.includes(category)
                                  ? 'bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow text-white shadow-lg'
                                  : 'hover:bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className={`w-3 h-3 rounded-full mr-3 ${
                                    activeFilters.includes(category) ? 'bg-white' : 'bg-fitcooker-orange'
                                  }`}></div>
                                  <span className="font-medium">{category}</span>
                                </div>
                                <span className="text-xs bg-fitcooker-orange/20 text-fitcooker-orange px-2 py-1 rounded-full font-medium">
                                  Popular
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  {/* Enhanced Suggest New Category */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="mt-8 w-full text-sm text-fitcooker-orange hover:text-fitcooker-orange/80 flex items-center justify-center py-3 border border-fitcooker-orange/20 rounded-xl hover:bg-fitcooker-orange/5 transition-all">
                        <PlusCircle size={16} className="mr-2" />
                        Sugerir nova categoria
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Sugerir Nova Categoria</DialogTitle>
                        <DialogDescription>
                          Não encontrou a categoria que procurava? Sugira uma nova categoria para nossas receitas.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="categoryName" className="text-right">
                            Nome
                          </Label>
                          <Input
                            id="categoryName"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="col-span-3"
                            placeholder="Ex: Low Carb, Sem Glúten, etc."
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="categoryDescription" className="text-right">
                            Descrição
                          </Label>
                          <Input
                            id="categoryDescription"
                            value={newCategoryDescription}
                            onChange={(e) => setNewCategoryDescription(e.target.value)}
                            className="col-span-3"
                            placeholder="Descreva brevemente essa categoria"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleSuggestCategory}>Enviar sugestão</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              </div>
              
              {/* Enhanced Recipe Content */}
              <div className="lg:w-3/4 xl:w-4/5">
                {filteredRecipes.length > 0 ? (
                  <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {filteredRecipes.length} receitas encontradas
                        </h2>
                        <p className="text-gray-600">
                          Explore nossa seleção de receitas fit e saudáveis
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-sm font-medium">Ordenar por:</span>
                        <select className="bg-white border border-gray-300 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-fitcooker-orange focus:border-transparent shadow-sm">
                          <option>Mais relevantes</option>
                          <option>Melhor avaliadas</option>
                          <option>Mais recentes</option>
                          <option>Menos calorias</option>
                          <option>Mais proteína</option>
                          <option>Tempo de preparo</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Active Filters Display */}
                    {activeFilters.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center mb-6 flex-wrap gap-3"
                      >
                        <span className="text-sm text-gray-600 font-medium">Filtros ativos:</span>
                        {activeFilters.map((filter) => (
                          <div key={filter} className="flex items-center bg-gradient-to-r from-fitcooker-orange/10 to-fitcooker-yellow/10 text-fitcooker-orange text-sm px-4 py-2 rounded-full border border-fitcooker-orange/20">
                            {filter}
                            <button
                              onClick={() => toggleFilter(filter)}
                              className="ml-2 hover:text-fitcooker-orange/70 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </motion.div>
                    )}
                    
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                    >
                      {filteredRecipes.map((recipe) => (
                        <motion.div 
                          key={recipe.id} 
                          variants={itemVariants}
                          whileHover={{
                            y: -8,
                            transition: { duration: 0.3 }
                          }}
                          className="h-full"
                        >
                          <RecipeCard 
                            recipe={recipe} 
                            className="bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden h-full group"
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    {/* Enhanced Pagination */}
                    <div className="mt-16 flex justify-center">
                      <div className="flex items-center space-x-2 bg-white rounded-xl shadow-lg border border-gray-100 p-2">
                        <Button variant="outline" size="sm" disabled className="rounded-lg">
                          <ChevronRight className="h-4 w-4 rotate-180" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-fitcooker-orange text-white border-fitcooker-orange rounded-lg">1</Button>
                        <Button variant="outline" size="sm" className="rounded-lg">2</Button>
                        <Button variant="outline" size="sm" className="rounded-lg">3</Button>
                        <span className="px-2 text-gray-400">...</span>
                        <Button variant="outline" size="sm" className="rounded-lg">12</Button>
                        <Button variant="outline" size="sm" className="rounded-lg">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100"
                  >
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <Search className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-gray-900">Nenhuma receita encontrada</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Não conseguimos encontrar receitas que correspondam aos seus critérios de busca. 
                      Tente ajustar seus filtros ou usar outros termos de pesquisa.
                    </p>
                    <Button 
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow hover:from-fitcooker-orange/90 hover:to-fitcooker-yellow/90 text-white px-8 py-3 rounded-xl shadow-lg"
                    >
                      Limpar todos os filtros
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #eab308);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #d97706);
        }
      `}</style>
    </div>
  );
};

export default Recipes;
