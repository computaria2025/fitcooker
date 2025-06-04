import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Users, Award, ChefHat, Search, Heart, Filter } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { topCooks } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import LoginPrompt from '@/components/add-recipe/LoginPrompt';

// Extended cook data based on existing mockData
const extendedCooks = topCooks.map(cook => ({
  ...cook,
  specialty: cook.id === 1 ? "Receitas High Protein" : 
            cook.id === 2 ? "Bulking Saudável" : 
            cook.id === 3 ? "Receitas Vegetarianas" : "Sobremesas Fitness",
  followers: cook.followers,
  recipes: cook.recipes,
  verified: true,
  avatar: cook.avatarUrl,
  description: cook.bio,
  achievements: cook.id === 1 ? ["Top Chef 2023", "Mais de 12K seguidores", "Certificação Nutricional"] :
               cook.id === 2 ? ["Nutricionista Esportivo", "Top Recipes 2023", "Certificação Internacional"] :
               cook.id === 3 ? ["Chef Vegana do Ano", "Receitas Inovadoras", "Certificação Plant-Based"] :
               ["Especialista em Fitness", "Baixa Caloria Expert", "Certificação Culinary"]
}));

const additionalCooks = [
  {
    id: 5,
    name: "Chef Julia Santos",
    specialty: "Cutting e Definição",
    rating: 4.7,
    followers: 8900,
    recipes: 52,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    description: "Especialista em receitas para cutting e definição muscular.",
    achievements: ["Nutricionista Fitness", "Especialista em Cutting", "Receitas de Baixa Caloria"]
  },
  {
    id: 6,
    name: "Chef Roberto Lima",
    specialty: "Pratos Funcionais",
    rating: 4.6,
    followers: 7200,
    recipes: 41,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    description: "Criador de pratos funcionais para performance atlética.",
    achievements: ["Chef Funcional", "Performance Expert", "Certificação Esportiva"]
  }
];

const allCooks = [...extendedCooks, ...additionalCooks];

const Cooks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [visibleCooks, setVisibleCooks] = useState(6);
  const [followedCooks, setFollowedCooks] = useState<number[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Mock auth state - in a real app, this would come from context
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const specialties = ['Todos', ...Array.from(new Set(allCooks.map(cook => cook.specialty)))];

  const filteredCooks = allCooks.filter(cook => {
    const matchesSearch = cook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cook.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === '' || selectedSpecialty === 'Todos' || cook.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const displayedCooks = filteredCooks.slice(0, visibleCooks);

  const handleFollow = (cookId: number) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (followedCooks.includes(cookId)) {
      setFollowedCooks(followedCooks.filter(id => id !== cookId));
    } else {
      setFollowedCooks([...followedCooks, cookId]);
    }
  };

  const loadMoreCooks = () => {
    setVisibleCooks(prev => Math.min(prev + 6, filteredCooks.length));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    }
  };

  const titleVariants = {
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
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Enhanced Header */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow rounded-2xl mb-6 shadow-xl">
            <ChefHat className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-fitcooker-orange via-fitcooker-yellow to-fitcooker-orange bg-clip-text text-transparent">
            Mestres da Culinária Fit
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Conheça os chefs mais talentosos da nossa comunidade. Profissionais dedicados que 
            transformam ingredientes simples em receitas extraordinárias para seus objetivos fitness.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{allCooks.length}+</div>
            <div className="text-sm text-gray-600">Chefs Ativos</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">50+</div>
            <div className="text-sm text-gray-600">Certificados</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">4.8</div>
            <div className="text-sm text-gray-600">Avaliação Média</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {allCooks.reduce((sum, cook) => sum + cook.recipes, 0)}+
            </div>
            <div className="text-sm text-gray-600">Receitas Criadas</div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Pesquisar chefs por nome ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fitcooker-orange focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Specialty Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fitcooker-orange focus:border-transparent outline-none bg-white min-w-[180px]"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty === 'Todos' ? '' : specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredCooks.length} chef{filteredCooks.length !== 1 ? 's' : ''} encontrado{filteredCooks.length !== 1 ? 's' : ''}
          </div>
        </motion.div>

        {/* Cooks Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayedCooks.map((cook) => (
            <motion.div
              key={cook.id}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src={cook.avatar}
                      alt={cook.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {cook.verified && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitcooker-orange transition-colors">
                      {cook.name}
                    </h3>
                    <p className="text-fitcooker-orange font-medium">{cook.specialty}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 line-clamp-2">{cook.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">{cook.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">Avaliação</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {cook.followers.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500">Seguidores</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 mb-1">{cook.recipes}</div>
                    <p className="text-xs text-gray-500">Receitas</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {cook.achievements.slice(0, 2).map((achievement, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Award className="w-3 h-3 text-fitcooker-orange mr-2" />
                      {achievement}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Link
                    to={`/cook/${cook.id}`}
                    className="block w-full text-center bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Ver Perfil
                  </Link>

                  <Button
                    onClick={() => handleFollow(cook.id)}
                    variant={followedCooks.includes(cook.id) ? "default" : "outline"}
                    className={`w-full ${
                      followedCooks.includes(cook.id)
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white"
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${followedCooks.includes(cook.id) ? "fill-current" : ""}`} />
                    {followedCooks.includes(cook.id) ? "Seguindo" : "Seguir"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        {displayedCooks.length < filteredCooks.length && (
          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={loadMoreCooks}
                variant="outline"
                className="border-2 border-fitcooker-orange text-fitcooker-orange px-8 py-3 rounded-xl font-medium hover:bg-fitcooker-orange hover:text-white transition-all duration-300"
              >
                Carregar Mais Chefs ({filteredCooks.length - displayedCooks.length} restantes)
              </Button>
            </motion.div>
          </div>
        )}

        {/* No Results Message */}
        {filteredCooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum chef encontrado</h3>
            <p className="text-gray-500">Tente ajustar seus filtros ou termo de pesquisa.</p>
          </motion.div>
        )}
      </div>

      {/* Login Prompt Dialog */}
      <LoginPrompt 
        showLoginPrompt={showLoginPrompt}
        setShowLoginPrompt={setShowLoginPrompt}
      />

      <Footer />
    </div>
  );
};

export default Cooks;
