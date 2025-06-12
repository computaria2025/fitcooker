
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Star, Users, Award, Search, Filter, MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface Chef {
  id: string;
  nome: string;
  bio: string | null;
  avatar_url: string | null;
  is_chef: boolean;
  preferencias: string[] | null;
  receitas_count: number;
  seguidores_count: number;
  seguindo_count: number;
  nota_media: number | null;
  data_cadastro: string;
}

const Cooks: React.FC = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      console.log('Fetching chefs...');

      const { data: chefData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('data_cadastro', { ascending: false });

      if (error) throw error;

      // Calculate stats for each chef
      const chefsWithStats = await Promise.all(
        (chefData || []).map(async (chef) => {
          // Get recipe count and average rating
          const { data: recipes } = await supabase
            .from('receitas')
            .select('nota_media')
            .eq('usuario_id', chef.id)
            .eq('status', 'ativa');

          const recipeCount = recipes?.length || 0;
          let averageRating = null;

          if (recipes && recipes.length > 0) {
            const validRatings = recipes.filter(r => r.nota_media > 0);
            if (validRatings.length > 0) {
              averageRating = validRatings.reduce((sum, recipe) => sum + recipe.nota_media, 0) / validRatings.length;
            }
          }

          return {
            ...chef,
            receitas_count: recipeCount,
            nota_media: averageRating ? Number(averageRating.toFixed(1)) : null
          };
        })
      );

      console.log('Chefs with stats:', chefsWithStats);
      setChefs(chefsWithStats);
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChefs = chefs.filter(chef => {
    const matchesSearch = chef.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterVerified || chef.is_chef;
    return matchesSearch && matchesFilter;
  });

  const handleChefClick = (chefId: string) => {
    navigate(`/cook/${chefId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-2">
        {/* Hero Section */}
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
              <ChefHat className="w-16 h-16 mx-auto mb-6 text-white" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Conheça Nossos Chefs
              </h1>
              <p className="text-orange-100 text-lg max-w-2xl mx-auto">
                Descubra os talentosos cozinheiros da nossa comunidade
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6">
          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar chefs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-fitcooker-orange"
                  />
                </div>
                <Button
                  variant={filterVerified ? "default" : "outline"}
                  onClick={() => setFilterVerified(!filterVerified)}
                  className={filterVerified ? "bg-fitcooker-orange hover:bg-fitcooker-orange/90" : "border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white"}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Chefs Verificados
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredChefs.length} Chef{filteredChefs.length !== 1 ? 's' : ''} Encontrado{filteredChefs.length !== 1 ? 's' : ''}
            </h2>
          </motion.div>

          {/* Chefs Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }, (_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredChefs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredChefs.map((chef, index) => (
                  <motion.div
                    key={chef.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index % 8) }}
                    whileHover={{ y: -5 }}
                    className="cursor-pointer"
                    onClick={() => handleChefClick(chef.id)}
                  >
                    <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden group">
                      <CardContent className="p-0">
                        {/* Card Header with Gradient */}
                        <div className="relative bg-gradient-to-br from-fitcooker-orange to-orange-500 p-6 text-white">
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                          <div className="relative z-10">
                            <div className="flex justify-center mb-4">
                              <div className="relative">
                                <Avatar className="w-20 h-20 border-4 border-white shadow-lg ring-4 ring-white/20">
                                  <AvatarImage src={chef.avatar_url || ''} className="object-cover" />
                                  <AvatarFallback className="bg-white text-fitcooker-orange text-xl font-bold">
                                    <ChefHat className="w-10 h-10" />
                                  </AvatarFallback>
                                </Avatar>
                                {chef.is_chef && (
                                  <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                                  >
                                    <Award className="w-4 h-4 text-white" />
                                  </motion.div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <h3 className="font-bold text-lg mb-1 text-white group-hover:text-orange-100 transition-colors">
                                {chef.nome}
                              </h3>
                              {chef.is_chef && (
                                <Badge className="bg-white/20 border-white/30 text-white text-xs mb-2">
                                  Chef Verificado
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 space-y-4">
                          {/* Bio */}
                          {chef.bio && (
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {chef.bio}
                            </p>
                          )}

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-gray-900">{chef.receitas_count}</div>
                              <div className="text-xs text-gray-500">Receitas</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-gray-900">{chef.seguidores_count}</div>
                              <div className="text-xs text-gray-500">Seguidores</div>
                            </div>
                            <div>
                              {chef.nota_media ? (
                                <>
                                  <div className="flex items-center justify-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-lg font-bold text-gray-900">{chef.nota_media}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">Avaliação</div>
                                </>
                              ) : (
                                <>
                                  <div className="text-lg font-bold text-gray-400">-</div>
                                  <div className="text-xs text-gray-500">Sem avaliação</div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Preferences */}
                          {chef.preferencias && chef.preferencias.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-gray-500 mb-2">Preferências:</div>
                              <div className="flex flex-wrap gap-1">
                                {chef.preferencias.slice(0, 3).map((pref, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {pref}
                                  </Badge>
                                ))}
                                {chef.preferencias.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{chef.preferencias.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Join Date */}
                          <div className="flex items-center justify-center text-xs text-gray-500 pt-2 border-t">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Desde {new Date(chef.data_cadastro).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Nenhum chef encontrado
                </h3>
                <p className="text-gray-600 text-lg mb-8">
                  Tente ajustar sua busca ou filtros
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterVerified(false);
                  }} 
                  className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                >
                  Limpar Filtros
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cooks;
