
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Code, PenTool, Database, FileSearch, Figma, ChefHat, Heart, Plus, Minus, Send, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Team member data
const teamMembers = [
  {
    name: 'Erick',
    role: 'Engenheiro de Dados',
    description: 'Cuida da gerência da infraestrutura, conexões e cuidados com banco de dados.',
    avatar: 'erick.png',
    icon: <Database className="h-10 w-10" />
  },
  {
    name: 'Andrei Barone',
    role: 'Designer e Desenvolvedor',
    description: 'Combina habilidades de design, lógica e desenvolvimento para criar aplicações.',
    avatar: 'andrei.png',
    icon: <PenTool className="h-10 w-10" />
  },
  {
    name: 'Ígor',
    role: 'Desenvolvedor Fullstack',
    description: 'Responsável pelo desenvolvimento da aplicação, interface frontend e backend.',
    avatar: 'igor.png',
    icon: <Code className="h-10 w-10" />
  },
  {
    name: 'Gabriel',
    role: 'Analista de Requisitos',
    description: 'Identifica e documenta as necessidades dos usuários para guiar o desenvolvimento. Além de cuidar de toda documentação do projeto.',
    avatar: 'gabriel.png',
    icon: <FileSearch className="h-10 w-10" />
  },
  {
    name: 'Isaac Machado',
    role: 'Designer Figma e UI/UX',
    description: 'Cria protótipos e designs que priorizam a experiência do usuário.',
    avatar: 'isaac.png',
    icon: <Figma className="h-10 w-10" />
  }
];

// FAQ data
const faqItems = [
  {
    question: "O que é o FitCooker?",
    answer: "FitCooker é uma plataforma digital que permite criar, descobrir e compartilhar receitas saudáveis com cálculo automático de macronutrientes. Nosso objetivo é tornar a alimentação saudável mais acessível, prática e social."
  },
  {
    question: "Preciso pagar para utilizar o FitCooker?",
    answer: "Não! O FitCooker é uma plataforma totalmente gratuita. Você pode explorar receitas sem nem mesmo criar uma conta. Para criar suas próprias receitas e interagir com outros usuários, basta se cadastrar gratuitamente."
  },
  {
    question: "Como os macronutrientes são calculados?",
    answer: "Utilizamos um banco de dados nutricional extenso que contém informações detalhadas sobre os ingredientes. Quando você adiciona ingredientes à sua receita, nosso algoritmo calcula automaticamente os valores nutricionais com base nas quantidades informadas."
  },
  {
    question: "Posso usar o FitCooker no celular?",
    answer: "Sim! O FitCooker é totalmente responsivo e foi desenvolvido com uma abordagem mobile-first. Você pode acessar todas as funcionalidades pelo navegador do seu smartphone ou tablet."
  },
  {
    question: "Como posso contribuir com a plataforma?",
    answer: "Você pode contribuir adicionando suas próprias receitas, avaliando e comentando nas receitas de outros usuários, e compartilhando o FitCooker com seus amigos. Seu feedback também é valioso para continuarmos melhorando a plataforma."
  }
];

