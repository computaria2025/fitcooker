
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Zap, Shield, TrendingUp, Smile, Leaf, Apple } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const AlimentacaoSaudavel: React.FC = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Saúde do Coração",
      description: "Uma alimentação equilibrada reduz o risco de doenças cardiovasculares, mantendo seu coração forte e saudável.",
      color: "text-red-500"
    },
    {
      icon: Brain,
      title: "Mente Mais Clara",
      description: "Nutrientes adequados melhoram a concentração, memória e humor, mantendo seu cérebro funcionando perfeitamente.",
      color: "text-purple-500"
    },
    {
      icon: Zap,
      title: "Mais Energia",
      description: "Alimentos nutritivos fornecem energia sustentável ao longo do dia, sem picos e quedas de glicose.",
      color: "text-yellow-500"
    },
    {
      icon: Shield,
      title: "Sistema Imunológico",
      description: "Vitaminas e minerais fortalecem suas defesas naturais contra doenças e infecções.",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      title: "Longevidade",
      description: "Estudos mostram que uma boa alimentação pode adicionar anos saudáveis à sua vida.",
      color: "text-blue-500"
    },
    {
      icon: Smile,
      title: "Bem-estar Mental",
      description: "A nutrição adequada está diretamente ligada à produção de neurotransmissores do bem-estar.",
      color: "text-pink-500"
    }
  ];

  const stats = [
    { number: "80%", text: "das doenças crônicas podem ser prevenidas com alimentação adequada" },
    { number: "30%", text: "mais energia com uma dieta balanceada" },
    { number: "70%", text: "do seu humor é influenciado pela alimentação" },
    { number: "15+", text: "anos a mais de vida saudável" }
  ];

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-green-50 via-white to-orange-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmY3ZWQiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJtMzYgMzQgNC00IDQgNHYxMkg0MFoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow rounded-full mb-8"
            >
              <Apple size={40} className="text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-gray-900"
            >
              Por que Cuidar da{" "}
              <span className="text-gradient">Alimentação</span>?
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
            >
              Descubra como pequenas mudanças na sua alimentação podem transformar 
              completamente sua qualidade de vida, energia e bem-estar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link
                to="/recipes"
                className="btn btn-primary px-8 py-4 text-lg inline-flex items-center space-x-2 hover:scale-105 transition-transform"
              >
                <Leaf size={24} />
                <span>Comece Sua Jornada</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-32 left-10 text-6xl opacity-20"
        >
          🥗
        </motion.div>
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "1s" }}
          className="absolute top-48 right-16 text-5xl opacity-20"
        >
          🍎
        </motion.div>
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
          className="absolute bottom-20 left-20 text-4xl opacity-20"
        >
          🥑
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {stat.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Os Benefícios de uma{" "}
              <span className="text-gradient">Alimentação Consciente</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada nutriente que você consome é um investimento no seu futuro. 
              Veja como a alimentação adequada transforma sua vida.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon size={32} className={benefit.color} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-fitcooker-orange via-fitcooker-yellow to-fitcooker-orange">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Sua Jornada Saudável Começa Agora
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Não espere mais para transformar sua vida. Comece hoje mesmo 
              com receitas deliciosas e nutritivas que vão revolucionar 
              sua relação com a comida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/recipes"
                className="bg-white text-fitcooker-orange px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
              >
                <span>Explorar Receitas</span>
              </Link>
              <Link
                to="/add-recipe"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-fitcooker-orange transition-colors"
              >
                Compartilhar Receita
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AlimentacaoSaudavel;
