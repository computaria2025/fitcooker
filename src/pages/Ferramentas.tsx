
import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Scale, Utensils, Zap } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionTitle from '@/components/ui/SectionTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import IMCCalculator from '@/components/ferramentas/IMCCalculator';
import MacroCalculator from '@/components/ferramentas/MacroCalculator';
import UnitConverter from '@/components/ferramentas/UnitConverter';
import NutrientCalculator from '@/components/ferramentas/NutrientCalculator';

const Ferramentas: React.FC = () => {
  const tools = [
    {
      id: 'imc',
      title: 'Calculadora de IMC',
      description: 'Calcule seu Índice de Massa Corporal e descubra sua faixa de peso ideal',
      icon: Scale,
      component: IMCCalculator,
    },
    {
      id: 'macro',
      title: 'Calculadora de Macronutrientes',
      description: 'Determine suas necessidades diárias de proteínas, carboidratos e gorduras',
      icon: Calculator,
      component: MacroCalculator,
    },
    {
      id: 'converter',
      title: 'Conversor de Unidades',
      description: 'Converta facilmente entre diferentes unidades de medida culinárias',
      icon: Utensils,
      component: UnitConverter,
    },
    {
      id: 'nutrients',
      title: 'Calculadora Nutricional',
      description: 'Analise o valor nutricional dos seus ingredientes e receitas',
      icon: Zap,
      component: NutrientCalculator,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-12 pt-40">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle 
            title="Ferramentas Culinárias"
            subtitle="Recursos úteis para te ajudar na cozinha e no planejamento de uma alimentação saudável"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              const ToolComponent = tool.component;
              
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-fitcooker-orange to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ToolComponent />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Ferramentas;
