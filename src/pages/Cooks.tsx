
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChefHat, Users, BookOpen, Star } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useProfiles } from '@/hooks/useProfiles';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const Cooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chefs, setChefs] = useState<any[]>([]);
  const [filteredChefs, setFilteredChefs] = useState<any[]>([]);
  const { getChefs, toggleFollow, isFollowing, loading } = useProfiles();
  const { user } = useAuth();

  useEffect(() => {
    const loadChefs = async () => {
      const chefsData = await getChefs();
      setChefs(chefsData);
      setFilteredChefs(chefsData);
    };

    loadChefs();
  }, [getChefs]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredChefs(chefs);
    } else {
      const filtered = chefs.filter(chef =>
        chef.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chef.bio && chef.bio.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredChefs(filtered);
    }
  }, [searchTerm, chefs]);

  const handleFollow = async (chefId: string) => {
    const newFollowState = await toggleFollow(chefId);
    if (newFollowState !== undefined) {
      // Update the local state
      setChefs(prevChefs =>
        prevChefs.map(chef =>
          chef.id === chefId
            ? {
                ...chef,
                seguidores_count: newFollowState
                  ? chef.seguidores_count + 1
                  : chef.seguidores_count - 1
              }
            : chef
        )
      );
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nossos <span className="text-gradient">Chefs</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conheça os talentosos chefs da nossa comunidade e descubra suas receitas exclusivas
            </p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Buscar chefs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-3 text-lg"
                  />
                </div>
                <Button type="submit" className="bg-fitcooker-orange hover:bg-fitcooker-orange/90 px-8">
                  <Search size={20} className="mr-2" />
                  Buscar
                </Button>
              </div>
            </form>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-600">
              {loading ? 'Carregando...' : `${filteredChefs.length} chef(s) encontrado(s)`}
            </p>
          </div>

          {/* Chefs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </CardHeader>
                  <CardContent className="text-center">
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="flex justify-center gap-4 mb-4">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredChefs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum chef encontrado</h3>
              <p className="text-gray-600">
                Tente ajustar os termos de busca
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChefs.map((chef) => (
                <ChefCard
                  key={chef.id}
                  chef={chef}
                  user={user}
                  onFollow={handleFollow}
                  isFollowing={isFollowing}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const ChefCard = ({ chef, user, onFollow, isFollowing }: any) => {
  const [following, setFollowing] = useState(false);
  const [checkingFollow, setCheckingFollow] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (user && chef.id) {
        setCheckingFollow(true);
        const followStatus = await isFollowing(chef.id);
        setFollowing(followStatus);
        setCheckingFollow(false);
      }
    };

    checkFollowStatus();
  }, [user, chef.id, isFollowing]);

  const handleFollowClick = async () => {
    if (!user) return;
    
    await onFollow(chef.id);
    setFollowing(!following);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <CardHeader className="text-center pb-4">
        <div className="relative">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
            <AvatarImage src={chef.avatar_url} alt={chef.nome} />
            <AvatarFallback className="text-2xl font-bold bg-fitcooker-orange text-white">
              {chef.nome.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {chef.is_chef && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-fitcooker-orange text-white">
                <ChefHat size={12} className="mr-1" />
                Chef
              </Badge>
            </div>
          )}
        </div>
        
        <Link to={`/cook/${chef.id}`} className="group-hover:text-fitcooker-orange transition-colors">
          <h3 className="font-bold text-xl text-gray-900 mb-1">
            {chef.nome}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600">
          Membro desde {new Date(chef.data_cadastro).getFullYear()}
        </p>
      </CardHeader>
      
      <CardContent className="text-center">
        {chef.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {chef.bio}
          </p>
        )}
        
        <div className="flex justify-center gap-4 mb-6 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center text-fitcooker-orange">
              <BookOpen size={16} className="mr-1" />
              <span className="font-semibold">{chef.receitas_count}</span>
            </div>
            <span className="text-gray-500">Receitas</span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-fitcooker-orange">
              <Users size={16} className="mr-1" />
              <span className="font-semibold">{chef.seguidores_count}</span>
            </div>
            <span className="text-gray-500">Seguidores</span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-fitcooker-orange">
              <Star size={16} className="mr-1" />
              <span className="font-semibold">4.8</span>
            </div>
            <span className="text-gray-500">Avaliação</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link to={`/cook/${chef.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Ver Perfil
            </Button>
          </Link>
          
          {user && user.id !== chef.id && (
            <Button
              onClick={handleFollowClick}
              disabled={checkingFollow}
              className={`flex-1 ${
                following
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white'
              }`}
            >
              {following ? 'Seguindo' : 'Seguir'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Cooks;
