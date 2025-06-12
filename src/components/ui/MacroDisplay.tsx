import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Zap, Beef, Wheat, Droplets, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface MacroDisplayProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  compact?: boolean;
  className?: string;
}

const MacroDisplay: React.FC<MacroDisplayProps> = ({ 
  calories, 
  protein, 
  carbs, 
  fat, 
  compact = false,
  className = "" 
}) => {
  const [showTable, setShowTable] = useState(false);

  // Calculate percentages for visual display
  const totalMacros = protein + carbs + fat;
  const proteinPercent = totalMacros > 0 ? (protein / totalMacros) * 100 : 0;
  const carbsPercent = totalMacros > 0 ? (carbs / totalMacros) * 100 : 0;
  const fatPercent = totalMacros > 0 ? (fat / totalMacros) * 100 : 0;

  // Calculate calories from macros (more accurate)
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatCalories = fat * 9;
  const totalCalculatedCalories = proteinCalories + carbsCalories + fatCalories;

  // Use provided calories or calculated if provided is 0
  const displayCalories = calories > 0 ? calories : totalCalculatedCalories;

  const macroData = [
    {
      name: 'Proteínas',
      value: protein,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      progressColor: 'bg-blue-500',
      icon: Beef,
      percent: proteinPercent,
      calories: proteinCalories
    },
    {
      name: 'Carboidratos',
      value: carbs,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      progressColor: 'bg-green-500',
      icon: Wheat,
      percent: carbsPercent,
      calories: carbsCalories
    },
    {
      name: 'Gorduras',
      value: fat,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      progressColor: 'bg-yellow-500',
      icon: Droplets,
      percent: fatPercent,
      calories: fatCalories
    }
  ];

  if (compact) {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Compact Calories Display */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-full mb-2">
            <div className="text-center text-white">
              <Zap className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-medium">Cal</div>
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900">{Math.round(displayCalories)}</div>
        </div>

        {/* Compact Macro Breakdown */}
        <div className="flex justify-between text-xs">
          {macroData.map((macro) => (
            <div key={macro.name} className="text-center">
              <div className={`w-8 h-8 rounded-lg ${macro.bgColor} flex items-center justify-center mb-1`}>
                <macro.icon className={`w-4 h-4 ${macro.color}`} />
              </div>
              <div className="font-bold text-gray-700">{macro.value}g</div>
              <div className="text-gray-500">{macro.name.charAt(0)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Calories Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-full mb-4">
          <div className="text-center text-white">
            <Zap className="w-8 h-8 mx-auto mb-1" />
            <div className="text-xs font-medium">Calorias</div>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900">{Math.round(displayCalories)}</div>
        <div className="text-sm text-gray-500">kcal por porção</div>
      </motion.div>

      {/* Macro Breakdown */}
      <div className="space-y-4">
        {macroData.map((macro, index) => {
          const Icon = macro.icon;
          return (
            <motion.div
              key={macro.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${macro.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${macro.color}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{macro.name}</span>
                  <span className="text-sm font-bold text-gray-700">{macro.value}g</span>
                </div>
                <div className="relative">
                  <Progress 
                    value={macro.percent} 
                    className="h-2 bg-gray-200"
                  />
                  <div 
                    className={`absolute top-0 left-0 h-2 rounded-full ${macro.progressColor} transition-all duration-500`}
                    style={{ width: `${macro.percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{macro.percent.toFixed(1)}%</span>
                  <span>{macro.calories} kcal</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Visual Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative"
      >
        <div className="text-center mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Distribuição dos Macronutrientes</h4>
          <div className="flex rounded-full overflow-hidden h-4 bg-gray-200">
            <div 
              className="bg-blue-500 transition-all duration-1000" 
              style={{ width: `${proteinPercent}%` }}
            />
            <div 
              className="bg-green-500 transition-all duration-1000" 
              style={{ width: `${carbsPercent}%` }}
            />
            <div 
              className="bg-yellow-500 transition-all duration-1000" 
              style={{ width: `${fatPercent}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Detailed Table Toggle */}
      <div className="text-center">
        <Button
          onClick={() => setShowTable(!showTable)}
          variant="outline"
          size="sm"
          className="text-fitcooker-orange border-fitcooker-orange hover:bg-fitcooker-orange hover:text-white"
        >
          <Eye className="w-4 h-4 mr-2" />
          {showTable ? 'Ocultar' : 'Ver'} Tabela Detalhada
        </Button>
      </div>

      {/* Detailed Table */}
      {showTable && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-fitcooker-orange" />
                Informações Nutricionais Detalhadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
                  <div>Nutriente</div>
                  <div className="text-center">Quantidade</div>
                  <div className="text-center">Calorias</div>
                  <div className="text-center">% Total</div>
                </div>
                
                {macroData.map((macro) => (
                  <div key={macro.name} className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-2">
                      <macro.icon className={`w-4 h-4 ${macro.color}`} />
                      <span className="font-medium">{macro.name}</span>
                    </div>
                    <div className="text-center font-bold">{macro.value}g</div>
                    <div className="text-center">{macro.calories} kcal</div>
                    <div className="text-center">{macro.percent.toFixed(1)}%</div>
                  </div>
                ))}
                
                <div className="grid grid-cols-4 gap-4 text-sm font-bold text-gray-900 border-t pt-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-fitcooker-orange" />
                    <span>Total</span>
                  </div>
                  <div className="text-center">{totalMacros.toFixed(1)}g</div>
                  <div className="text-center">{Math.round(displayCalories)} kcal</div>
                  <div className="text-center">100%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default MacroDisplay;
