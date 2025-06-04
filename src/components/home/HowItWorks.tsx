
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ChefHat, Utensils, MessageSquare } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-6 h-6 text-white" />,
    title: "Encontre receitas",
    description: "Busque por centenas de receitas saudáveis e nutritivas baseadas em seus objetivos e preferências alimentares.",
    link: "/recipes"
  },
  {
    icon: <ChefHat className="w-6 h-6 text-white" />,
    title: "Prepare suas refeições",
    description: "Siga instruções claras e detalhadas para preparar refeições saudáveis e deliciosas em poucos minutos.",
    link: "/add-recipe"
  },
  {
    icon: <Utensils className="w-6 h-6 text-white" />,
    title: "Acompanhe os macros",
    description: "Tenha informações precisas sobre proteínas, carboidratos, gorduras e calorias para cada receita.",
    link: "/recipes"
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-white" />,
    title: "Compartilhe com a comunidade",
    description: "Avalie receitas, compartilhe suas criações e interaja com outros entusiastas de alimentação saudável.",
    link: "/cooks"
  }
];

const HowItWorks = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Como funciona o FitCooker</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Uma plataforma intuitiva para transformar sua alimentação com receitas 
            saudáveis e saborosas em poucos passos.
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line - positioned in the center vertically */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1.5 -translate-x-1/2 bg-fitcooker-orange/20 rounded-full"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex ${index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'}`}
              >
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md relative hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  <Link 
                    to={step.link}
                    className="absolute -left-3 lg:left-auto 
                      lg:inset-x-0 lg:top-1/2 lg:-translate-y-1/2
                      flex items-center justify-center w-12 h-12 bg-fitcooker-orange rounded-full shadow-md z-10
                      lg:mx-auto hover:bg-fitcooker-orange/90 transition-colors"
                      style={{
                        [index % 2 === 0 ? 'right' : 'left']: '-24px',
                        [index % 2 === 0 ? 'left' : 'right']: 'auto',
                      }}
                  >
                    {step.icon}
                  </Link>
                  
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
