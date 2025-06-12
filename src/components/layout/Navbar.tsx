
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
    { name: 'Sobre', path: '/quem-somos', icon: Info },
    { name: 'Contato', path: '/contato', icon: Mail },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200 h-16' 
        : 'bg-transparent h-20'
    }`}>
      <div className="container mx-auto px-4 md:px-6 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`relative transition-all duration-700 ease-in-out ${
              scrolled ? 'w-10 h-10' : 'w-12 h-12'
            } bg-gradient-to-br from-fitcooker-orange via-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl`}>
              <ChefHat className={`text-white transition-all duration-500 ${
                scrolled ? 'w-5 h-5' : 'w-6 h-6'
              } group-hover:rotate-12 group-hover:scale-110`} />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className={`font-black tracking-tight transition-all duration-700 ease-in-out ${
                scrolled 
                  ? 'text-2xl bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 bg-clip-text text-transparent' 
                  : 'text-3xl text-white drop-shadow-2xl'
              } group-hover:scale-105`}>
                FitCooker
              </span>
              {!scrolled && (
                <span className="text-xs text-orange-100 opacity-90 tracking-widest uppercase font-medium">
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
                      : scrolled
                        ? 'text-gray-700 hover:text-fitcooker-orange hover:bg-orange-50'
                        : 'text-white hover:text-orange-200 hover:bg-white/10 backdrop-blur-sm'
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
                <Button asChild variant="outline" className={`transition-all duration-500 font-semibold group relative overflow-hidden ${
                  scrolled
                    ? 'border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white'
                    : 'border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-fitcooker-orange'
                }`}>
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
                <Button asChild variant="outline" className={`transition-all duration-500 font-semibold ${
                  scrolled
                    ? 'border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white'
                    : 'border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-fitcooker-orange'
                }`}>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild className={`transition-all duration-500 font-semibold hover:scale-105 ${
                  scrolled
                    ? 'bg-gradient-to-r from-fitcooker-orange to-orange-500 hover:from-orange-500 hover:to-orange-600'
                    : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800'
                }`}>
                  <Link to="/signup">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors duration-300 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm border-t border-gray-100">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-fitcooker-orange text-white'
                        : 'text-gray-700 hover:text-fitcooker-orange hover:bg-orange-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              {user ? (
                <>
                  <Link
                    to="/add-recipe"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-fitcooker-orange hover:bg-orange-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">Adicionar Receita</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-fitcooker-orange hover:bg-orange-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Perfil</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-fitcooker-orange hover:bg-orange-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Sair</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-fitcooker-orange hover:bg-orange-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Entrar</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-fitcooker-orange text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium">Cadastrar</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
