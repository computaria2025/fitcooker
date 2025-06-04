
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChefHat, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroElement = heroRef.current;
      
      if (heroElement) {
        // Only apply opacity effect for content
        const contentOpacity = Math.max(1 - scrollPosition / 700, 0);
        const content = heroElement.querySelector('.hero-content') as HTMLElement;
        if (content) {
          content.style.opacity = contentOpacity.toString();
          content.style.transform = `translateY(${scrollPosition * 0.2}px)`;
        }
        
        // Scroll indicator fade out effect
        const scrollIndicatorOpacity = Math.max(1 - scrollPosition / 300, 0);
        setScrollOpacity(scrollIndicatorOpacity);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };
  
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20
      }
    },
    hover: { 
      y: -8,
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  
  return (
    <div 
      ref={heroRef}
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://static.vecteezy.com/ti/fotos-gratis/p1/2754160-fitness-equipment-and-health-food-on-blue-wooden-background-gratis-foto.JPG)',
      }}
    >
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 hero-content">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.div 
            variants={itemVariants}
            className="text-center mb-8 animate-fade-in"
          >
            <div className="flex items-center justify-center mb-2">
              <ChefHat size={40} className="text-fitcooker-orange mr-2" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Fit<span className="text-fitcooker-orange">Cooker</span>
              </h1>
            </div>
            <p className="text-white/90 text-xl md:text-3xl mt-4 mb-2 font-bold">
              TRANSFORME SUA DIETA, CONQUISTE SEU CORPO
            </p>
            <p className="text-white/80 text-lg md:text-xl mb-8 italic">
              Receitas de alto desempenho para quem busca resultados extraordinários
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <motion.span 
                variants={itemVariants}
                className="bg-fitcooker-orange px-3 py-1 rounded-full text-white text-sm font-medium inline-flex items-center justify-center h-8"
              >
                Alta Proteína
              </motion.span>
              <motion.span 
                variants={itemVariants}
                className="bg-fitcooker-yellow px-3 py-1 rounded-full text-black text-sm font-medium inline-flex items-center justify-center h-8"
              >
                Almoço
              </motion.span>
              <motion.span 
                variants={itemVariants}
                className="bg-white px-3 py-1 rounded-full text-fitcooker-black text-sm font-medium inline-flex items-center justify-center h-8"
              >
                Vegetariano
              </motion.span>
            </div>
          </motion.div>
          
          {/* Search Bar */}
          <motion.div 
            variants={itemVariants}
            className="mb-12 animate-fade-in"
          >
            <div className="relative mx-auto max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Busque por receitas, ingredientes ou categoria..."
                className="w-full py-4 pl-12 pr-4 border-none rounded-lg text-gray-900 focus:ring-2 focus:ring-fitcooker-orange transition-all duration-300 shadow-lg"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-2 bottom-2 px-4 bg-fitcooker-orange text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Buscar
              </motion.button>
            </div>
          </motion.div>
          
          {/* Categories */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in"
          >
            <motion.div variants={cardVariants} whileHover="hover">
              <Link 
                to="/recipes?category=bulking"
                className="bg-fitcooker-orange/20 backdrop-blur-md rounded-lg p-4 text-center block h-full transition-all duration-300"
              >
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-fitcooker-orange" />
                <span className="text-white font-medium">Bulking</span>
              </Link>
            </motion.div>
            
            <motion.div variants={cardVariants} whileHover="hover">
              <Link 
                to="/recipes?category=cutting"
                className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center block h-full transition-all duration-300"
              >
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-fitcooker-yellow" />
                <span className="text-white font-medium">Cutting</span>
              </Link>
            </motion.div>
            
            <motion.div variants={cardVariants} whileHover="hover">
              <Link 
                to="/recipes?category=highprotein"
                className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center block h-full transition-all duration-300"
              >
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <span className="text-white font-medium">Alto Proteína</span>
              </Link>
            </motion.div>
            
            <motion.div variants={cardVariants} whileHover="hover">
              <Link 
                to="/recipes?category=lowcarb"
                className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center block h-full transition-all duration-300"
              >
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <span className="text-white font-medium">Low Carb</span>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* CTA Button */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 text-center animate-fade-in"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/recipes"
                className="btn bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 border-2 border-fitcooker-orange"
              >
                <span>Explorar Todas as Receitas</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 mx-auto"
        style={{ 
          opacity: scrollOpacity,
          visibility: scrollOpacity === 0 ? 'hidden' : 'visible',
          animation: "float 5s ease-in-out infinite" // Much slower animation
        }}
      >
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