const About: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // Add scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;
        
        if (isVisible) {
          el.classList.add('active');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setContactForm({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section - Updated with modern design */}
        <section className="relative bg-gradient-to-r from-fitcooker-orange/10 to-fitcooker-yellow/10 py-24 overflow-hidden">
          <div className="absolute inset-0 bg-pattern-chef opacity-5"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 border-2 border-fitcooker-orange rounded-full">
                  <span className="text-sm font-medium text-fitcooker-orange">CONHEÇA NOSSA HISTÓRIA</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-sm">
                  Sobre o <span className="text-fitcooker-orange">FitCooker</span>
                </h1>
                
                <p className="text-gray-800 text-lg md:text-xl mb-8">
                  Criando soluções incríveis para uma alimentação saudável e acessível para todos.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <Link to="/recipes">
                    <Button variant="default" size="lg" className="bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white">
                      Explorar Receitas
                    </Button>
                  </Link>
                  <a href="#team">
                    <Button variant="outline" size="lg" className="border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange/10">
                      Conhecer Equipe
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </section>
        
        {/* Mission Section - Modernized design */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="animate-on-scroll"
                >
                  <div className="inline-flex items-center text-fitcooker-orange mb-2">
                    <div className="h-px w-12 bg-fitcooker-orange mr-4"></div>
                    <span className="font-medium uppercase">Nossa Missão</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                    Por que criamos o FitCooker?
                  </h2>
                  
                  <p className="text-lg text-gray-700 mb-8">
                    Fazendo comida saudável tornar-se acessível para todos, independentemente do nível de 
                    experiência na cozinha ou conhecimento nutricional. Acreditamos que alimentação saudável 
                    não precisa ser complicada ou sem sabor.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="mt-1 bg-fitcooker-orange/10 p-3 rounded-full text-fitcooker-orange mr-4">
                        <ChefHat size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1 text-xl">A melhor plataforma de receitas do Brasil</h3>
                        <p className="text-gray-600">
                          Oferecemos receitas saudáveis, deliciosas e adaptadas a diferentes objetivos fitness,
                          com informações nutricionais precisas e confiáveis.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mt-1 bg-fitcooker-orange/10 p-3 rounded-full text-fitcooker-orange mr-4">
                        <Heart size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1 text-xl">Alimentação saudável para todos</h3>
                        <p className="text-gray-600">
                          Democratizamos o acesso à alimentação saudável com receitas simples e acessíveis,
                          perfeitas para iniciantes ou chefs experientes.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mt-1 bg-fitcooker-orange/10 p-3 rounded-full text-fitcooker-orange mr-4">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1 text-xl">Tecnologia a serviço da saúde</h3>
                        <p className="text-gray-600">
                          Combinamos conhecimento nutricional com inovação tecnológica para criar uma experiência
                          intuitiva e educativa sobre alimentação.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative animate-on-scroll"
                >
                  <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="https://images.pexels.com/photos/2130134/pexels-photo-2130134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Equipe FitCooker" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <p className="text-white text-xl font-medium">
                        "Criando soluções incríveis para uma vida mais saudável"
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 h-64 w-64 bg-fitcooker-orange/10 rounded-full -z-10"></div>
                  <div className="absolute -top-8 -left-8 h-40 w-40 bg-fitcooker-yellow/10 rounded-full -z-10"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section id="team" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 animate-on-scroll">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center text-fitcooker-orange mb-2">
                  <div className="h-px w-12 bg-fitcooker-orange mr-4"></div>
                  <span className="font-medium uppercase">Nossa Equipe</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Conheça quem faz acontecer
                </h2>
                
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Conheça os profissionais dedicados que transformam a visão do FitCooker em realidade.
                </p>
              </motion.div>
            </div>
            
            {/* Code-inspired background design */}
            <div className="relative mb-16">
              <div className="absolute inset-0 opacity-5 overflow-hidden">
                <pre className="text-xs text-left">
                  {`
function FitCooker() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Load our amazing recipes
    fetchRecipes().then(data => {
      setRecipes(data);
      setLoading(false);
    });
  }, []);
  
  return (
    <div className="app">
      <Header />
      <main>
        <Team members={teamMembers} />
        <RecipesList recipes={recipes} />
      </main>
      <Footer />
    </div>
  );
}

// A melhor plataforma de receitas do Brasil
export default FitCooker;
                  `}
                </pre>
              </div>
            </div>
            
            {/* Team members */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={index} 
                  className="animate-on-scroll" 
                  style={{ animationDelay: `${index * 100}ms` }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <div className="bg-fitcooker-black text-white rounded-xl shadow-md p-6 h-full transition-all duration-300 hover:shadow-lg border border-gray-700">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-fitcooker-orange">
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-fitcooker-orange text-sm font-medium mb-4">{member.role}</p>
                      <p className="text-gray-400 text-sm mb-6">{member.description}</p>
                      
                      <div className="p-2 bg-gray-800 text-fitcooker-orange rounded-full mt-auto">
                        {member.icon}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center text-fitcooker-orange mb-2">
                  <div className="h-px w-12 bg-fitcooker-orange mr-4"></div>
                  <span className="font-medium uppercase">Perguntas Frequentes</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Dúvidas sobre o FitCooker?
                </h2>
                
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Encontre respostas para as perguntas mais comuns sobre nossa plataforma.
                </p>
              </motion.div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {faqItems.map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="mb-4"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className={`w-full flex items-center justify-between p-5 text-left rounded-lg ${
                      openFaqIndex === index ? 'bg-fitcooker-orange text-white' : 'bg-gray-50 hover:bg-gray-100'
                    } transition-all duration-200`}
                  >
                    <span className="font-medium text-lg">{faq.question}</span>
                    {openFaqIndex === index ? (
                      <Minus className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <Plus className="h-5 w-5 flex-shrink-0" />
                    )}
                  </button>
                  
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-5 border border-t-0 rounded-b-lg bg-white">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Contact Form */}
            <div className="mt-16 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gray-50 rounded-lg p-6 md:p-8 shadow-sm"
              >
                <h3 className="text-2xl font-bold mb-2">Tem outras dúvidas?</h3>
                <p className="text-gray-600 mb-6">
                  Envie sua mensagem e entraremos em contato o mais breve possível.
                </p>
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        placeholder="Seu nome"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        placeholder="seu@email.com"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      placeholder="Em que podemos ajudar?"
                      required
                      className="w-full min-h-[120px]"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                  >
                    <Send className="mr-2 h-4 w-4" /> Enviar mensagem
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
