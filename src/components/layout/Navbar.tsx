import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, ChefHat, BookOpen, Users, Plus, Utensils, Info, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Receitas', path: '/recipes', icon: BookOpen },
    { name: 'Chefs', path: '/cooks', icon: Users },
    { name: 'Alimentação', path: '/alimentacao-saudavel', icon: Utensils },
    { name: 'Ferramentas', path: '/ferramentas', icon: Settings },
    { name: 'Sobre', path: '/about', icon: Info },
    { name: 'Contato', path: '/contato', icon: Mail },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200 h-16' 
        : 'bg-transparent h-24'
    }`}>
      <div className="container mx-auto px-4 md:px-6 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`relative transition-all duration-700 ease-in-out ${
              scrolled ? 'w-10 h-10' : 'w-14 h-14'
            } bg-gradient-to-br from-fitcooker-orange via-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl overflow-hidden`}>
              <ChefHat className={`text-white transition-all duration-500 ${
                scrolled ? 'w-5 h-5' : 'w-7 h-7'
              } group-hover:rotate-6 group-hover:scale-110 z-10`} />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className={`font-black tracking-tight transition-all duration-700 ease-in-out ${
                scrolled 
                  ? 'text-2xl text-gray-900' 
                  : 'text-3xl text-gray-900'
              } group-hover:scale-105 bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 bg-clip-text text-transparent`}>
                FitCooker
              </span>
              {!scrolled && (
                <span className="text-xs text-gray-600 opacity-80 tracking-widest uppercase font-medium">
                  Culinária Saudável
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-500 group relative overflow-hidden ${
                    isActive(item.path)
                      ? 'bg-fitcooker-orange text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:text-fitcooker-orange hover:bg-orange-50'
                  }`}
                >
                  <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-semibold tracking-wide">{item.name}</span>
                  {!isActive(item.path) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-fitcooker-orange/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button asChild variant="outline" className="transition-all duration-500 font-semibold group relative overflow-hidden border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white">
                  <Link to="/add-recipe">
                    <Plus className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
                    Adicionar Receita
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-11 w-11 rounded-full hover:scale-110 transition-all duration-300 group">
                      <Avatar className="h-11 w-11 border-2 border-fitcooker-orange/30 group-hover:border-fitcooker-orange transition-colors duration-300">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.nome} />
                        <AvatarFallback className="bg-gradient-to-br from-fitcooker-orange to-orange-500 text-white font-bold">
                          {profile?.nome?.[0] || user.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{profile?.nome || 'Usuário'}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button asChild variant="outline" className="transition-all duration-500 font-semibold border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild className="transition-all duration-500 font-semibold hover:scale-105 bg-gradient-to-r from-fitcooker-orange to-orange-500 hover:from-orange-500 hover:to-orange-600">
                  <Link to="/signup">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {user && (
              <Button asChild variant="ghost" size="sm" className="p-2">
                <Link to="/add-recipe">
                  <Plus className="w-5 h-5" />
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 transition-colors duration-300 text-gray-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-lg">
            <div className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-fitcooker-orange text-white'
                        : 'text-gray-700 hover:text-fitcooker-orange hover:bg-orange-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-base">{item.name}</span>
                  </Link>
                );
              })}
              
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.nome} />
                        <AvatarFallback className="bg-fitcooker-orange text-white text-sm">
                          {profile?.nome?.[0] || user.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{profile?.nome || 'Usuário'}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-fitcooker-orange hover:bg-orange-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium text-base">Perfil</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-fitcooker-orange hover:bg-orange-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium text-base">Dashboard</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium text-base">Sair</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center justify-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-fitcooker-orange hover:bg-orange-50 border border-gray-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium text-base">Entrar</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center justify-center space-x-3 px-4 py-3 rounded-xl bg-fitcooker-orange text-white mt-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="font-medium text-base">Cadastrar</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
