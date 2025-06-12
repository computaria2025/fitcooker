
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Users, Star, Search, MapPin, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionTitle from '@/components/ui/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Chef {
  id: string;
  nome: string;
  bio: string | null;
  avatar_url: string | null;
  is_chef: boolean;
  receitas_count: number;
  seguidores_count: number;
  nota_media: number | null;
  preferencias: string[] | null;
}

const Cooks: React.FC = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [filteredChefs, setFilteredChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChefs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = chefs.filter(chef =>
        chef.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chef.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chef.preferencias?.some(pref => 
          pref.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredChefs(filtered);
    } else {
      setFilteredChefs(chefs);
    }
  }, [searchTerm, chefs]);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      console.log('Fetching chefs...');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_chef', true)
        .order('receitas_count', { ascending: false });

      if (error) {
        console.error('Error fetching chefs:', error);
        return;
      }

      console.log('Chefs data:', data);

      // Calculate average rating for each chef
      const chefsWithRatings = await Promise.all(
        (data || []).map(async (chef) => {
          const { data: recipes } = await supabase
            .from('receitas')
            .select('nota_media')
            .eq('usuario_id', chef.id)
            .not('nota_media', 'is', null);

          let averageRating = null;
          if (recipes && recipes.length > 0) {
            const validRatings = recipes.filter(r => r.nota_media > 0);
            if (validRatings.length > 0) {
              averageRating = validRatings.reduce((sum, recipe) => sum + recipe.nota_media, 0) / validRatings.length;
            }
          }

          return {
            ...chef,
            nota_media: averageRating ? Number(averageRating.toFixed(1)) : null
          };
        })
      );

      setChefs(chefsWithRatings);
      setFilteredChefs(chefsWithRatings);
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitcooker-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando chefs...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle 
            title="Nossos Chefs Talentosos"
            subtitle="Descubra os melhores chefs e suas receitas incríveis. Conecte-se, aprenda e se inspire com nossa comunidade culinária."
          />

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar chefs por nome, bio ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-fitcooker-orange rounded-xl"
              />
            </div>
          </motion.div>

          {/* Chefs Grid */}
          {filteredChefs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-3">
                {searchTerm ? 'Nenhum chef encontrado' : 'Nenhum chef cadastrado ainda'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm 
                  ? 'Tente buscar com outros termos ou limpe o filtro para ver todos os chefs.' 
                  : 'Seja o primeiro chef a se cadastrar e começar a compartilhar suas receitas!'
                }
              </p>
              {searchTerm && (
                <Button 
                  onClick={() => setSearchTerm('')}
                  className="mt-6 bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                >
                  Ver Todos os Chefs
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredChefs.map((chef, index) => (
                <motion.div
                  key={chef.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => window.location.href = `/cook/${chef.id}`}
                >
                  <Card className="h-full overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:bg-white/90">
                    <CardContent className="p-0">
                      {/* Header with gradient background */}
                      <div className="relative h-32 bg-gradient-to-br from-fitcooker-orange/80 via-orange-500/80 to-orange-600/80 overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                        
                        {/* Chef verification badge */}
                        {chef.is_chef && (
                          <div className="absolute top-4 right-4">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                            >
                              <Award className="w-4 h-4 text-white" />
                            </motion.div>
                          </div>
                        )}
                      </div>

                      <div className="p-6 relative">
                        {/* Avatar */}
                        <div className="flex justify-center -mt-16 mb-4">
                          <Avatar className="w-20 h-20 border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <AvatarImage src={chef.avatar_url || ''} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-fitcooker-orange to-orange-500 text-white text-xl">
                              <ChefHat className="w-10 h-10" />
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Chef Info */}
                        <div className="text-center space-y-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitcooker-orange transition-colors duration-300">
                              {chef.nome}
                            </h3>
                            {chef.bio && (
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {chef.bio}
                              </p>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div className="text-center">
                              <div className="text-lg font-bold text-fitcooker-orange">{chef.receitas_count}</div>
                              <div className="text-xs text-gray-500">Receitas</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-fitcooker-orange">{chef.seguidores_count}</div>
                              <div className="text-xs text-gray-500">Seguidores</div>
                            </div>
                          </div>

                          {/* Rating */}
                          {chef.nota_media && (
                            <div className="flex items-center justify-center space-x-1 pt-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium text-gray-700">{chef.nota_media}</span>
                            </div>
                          )}

                          {/* Preferences */}
                          {chef.preferencias && chef.preferencias.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1 pt-3">
                              {chef.preferencias.slice(0, 2).map((pref, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-fitcooker-orange/30 text-fitcooker-orange bg-fitcooker-orange/5">
                                  {pref}
                                </Badge>
                              ))}
                              {chef.preferencias.length > 2 && (
                                <Badge variant="outline" className="text-xs border-gray-300 text-gray-500">
                                  +{chef.preferencias.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cooks;
