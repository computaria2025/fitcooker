
import React, { useState, useEffect } from 'react';
import { Search, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface Ingrediente {
  id: number;
  nome: string;
  calorias: number;
  proteina: number;
  carboidratos: number;
  gorduras: number;
  unidade_padrao: string;
}

interface NutrientResult {
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

const NutrientCalculator: React.FC = () => {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngrediente, setSelectedIngrediente] = useState<Ingrediente | null>(null);
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('g');
  const [result, setResult] = useState<NutrientResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar ingredientes conforme o usuário digita
  useEffect(() => {
    const searchIngredientes = async () => {
      if (searchTerm.length < 2) {
        setIngredientes([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('ingredientes')
          .select('*')
          .ilike('nome', `%${searchTerm}%`)
          .limit(10);

        if (error) throw error;
        setIngredientes(data || []);
      } catch (error) {
        console.error('Erro ao buscar ingredientes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchIngredientes, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const calcularNutrientes = () => {
    if (!selectedIngrediente || !quantidade) return;

    const qtd = parseFloat(quantidade);
    
    // Conversão para grama (base de cálculo)
    const conversoes = {
      'g': 1,
      'kg': 1000,
      'mg': 0.001,
      'xicara': 120, // aproximadamente
      'colher-sopa': 15,
      'colher-cha': 5
    };

    const qtdEmGramas = qtd * (conversoes[unidade as keyof typeof conversoes] || 1);
    const fatorCalculo = qtdEmGramas / 100; // Valores nutricionais geralmente são por 100g

    const resultado = {
      calorias: Math.round(selectedIngrediente.calorias * fatorCalculo),
      proteinas: Math.round(selectedIngrediente.proteina * fatorCalculo * 10) / 10,
      carboidratos: Math.round(selectedIngrediente.carboidratos * fatorCalculo * 10) / 10,
      gorduras: Math.round(selectedIngrediente.gorduras * fatorCalculo * 10) / 10
    };

    setResult(resultado);
  };

  const chartData = result ? [
    { name: 'Proteínas', value: result.proteinas, color: '#3B82F6' },
    { name: 'Carboidratos', value: result.carboidratos, color: '#10B981' },
    { name: 'Gorduras', value: result.gorduras, color: '#F59E0B' }
  ] : [];

  const chartConfig = {
    proteinas: { label: 'Proteínas', color: '#3B82F6' },
    carboidratos: { label: 'Carboidratos', color: '#10B981' },
    gorduras: { label: 'Gorduras', color: '#F59E0B' }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-fitcooker-orange" />
            <CardTitle>Calculadora de Nutrientes</CardTitle>
          </div>
          <CardDescription>
            Busque um alimento e calcule seus valores nutricionais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="busca-alimento">Buscar Alimento</Label>
            <div className="relative">
              <Input
                id="busca-alimento"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome do alimento..."
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            {/* Lista de ingredientes encontrados */}
            {ingredientes.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto border rounded-md">
                {ingredientes.map((ingrediente) => (
                  <div
                    key={ingrediente.id}
                    className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      setSelectedIngrediente(ingrediente);
                      setSearchTerm(ingrediente.nome);
                      setIngredientes([]);
                    }}
                  >
                    <div className="font-medium">{ingrediente.nome}</div>
                    <div className="text-sm text-gray-500">
                      {ingrediente.calorias} kcal por 100{ingrediente.unidade_padrao}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isLoading && (
              <div className="text-sm text-gray-500 mt-2">Buscando...</div>
            )}
          </div>

          {selectedIngrediente && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label>Unidade</Label>
                  <Select value={unidade} onValueChange={setUnidade}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">Gramas (g)</SelectItem>
                      <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                      <SelectItem value="mg">Miligramas (mg)</SelectItem>
                      <SelectItem value="xicara">Xícara</SelectItem>
                      <SelectItem value="colher-sopa">Colher de sopa</SelectItem>
                      <SelectItem value="colher-cha">Colher de chá</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={calcularNutrientes} 
                className="w-full bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                disabled={!quantidade}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calcular Nutrientes
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Valores Nutricionais</CardTitle>
              <CardDescription>
                Para {quantidade} {unidade} de {selectedIngrediente?.nome}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-fitcooker-orange mb-2">
                  {result.calorias}
                </div>
                <div className="text-gray-600">Calorias totais</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-bold text-blue-600">{result.proteinas}g</div>
                  <div className="text-sm text-gray-600">Proteínas</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-bold text-green-600">{result.carboidratos}g</div>
                  <div className="text-sm text-gray-600">Carboidratos</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="font-bold text-yellow-600">{result.gorduras}g</div>
                  <div className="text-sm text-gray-600">Gorduras</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {chartData.some(item => item.value > 0) && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Distribuição de Macronutrientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default NutrientCalculator;
