
import React, { useState } from 'react';
import { Ruler } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConversorData {
  valor: string;
  de: string;
  para: string;
}

interface ConversorResult {
  resultado: string;
  unidade: string;
}

const UnitConverter: React.FC = () => {
  const [conversorData, setConversorData] = useState<ConversorData>({
    valor: '',
    de: '',
    para: ''
  });
  const [conversorResult, setConversorResult] = useState<ConversorResult | null>(null);

  const converterMedida = () => {
    const { valor, de, para } = conversorData;
    
    if (!valor || !de || !para) return;

    // Conversões básicas (todas para gramas como base)
    const conversoes = {
      'xicara-farinha': 120,
      'xicara-acucar': 200,
      'colher-sopa': 15,
      'colher-cha': 5,
      'ml': 1,
      'litro': 1000,
      'kg': 1000,
      'g': 1
    };

    const valorNumerico = parseFloat(valor);
    const resultado = valorNumerico * conversoes[de as keyof typeof conversoes] / conversoes[para as keyof typeof conversoes];

    const unidadeLabels = {
      'xicara-farinha': 'xícaras (farinha)',
      'xicara-acucar': 'xícaras (açúcar)',
      'colher-sopa': 'colheres de sopa',
      'colher-cha': 'colheres de chá',
      'ml': 'ml',
      'litro': 'litros',
      'g': 'gramas',
      'kg': 'quilogramas'
    };

    setConversorResult({
      resultado: resultado.toFixed(2),
      unidade: unidadeLabels[para as keyof typeof unidadeLabels]
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Ruler className="h-5 w-5 text-fitcooker-orange" />
            <CardTitle>Conversor de Medidas</CardTitle>
          </div>
          <CardDescription>
            Converta entre diferentes unidades culinárias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              type="number"
              value={conversorData.valor}
              onChange={(e) => setConversorData(prev => ({ ...prev, valor: e.target.value }))}
              placeholder="1"
            />
          </div>
          
          <div>
            <Label>De</Label>
            <Select value={conversorData.de} onValueChange={(value) => setConversorData(prev => ({ ...prev, de: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xicara-farinha">Xícara (farinha)</SelectItem>
                <SelectItem value="xicara-acucar">Xícara (açúcar)</SelectItem>
                <SelectItem value="colher-sopa">Colher de sopa</SelectItem>
                <SelectItem value="colher-cha">Colher de chá</SelectItem>
                <SelectItem value="ml">Mililitros</SelectItem>
                <SelectItem value="litro">Litros</SelectItem>
                <SelectItem value="g">Gramas</SelectItem>
                <SelectItem value="kg">Quilogramas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Para</Label>
            <Select value={conversorData.para} onValueChange={(value) => setConversorData(prev => ({ ...prev, para: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xicara-farinha">Xícara (farinha)</SelectItem>
                <SelectItem value="xicara-acucar">Xícara (açúcar)</SelectItem>
                <SelectItem value="colher-sopa">Colher de sopa</SelectItem>
                <SelectItem value="colher-cha">Colher de chá</SelectItem>
                <SelectItem value="ml">Mililitros</SelectItem>
                <SelectItem value="litro">Litros</SelectItem>
                <SelectItem value="g">Gramas</SelectItem>
                <SelectItem value="kg">Quilogramas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={converterMedida} className="w-full bg-fitcooker-orange hover:bg-fitcooker-orange/90">
            Converter
          </Button>
        </CardContent>
      </Card>

      {conversorResult && (
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Resultado da Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 bg-fitcooker-orange/10 rounded-lg">
              <div className="text-3xl font-bold text-fitcooker-orange">
                {conversorResult.resultado}
              </div>
              <div className="text-lg text-gray-600 mt-2">
                {conversorResult.unidade}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnitConverter;
