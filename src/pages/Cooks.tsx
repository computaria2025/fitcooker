
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Users, Star, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFollowers } from '@/hooks/useFollowers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionTitle from '@/components/ui/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Chef {
  id: string;
  nome: string;
  avatar_url: string | null;
  bio: string | null;
  receitas_count: number;
  seguidores_count: number;
  seguindo_count: number;
  data_cadastro: string;
  is_chef: boolean;
}

const Cooks: React.FC = () => {
  const { user } = useAuth();
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('seguidores_count', { ascending: false });

      if (error) throw error;

      setChefs(data || []);

      // Check following status for each chef if user is logged in
      if (user && data) {
        const followingChecks = await Promise.all(
          data.map(async (chef) => {
            if (chef.id === user.id) return { id: chef.id, isFollowing: false };
            
            const { data: followData } = await supabase
              .from('seguidores')
              .select('id')
              .eq('seguidor_id', user.id)
              .eq('seguido_id', chef.id)
              .single();

            return { id: chef.id, isFollowing: !!followData };
          })
        );

        const followingMap = followingChecks.reduce((acc, { id, isFollowing }) => {
          acc[id] = isFollowing;
          return acc;
        }, {} as Record<string, boolean>);

        setFollowingStates(followingMap);
      }
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (chefId: string) => {
    if (!user) return;

    try {
      const isCurrentlyFollowing = followingStates[chefId];

      if (isCurrentlyFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('seguidores')
          .delete()
          .eq('seguidor_id', user.id)
          .eq('seguido_id', chefId);

        if (error) throw error;
        
        setFollowingStates(prev => ({ ...prev, [chefId]: false }));
        
        // Update chef's follower count
        setChefs(prev => prev.map(chef => 
          chef.id === chefId 
            ? { ...chef, seguidores_count: chef.seguidores_count - 1 }
            : chef
        ));
      } else {
        // Follow
        const { error } = await supabase
          .from('seguidores')
          .insert({
            seguidor_id: user.id,
            seguido_id: chefId
          });

        if (error) throw error;
        
        setFollowingStates(prev => ({ ...prev, [chefId]: true }));
        
        // Update chef's follower count
        setChefs(prev => prev.map(chef => 
          chef.id === chefId 
            ? { ...chef, seguidores_count: chef.seguidores_count + 1 }
            : chef
        ));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-28">
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
      
      <main className="py-12 pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle 
            title="Nossos Chefs Talentosos"
            subtitle="Conheça nossa incrível comunidade de chefs apaixonados por culinária saudável"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {chefs.map((chef, index) => (
              <motion.div
                key={chef.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index % 8) }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="relative mb-4">
                        <Avatar className="w-20 h-20 mx-auto border-4 border-fitcooker-orange/20 group-hover:border-fitcooker-orange/40 transition-colors duration-300">
                          <AvatarImage src={chef.avatar_url || ''} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-fitcooker-orange to-orange-500 text-white text-xl font-bold">
                            {chef.nome?.[0] || <ChefHat className="w-8 h-8" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <ChefHat className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-fitcooker-orange transition-colors duration-300">
                        {chef.nome}
                      </h3>

                      {chef.bio && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {chef.bio}
                        </p>
                      )}

                      <div className="flex justify-center space-x-4 mb-4 text-sm">
                        <div className="flex items-center text-gray-500">
                          <ChefHat className="w-4 h-4 mr-1" />
                          <span>{chef.receitas_count}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{chef.seguidores_count}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex-1 border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white transition-colors duration-300"
                        >
                          <a href={`/cook/${chef.id}`}>Ver Perfil</a>
                        </Button>
                        
                        {user && chef.id !== user.id && (
                          <Button
                            onClick={() => handleFollow(chef.id)}
                            size="sm"
                            variant={followingStates[chef.id] ? "outline" : "default"}
                            className={`${
                              followingStates[chef.id] 
                                ? 'border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300' 
                                : 'bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white'
                            } transition-colors duration-300`}
                          >
                            {followingStates[chef.id] ? 'Seguindo' : 'Seguir'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {chefs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-3">
                Nenhum chef encontrado
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Seja o primeiro a se juntar à nossa comunidade de chefs!
              </p>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cooks;
