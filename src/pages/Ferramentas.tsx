
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Activity, Target, Scale, Lightbulb } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import IMCCalculator from '@/components/ferramentas/IMCCalculator';
import MacroCalculator from '@/components/ferramentas/MacroCalculator';
import NutrientCalculator from '@/components/ferramentas/NutrientCalculator';
import UnitConverter from '@/components/ferramentas/UnitConverter';

const Ferramentas: React.FC = () => {
  const [activeTab, setActiveTab] = useState('imc');
  const [activeTip, setActiveTip] = useState('imc');

  const tools = [
    {
      id: 'imc',
      name: 'IMC',
      icon: Scale,
      description: 'Calcule seu Índice de Massa Corporal',
      component: IMCCalculator,
      tip: {
        title: 'Calculadora de IMC',
        content: 'O Índice de Massa Corporal (IMC) é uma medida que relaciona peso e altura para avaliar se uma pessoa está dentro do peso ideal. Insira seu peso em kg e altura em metros para obter uma classificação automática.'
      }
    },
    {
      id: 'macros',
      name: 'Macronutrientes',
      icon: Target,
      description: 'Calcule suas necessidades diárias',
      component: MacroCalculator,
      tip: {
        title: 'Calculadora de Macronutrientes',
        content: 'Esta ferramenta calcula suas necessidades diárias de proteínas, carboidratos e gorduras com base em seu perfil físico e objetivos. Os resultados incluem gráficos visuais e tabelas nutricionais detalhadas.'
      }
    },
    {
      id: 'nutrientes',
      name: 'Nutrientes',
      icon: Activity,
      description: 'Analise valores nutricionais',
      component: NutrientCalculator,
      tip: {
        title: 'Calculadora de Nutrientes',
        content: 'Analise e compare valores nutricionais de diferentes alimentos. Útil para planejamento de refeições e controle da ingestão de vitaminas e minerais essenciais.'
      }
    },
    {
      id: 'conversao',
      name: 'Conversão',
      icon: Calculator,
      description: 'Converta unidades culinárias',
      component: UnitConverter,
      tip: {
        title: 'Conversor de Unidades',
        content: 'Converta facilmente entre diferentes unidades de medida usadas na culinária: gramas, quilos, mililitros, litros, xícaras, colheres e muito mais. Essencial para seguir receitas de diferentes países.'
      }
    }
  ];

  const currentTip = tools.find(tool => tool.id === activeTip)?.tip;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-2">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 text-white py-16 mb-8"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Ferramentas Culinárias
              </h1>
              <p className="text-orange-100 text-lg max-w-2xl mx-auto">
                Calculadoras e conversores essenciais para sua jornada culinária saudável
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6">
          {/* Tools Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (index * 0.1) }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      activeTab === tool.id 
                        ? 'ring-2 ring-fitcooker-orange bg-gradient-to-br from-fitcooker-orange/5 to-orange-100/30' 
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => {
                      setActiveTab(tool.id);
                      setActiveTip(tool.id);
                    }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        activeTab === tool.id 
                          ? 'bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-fitcooker-orange group-hover:text-white'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className={`font-bold mb-1 transition-colors duration-300 ${
                        activeTab === tool.id ? 'text-fitcooker-orange' : 'text-gray-900'
                      }`}>
                        {tool.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {tool.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Usage Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-blue-900">{currentTip?.title}</CardTitle>
                    <CardDescription className="text-blue-700">Como usar esta ferramenta</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 leading-relaxed">
                  {currentTip?.content}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Tool Component */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {tools.map((tool) => {
              if (tool.id === activeTab) {
                const Component = tool.component;
                return <Component key={tool.id} />;
              }
              return null;
            })}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Ferramentas;
