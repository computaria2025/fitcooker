import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Pencil, 
  Calculator, 
  MessageSquare,
  Book,
  Bookmark,
  Search,
  Users,
  ClipboardList,
  ChevronRight,
  Heart,
  TrendingUp,
  ChefHat,
  MessageSquare as Comment
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const Home: React.FC = () => {
  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20
      }
    }
  };

  // Features data
  const features = [
    {
      icon: <Pencil className="h-6 w-6 text-fitcooker-orange" />,
      title: "Criação de receitas personalizadas",
      description: "Crie e compartilhe suas próprias receitas com a comunidade."
    },
    {
      icon: <Calculator className="h-6 w-6 text-fitcooker-orange" />,
      title: "Cálculo automático de macronutrientes",
      description: "Veja automaticamente os valores nutricionais de cada receita."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-fitcooker-orange" />,
      title: "Comunidade ativa para troca de dicas",
      description: "Participe de discussões e compartilhe seu conhecimento."
    },
    {
      icon: <Book className="h-6 w-6 text-fitcooker-orange" />,
      title: "Acesso rápido a receitas saudáveis",
      description: "Encontre rapidamente receitas que se encaixam nos seus objetivos."
    },
    {
      icon: <Bookmark className="h-6 w-6 text-fitcooker-orange" />,
      title: "Organização de favoritas em coleções",
      description: "Salve e organize suas receitas favoritas para acesso rápido."
    }
  ];

  // User profiles
  const userProfiles = [
    {
      icon: <Search className="h-10 w-10 text-white" />,
      bgColor: "bg-fitcooker-orange",
      title: "Para quem só quer explorar receitas",
      description: "Descubra receitas saudáveis, filtrando por proteína, carboidrato, tempo de preparo ou preferências alimentares.",
      features: [
        "Acesso rápido, sem necessidade de criar conta",
        "Receitas em alta, recentes e mais bem avaliadas",
        "Filtragem por objetivos de saúde e fitness"
      ],
      cta: "Explorar receitas",
      link: "/recipes"
    },
    {
      icon: <Pencil className="h-10 w-10 text-white" />,
      bgColor: "bg-green-500",
      title: "Para quem quer adicionar suas receitas",
      description: "Crie suas próprias receitas com passos claros e automação de macros.",
      features: [
        "Ferramenta de preenchimento inteligente",
        "Cálculo automático de macros",
        "Compartilhe com a comunidade"
      ],
      cta: "Adicionar receita",
      link: "/add-recipe"
    },
    {
      icon: <Users className="h-10 w-10 text-white" />,
      bgColor: "bg-fitcooker-orange",
      title: "Para quem quer interagir",
      description: "Curta, comente, siga autores favoritos e participe de discussões.",
      features: [
        "Compartilhe dicas e variações",
        "Siga autores favoritos",
        "Ganhe selos e destaque na comunidade"
      ],
      cta: "Entrar na comunidade",
      link: "/signup"
    }
  ];

  // How it works steps - updated without numbers
  const steps = [
    {
      icon: <ClipboardList className="h-8 w-8 text-fitcooker-orange" />,
      title: "Crie uma conta grátis",
      description: "Ou explore como visitante sem se cadastrar.",
      link: "/signup"
    },
    {
      icon: <Search className="h-8 w-8 text-fitcooker-orange" />,
      title: "Explore ou crie receitas",
      description: "Encontre ou compartilhe receitas conforme seus objetivos.",
      link: "/recipes"
    },
    {
      icon: <Calculator className="h-8 w-8 text-fitcooker-orange" />,
      title: "Veja os macronutrientes",
      description: "Acompanhe automaticamente os valores nutricionais.",
      link: "/recipes"
    },
    {
      icon: <Heart className="h-8 w-8 text-fitcooker-orange" />,
      title: "Salve suas favoritas",
      description: "Organize suas receitas preferidas em coleções.",
      link: "/recipes"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-fitcooker-orange" />,
      title: "Interaja com a comunidade",
      description: "Compartilhe conhecimento e dicas com outros usuários.",
      link: "/cooks"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-fitcooker-orange" />,
      title: "Use filtros e categorias",
      description: "Mantenha o foco nos seus resultados e objetivos.",
      link: "/recipes"
    },
    {
      icon: <Comment className="h-8 w-8 text-fitcooker-orange" />,
      title: "Avalie e comente receitas",
      description: "Contribua com feedback valioso para outros usuários.",
      link: "/recipes"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-fitcooker-orange/10 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-xl"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center mb-6"
                >
                  {/*
                  <ChefHat className="h-8 w-8 text-fitcooker-orange mr-2" />
                  */}

                  <span className="text-sm font-semibold bg-fitcooker-orange/10 text-fitcooker-orange px-3 py-1 rounded-full">
                    NUTRIÇÃO · SAÚDE · SABOR
                  </span>
                </motion.div>
                
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-fitcooker-orange">
                  Vem conhecer o FitCooker
                </h2>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Alimente-se melhor com <span className="text-fitcooker-orange">sabor e praticidade</span>
                </h1>
                
                <p className="text-lg text-gray-700 mb-8">
                  O FitCooker é a plataforma ideal para criar, descobrir e compartilhar receitas de todos os tipos — embora a gente recomende as mais saudáveis! 🤣 <br /> Você pode visualizar informações nutricionais automaticamente, explorar receitas, interagir com a comunidade, seguir perfis que combinam com você e escolher se quer ser um <b>chef</b> ou apenas um <b>espectador</b>.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link to="/signup" className="btn bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white px-8 py-4 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg border-2 border-fitcooker-orange min-w-40 text-center">
                    Criar minha conta grátis
                  </Link>
                  <Link to="/recipes" className="flex items-center justify-center text-fitcooker-orange border-2 border-fitcooker-orange px-8 py-4 rounded-lg font-medium transition-all hover:bg-fitcooker-orange/10 min-w-40 text-center">
                    Explorar receitas sem criar conta
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="Pratos saudáveis" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <p className="text-sm font-medium">Receita em destaque</p>
                      <h3 className="text-xl font-bold">Bowl de Proteína com Legumes</h3>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-fitcooker-yellow p-4 rounded-lg shadow-lg hidden md:block">
                  <div className="text-fitcooker-black flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    <span className="font-medium">Cálculo automático de macros</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Feature Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="w-12 h-12 bg-fitcooker-orange/10 rounded-full flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* User Profiles Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Como o FitCooker pode ajudar você</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Escolha seu caminho conforme seu objetivo pessoal e descubra os recursos feitos para você
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {userProfiles.map((profile, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className={cn("p-6 text-white", profile.bgColor)}>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      {profile.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{profile.title}</h3>
                    <p className="opacity-90">{profile.description}</p>
                  </div>
                  
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      {profile.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-fitcooker-orange mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link 
                      to={profile.link}
                      className="block text-center py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                    >
                      {profile.cta}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How it Works Section - Updated design */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Como funciona o FitCooker</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Descubra todas as funcionalidades e possibilidades para transformar sua alimentação
              </p>
            </motion.div>
            
            {/* Steps Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <Link 
                    to={step.link}
                    className="block bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-fitcooker-orange/30 transform hover:-translate-y-2"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-fitcooker-orange/10 to-fitcooker-yellow/10 rounded-full flex items-center justify-center mb-4 group-hover:from-fitcooker-orange/20 group-hover:to-fitcooker-yellow/20 transition-all duration-300">
                      {step.icon}
                    </div>
                    
                    <h3 className="font-bold text-lg mb-3 text-fitcooker-black group-hover:text-fitcooker-orange transition-colors duration-300">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    
                    <div className="mt-4 flex items-center text-fitcooker-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium mr-2">Saiba mais</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Final CTA Section - Updated with gradient background */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white via-fitcooker-orange/30 to-fitcooker-yellow/30">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-fitcooker-black">
                Comece agora a transformar sua alimentação de forma prática, gostosa e inteligente
              </h2>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Link
                  to="/signup"
                  className="btn bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-lg hover:shadow-xl border-2 border-fitcooker-orange min-w-48"
                >
                  Criar minha conta grátis
                </Link>
              </div>
              
              <Link
                to="/recipes"
                className="text-fitcooker-orange hover:text-fitcooker-black underline underline-offset-4 font-medium"
              >
                Ou continue explorando receitas sem se cadastrar
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
