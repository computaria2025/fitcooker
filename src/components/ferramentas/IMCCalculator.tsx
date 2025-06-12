
import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface IMCData {
  peso: string;
  altura: string;
}

interface IMCResult {
  imc: string;
  classificacao: string;
}

const IMCCalculator: React.FC = () => {
  const [imcData, setImcData] = useState<IMCData>({
    peso: '',
    altura: ''
  });
  const [imcResult, setImcResult] = useState<IMCResult | null>(null);

  const calcularIMC = () => {
    const { peso, altura } = imcData;
    
    if (!peso || !altura) return;

    const imc = parseFloat(peso) / Math.pow(parseFloat(altura), 2);
    
    let classificacao = '';
    if (imc < 18.5) classificacao = 'Abaixo do peso';
    else if (imc < 25) classificacao = 'Peso normal';
    else if (imc < 30) classificacao = 'Sobrepeso';
    else classificacao = 'Obesidade';

    setImcResult({
      imc: imc.toFixed(1),
      classificacao
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-fitcooker-orange" />
            <CardTitle>Calculadora de IMC</CardTitle>
          </div>
          <CardDescription>
            Calcule seu Índice de Massa Corporal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="peso-imc">Peso (kg)</Label>
            <Input
              id="peso-imc"
              type="number"
              value={imcData.peso}
              onChange={(e) => setImcData(prev => ({ ...prev, peso: e.target.value }))}
              placeholder="70"
            />
          </div>
          
          <div>
            <Label htmlFor="altura-imc">Altura (m)</Label>
            <Input
              id="altura-imc"
              type="number"
              step="0.01"
              value={imcData.altura}
              onChange={(e) => setImcData(prev => ({ ...prev, altura: e.target.value }))}
              placeholder="1.75"
            />
          </div>

          <Button onClick={calcularIMC} className="w-full bg-fitcooker-orange hover:bg-fitcooker-orange/90">
            Calcular IMC
          </Button>
        </CardContent>
      </Card>

      {imcResult && (
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Seu IMC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="p-6 bg-fitcooker-orange/10 rounded-lg">
                <div className="text-3xl font-bold text-fitcooker-orange">
                  {imcResult.imc}
                </div>
                <div className="text-lg font-medium text-gray-700 mt-2">
                  {imcResult.classificacao}
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div>Abaixo de 18,5: Abaixo do peso</div>
                <div>18,5 - 24,9: Peso normal</div>
                <div>25,0 - 29,9: Sobrepeso</div>
                <div>Acima de 30,0: Obesidade</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IMCCalculator;
