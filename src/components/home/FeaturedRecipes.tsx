
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { featuredRecipes } from '@/data/mockData';
import RecipeCard from '@/components/ui/RecipeCard';
import RecipeCardSkeleton from '@/components/ui/RecipeCardSkeleton';
import { ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturedRecipes: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedRecipes, setLoadedRecipes] = useState<number[]>([]);

  // Simulate loading with staggered effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // Stagger the appearance of recipes
    featuredRecipes.forEach((_, index) => {
      setTimeout(() => {
        setLoadedRecipes(prev => [...prev, index]);
      }, 200 + index * 100);
    });

    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25,
        mass: 0.8
      }
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const hoverVariants = {
    hover: {
      scale: 1.02,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <div className="flex items-center mb-2">
              <ChefHat size={24} className="text-fitcooker-orange mr-2" />
              <h2 className="heading-lg">Receitas em Destaque</h2>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Explore nossas receitas mais populares, cuidadosamente selecionadas para garantir sabor e nutrição.
            </p>
          </div>
          <motion.div 
            whileHover="hover"
            variants={hoverVariants}
          >
            <Link
              to="/recipes"
              className="mt-4 md:mt-0 btn btn-outline self-start md:self-auto"
            >
              Ver Todas
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Featured Recipes (First 2) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          <AnimatePresence>
            {featuredRecipes.slice(0, 2).map((recipe, index) => (
              <motion.div 
                key={recipe.id} 
                variants={itemVariants}
                initial="hidden"
                animate={loadedRecipes.includes(index) ? "visible" : "hidden"}
                whileHover={{ 
                  y: -4,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                className="will-change-transform"
              >
                {isLoading && !loadedRecipes.includes(index) ? (
                  <RecipeCardSkeleton featured={true} />
                ) : (
                  <RecipeCard recipe={recipe} featured={true} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Regular Recipes Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {featuredRecipes.slice(2).map((recipe, index) => {
              const actualIndex = index + 2;
              return (
                <motion.div 
                  key={recipe.id} 
                  variants={itemVariants}
                  initial="hidden"
                  animate={loadedRecipes.includes(actualIndex) ? "visible" : "hidden"}
                  whileHover={{ 
                    y: -4,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  className="will-change-transform"
                >
                  {isLoading && !loadedRecipes.includes(actualIndex) ? (
                    <RecipeCardSkeleton />
                  ) : (
                    <RecipeCard recipe={recipe} />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedRecipes;
