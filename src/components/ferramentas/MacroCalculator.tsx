
import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MacroData {
  idade: string;
  peso: string;
  altura: string;
  atividade: string;
  objetivo: string;
}

interface MacroResult {
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

const MacroCalculator: React.FC = () => {
  const [macrosData, setMacrosData] = useState<MacroData>({
    idade: '',
    peso: '',
    altura: '',
    atividade: '',
    objetivo: ''
  });
  const [macrosResult, setMacrosResult] = useState<MacroResult | null>(null);

  const calcularMacros = () => {
    const { idade, peso, altura, atividade, objetivo } = macrosData;
    
    if (!idade || !peso || !altura || !atividade || !objetivo) return;

    // Cálculo TMB (Taxa Metabólica Basal) - Fórmula de Harris-Benedict
    let tmb = 10 * parseFloat(peso) + 6.25 * parseFloat(altura) - 5 * parseFloat(idade) + 5;
    
    // Multiplicadores por nível de atividade
    const multiplicadores = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'intenso': 1.725,
      'muito-intenso': 1.9
    };

    let calorias = tmb * multiplicadores[atividade as keyof typeof multiplicadores];

    // Ajuste por objetivo
    if (objetivo === 'perder') calorias *= 0.8;
    else if (objetivo === 'ganhar') calorias *= 1.2;

    // Distribuição de macros
    const proteinas = parseFloat(peso) * 2; // 2g por kg
    const gorduras = calorias * 0.25 / 9; // 25% das calorias
    const carboidratos = (calorias - (proteinas * 4) - (gorduras * 9)) / 4;

    setMacrosResult({
      calorias: Math.round(calorias),
      proteinas: Math.round(proteinas),
      carboidratos: Math.round(carboidratos),
      gorduras: Math.round(gorduras)
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-fitcooker-orange" />
            <CardTitle>Calculadora de Macronutrientes</CardTitle>
          </div>
          <CardDescription>
            Calcule suas necessidades diárias de calorias e macros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                type="number"
                value={macrosData.idade}
                onChange={(e) => setMacrosData(prev => ({ ...prev, idade: e.target.value }))}
                placeholder="25"
              />
            </div>
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                value={macrosData.peso}
                onChange={(e) => setMacrosData(prev => ({ ...prev, peso: e.target.value }))}
                placeholder="70"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="altura">Altura (cm)</Label>
            <Input
              id="altura"
              type="number"
              value={macrosData.altura}
              onChange={(e) => setMacrosData(prev => ({ ...prev, altura: e.target.value }))}
              placeholder="175"
            />
          </div>

          <div>
            <Label>Nível de Atividade</Label>
            <Select value={macrosData.atividade} onValueChange={(value) => setMacrosData(prev => ({ ...prev, atividade: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentario">Sedentário</SelectItem>
                <SelectItem value="leve">Atividade Leve</SelectItem>
                <SelectItem value="moderado">Atividade Moderada</SelectItem>
                <SelectItem value="intenso">Atividade Intensa</SelectItem>
                <SelectItem value="muito-intenso">Muito Intenso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Objetivo</Label>
            <Select value={macrosData.objetivo} onValueChange={(value) => setMacrosData(prev => ({ ...prev, objetivo: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perder">Perder Peso</SelectItem>
                <SelectItem value="manter">Manter Peso</SelectItem>
                <SelectItem value="ganhar">Ganhar Peso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={calcularMacros} className="w-full bg-fitcooker-orange hover:bg-fitcooker-orange/90">
            Calcular Macros
          </Button>
        </CardContent>
      </Card>

      {macrosResult && (
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Seus Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-fitcooker-orange/10 rounded-lg">
                <div className="text-2xl font-bold text-fitcooker-orange">
                  {macrosResult.calorias} kcal
                </div>
                <div className="text-sm text-gray-600">Calorias por dia</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-bold text-blue-600">{macrosResult.proteinas}g</div>
                  <div className="text-sm text-gray-600">Proteínas</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-bold text-green-600">{macrosResult.carboidratos}g</div>
                  <div className="text-sm text-gray-600">Carboidratos</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="font-bold text-yellow-600">{macrosResult.gorduras}g</div>
                  <div className="text-sm text-gray-600">Gorduras</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MacroCalculator;
