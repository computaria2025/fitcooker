
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NutritionDisplayProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  className?: string;
}

const NutritionDisplay: React.FC<NutritionDisplayProps> = ({
  calories,
  protein,
  carbs,
  fat,
  className = ""
}) => {
  const nutrients = [
    {
      name: 'Calorias',
      value: calories,
      unit: 'kcal',
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      textColor: 'text-red-600'
    },
    {
      name: 'Proteínas',
      value: protein,
      unit: 'g',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      textColor: 'text-blue-600'
    },
    {
      name: 'Carboidratos',
      value: carbs,
      unit: 'g',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      textColor: 'text-green-600'
    },
    {
      name: 'Gorduras',
      value: fat,
      unit: 'g',
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <Card className={`shadow-lg border-0 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-fitcooker-orange/10 to-orange-100">
        <CardTitle className="text-center">Informações Nutricionais</CardTitle>
        <p className="text-sm text-gray-600 text-center">Por porção</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {nutrients.map((nutrient, index) => (
            <div key={index} className="text-center">
              <div className={`${nutrient.color} rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold text-lg">{nutrient.value}</span>
              </div>
              <h4 className={`font-semibold ${nutrient.textColor} mb-1`}>{nutrient.name}</h4>
              <Badge variant="outline" className="text-xs">
                {nutrient.value}{nutrient.unit}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionDisplay;
