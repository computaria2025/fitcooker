
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedRecipes from '@/components/home/FeaturedRecipes';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedRecipes />
        
        {/* Benefits Section */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 className="heading-lg mb-4">Por Que Escolher o FitCooker?</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Navegue por centenas de receitas fit, calcule macros com precisão e acompanhe sua jornada nutricional.
              </p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div 
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-sm transform transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-fitcooker-orange/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fitcooker-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="heading-sm mb-2">Cálculo de Macros</h3>
                <p className="text-gray-600">
                  Acompanhe calorias, proteínas, carboidratos e gorduras em cada receita com precisão.
                </p>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-sm transform transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-fitcooker-yellow/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fitcooker-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="heading-sm mb-2">Adicione Suas Receitas</h3>
                <p className="text-gray-600">
                  Compartilhe suas próprias criações com a comunidade e se torne um cozinheiro de destaque.
                </p>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-sm transform transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="heading-sm mb-2">Múltiplas Categorias</h3>
                <p className="text-gray-600">
                  Encontre receitas por objetivo: bulking, cutting, low-carb e muitas outras opções.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-fitcooker-black">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Pronto para começar sua jornada culinária fit?
              </h2>
              <p className="text-gray-300 mb-8">
                Junte-se a milhares de pessoas que estão transformando sua alimentação com o FitCooker.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/signup" 
                  className="btn btn-primary"
                >
                  Criar Conta Grátis
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/recipes" 
                  className="btn bg-white text-fitcooker-black hover:bg-gray-100"
                >
                  Explorar Receitas
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
