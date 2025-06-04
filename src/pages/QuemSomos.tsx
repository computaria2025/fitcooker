
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { ChefHat, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuemSomos: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-fitcooker-orange/10 to-fitcooker-yellow/10 py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Quem Somos</h1>
              <p className="text-lg text-gray-700 mb-6">
                Conheça a história e a missão por trás do FitCooker.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center text-fitcooker-orange mb-2">
                  <div className="h-px w-12 bg-fitcooker-orange mr-4"></div>
                  <span className="font-medium uppercase">Nossa História</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">Do problema à solução</h2>
                <p className="text-gray-700 mb-6">
                  O FitCooker nasceu da dificuldade que muitas pessoas enfrentam em conciliar uma alimentação 
                  saudável com sabor e praticidade. Identificamos que mesmo com tantas informações disponíveis 
                  sobre nutrição, muitos ainda se sentem perdidos ao tentar criar refeições saudáveis e saborosas.
                </p>
                <p className="text-gray-700">
                  Nossa equipe, formada por especialistas em tecnologia e entusiastas de alimentação saudável, 
                  uniu forças para criar uma plataforma que não apenas compartilhasse receitas, mas que também 
                  educasse sobre nutrição e criasse uma comunidade engajada em torno do tema.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1612338093001-638a408f2b8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="Equipe FitCooker" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-fitcooker-orange/10 w-64 h-64 rounded-full -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center justify-center text-fitcooker-orange mb-2">
                  <div className="h-px w-12 bg-fitcooker-orange mr-4"></div>
                  <span className="font-medium uppercase">Nossos Valores</span>
                  <div className="h-px w-12 bg-fitcooker-orange ml-4"></div>
                </div>
                <h2 className="text-3xl font-bold mb-6">O que nos guia</h2>
                <p className="text-gray-700">
                  Nossos valores fundamentais orientam todas as decisões que tomamos e como desenvolvemos nossa plataforma.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-xl shadow-sm"
              >
                <div className="w-12 h-12 bg-fitcooker-orange/10 rounded-full flex items-center justify-center mb-6">
                  <ChefHat className="h-6 w-6 text-fitcooker-orange" />
                </div>
                <h3 className="text-xl font-bold mb-4">Acessibilidade</h3>
                <p className="text-gray-700">
                  Acreditamos que todos merecem acesso a informações nutricionais de qualidade e receitas 
                  saudáveis, independentemente de seu conhecimento prévio sobre culinária ou nutrição.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-8 rounded-xl shadow-sm"
              >
                <div className="w-12 h-12 bg-fitcooker-orange/10 rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-fitcooker-orange" />
                </div>
                <h3 className="text-xl font-bold mb-4">Comunidade</h3>
                <p className="text-gray-700">
                  Valorizamos o poder da comunidade e do compartilhamento de conhecimento. Acreditamos que 
                  juntos podemos criar uma revolução na forma como as pessoas se alimentam.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-8 rounded-xl shadow-sm"
              >
                <div className="w-12 h-12 bg-fitcooker-orange/10 rounded-full flex items-center justify-center mb-6">
                  <Star className="h-6 w-6 text-fitcooker-orange" />
                </div>
                <h3 className="text-xl font-bold mb-4">Qualidade</h3>
                <p className="text-gray-700">
                  Comprometemo-nos a oferecer informações nutricionais precisas e receitas testadas e aprovadas 
                  para garantir que nossos usuários tenham a melhor experiência possível.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-fitcooker-black text-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Junte-se a nós nesta jornada para uma alimentação mais saudável
              </h2>
              <p className="text-lg mb-8 text-gray-300">
                Faça parte da comunidade FitCooker e transforme sua relação com a comida.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup" className="btn bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white px-8 py-3 rounded-lg font-medium">
                  Criar conta grátis
                </Link>
                <Link to="/about#faq" className="btn border border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium">
                  Ver Perguntas Frequentes
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QuemSomos;
