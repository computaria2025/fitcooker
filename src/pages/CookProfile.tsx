import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Award, ChefHat, Heart, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { topCooks, featuredRecipes } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/ui/RecipeCard';
import LoginPrompt from '@/components/add-recipe/LoginPrompt';

const CookProfile: React.FC = () => {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Mock auth state - in a real app, this would come from context
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Extended cook data (same as in Cooks.tsx)
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
                 ["Especialista em Fitness", "Baixa Caloria Expert", "Certificação Culinary"],
    joinDate: "Janeiro 2023",
    location: "São Paulo, Brasil",
    about: "Apaixonado pela arte culinária e pela vida saudável, dedico minha carreira a criar receitas que unem sabor e nutrição. Acredito que comer bem é um ato de amor próprio e quero inspirar outras pessoas nessa jornada."
  }));

  const cook = extendedCooks.find(c => c.id === parseInt(id || ''));
  
  // Filter recipes by author (for demo purposes, showing all featured recipes)
  const cookRecipes = featuredRecipes.filter(recipe => recipe.author.id === parseInt(id || ''));

  if (!cook) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chef não encontrado</h2>
          <Link to="/cooks" className="text-fitcooker-orange hover:underline">
            Voltar para lista de chefs
          </Link>
        </div>
      </div>
    );
  }

  const handleFollow = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/cooks"
            className="inline-flex items-center text-fitcooker-orange hover:text-fitcooker-orange/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para chefs
          </Link>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow h-32"></div>
          
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img
                  src={cook.avatar}
                  alt={cook.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {cook.verified && (
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{cook.name}</h1>
                <p className="text-xl text-fitcooker-orange font-medium mb-4">{cook.specialty}</p>
                
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="font-semibold">{cook.rating}</span>
                    <span className="text-gray-500 ml-1">avaliação</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="font-semibold">{cook.followers.toLocaleString()}</span>
                    <span className="text-gray-500 ml-1">seguidores</span>
                  </div>
                  <div className="flex items-center">
                    <ChefHat className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="font-semibold">{cook.recipes}</span>
                    <span className="text-gray-500 ml-1">receitas</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Membro desde {cook.joinDate}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{cook.location}</span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed">{cook.about}</p>
              </div>

              <div className="lg:w-auto">
                <Button
                  onClick={handleFollow}
                  size="lg"
                  className={`w-full lg:w-auto px-8 ${
                    isFollowing
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow text-white hover:shadow-lg"
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isFollowing ? "fill-current" : ""}`} />
                  {isFollowing ? "Seguindo" : "Seguir Chef"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Conquistas & Certificações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cook.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                <Award className="w-6 h-6 text-fitcooker-orange mr-3" />
                <span className="font-medium text-gray-900">{achievement}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recipes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Receitas do Chef</h2>
            <span className="text-gray-500">{cookRecipes.length} receita{cookRecipes.length !== 1 ? 's' : ''}</span>
          </div>

          {cookRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cookRecipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * recipe.id }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma receita encontrada</h3>
              <p className="text-gray-500">Este chef ainda não publicou receitas em nossa plataforma.</p>
            </div>
          )}
        </motion.div>
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

export default CookProfile;
