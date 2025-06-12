
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, ChefHat, BookOpen, Users, Plus, Utensils } from 'lucide-react';
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
  const { user, profile } = useAuth();
  const location = useLocation();

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
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-fitcooker-orange to-orange-500 bg-clip-text text-transparent">
              FitCooker
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-fitcooker-orange text-white shadow-lg'
                      : 'text-gray-700 hover:text-fitcooker-orange hover:bg-orange-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button asChild variant="outline" className="border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white">
                  <Link to="/add-recipe">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Receita
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-fitcooker-orange/20">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.nome} />
                        <AvatarFallback className="bg-fitcooker-orange text-white">
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
                <Button asChild variant="outline" className="border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
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
              className="p-2"
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
