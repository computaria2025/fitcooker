
import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface MacroDisplayProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  className?: string;
  compact?: boolean;
}

const MacroDisplay: React.FC<MacroDisplayProps> = ({ 
  calories, 
  protein, 
  carbs, 
  fat, 
  className,
  compact = false
}) => {
  // Calculate total macros for percentages
  const totalMacros = protein + carbs + fat;
  const proteinPercentage = Math.round((protein / totalMacros) * 100);
  const carbsPercentage = Math.round((carbs / totalMacros) * 100);
  const fatPercentage = Math.round((fat / totalMacros) * 100);

  if (compact) {
    return (
      <div className={cn('flex items-center space-x-3 text-sm font-medium', className)}>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-fitcooker-orange mr-1"></span>
          <span>{calories} kcal</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
          <span>{protein}g P</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
          <span>{carbs}g C</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
          <span>{fat}g F</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn('p-4 rounded-xl bg-white shadow-sm', className)}>
      <h3 className="text-lg font-bold mb-3 text-center">Informações Nutricionais</h3>
      
      {/* Calories */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-center w-full">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-8 border-gray-100 flex items-center justify-center mx-auto">
              <div className="text-center">
                <span className="block text-2xl font-bold text-fitcooker-orange">{calories}</span>
                <span className="text-xs text-gray-500">kcal</span>
              </div>
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-28 rounded-full border-8 border-t-fitcooker-orange border-r-transparent border-b-transparent border-l-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Macros Distribution */}
      <div className="mb-6">
        <div className="w-full h-6 flex rounded-full overflow-hidden">
          <div 
            className="bg-red-500 flex items-center justify-center text-xs text-white font-bold" 
            style={{ width: `${proteinPercentage}%` }}
          >
            {proteinPercentage > 15 ? `${proteinPercentage}%` : ''}
          </div>
          <div 
            className="bg-yellow-500 flex items-center justify-center text-xs text-white font-bold" 
            style={{ width: `${carbsPercentage}%` }}
          >
            {carbsPercentage > 15 ? `${carbsPercentage}%` : ''}
          </div>
          <div 
            className="bg-blue-500 flex items-center justify-center text-xs text-white font-bold" 
            style={{ width: `${fatPercentage}%` }}
          >
            {fatPercentage > 15 ? `${fatPercentage}%` : ''}
          </div>
        </div>
      </div>
      
      {/* Detail Macros */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
          <div className="w-full mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Proteínas</span>
              <span className="text-xs text-gray-400">{proteinPercentage}%</span>
            </div>
            <Progress value={proteinPercentage} className="h-1.5 bg-gray-200">
              <div className="h-full bg-red-500 transition-all" style={{ width: `${proteinPercentage}%` }}></div>
            </Progress>
          </div>
          <span className="text-lg font-bold text-red-500">{protein}g</span>
        </div>
        
        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
          <div className="w-full mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Carboidratos</span>
              <span className="text-xs text-gray-400">{carbsPercentage}%</span>
            </div>
            <Progress value={carbsPercentage} className="h-1.5 bg-gray-200">
              <div className="h-full bg-yellow-500 transition-all" style={{ width: `${carbsPercentage}%` }}></div>
            </Progress>
          </div>
          <span className="text-lg font-bold text-yellow-500">{carbs}g</span>
        </div>
        
        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
          <div className="w-full mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Gorduras</span>
              <span className="text-xs text-gray-400">{fatPercentage}%</span>
            </div>
            <Progress value={fatPercentage} className="h-1.5 bg-gray-200">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${fatPercentage}%` }}></div>
            </Progress>
          </div>
          <span className="text-lg font-bold text-blue-500">{fat}g</span>
        </div>
      </div>
    </div>
  );
};

export default MacroDisplay;
