import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Search, User, Menu, X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchDialog from './SearchDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state
  const location = useLocation();
  
  // Mock user data - in a real app, this would come from auth context
  const mockUser = {
    name: 'João Silva',
    email: 'joao@example.com',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  };
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  // Toggle login state (just for demo)
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'py-3 bg-white shadow-md' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-fitcooker-black hover:opacity-80 transition-opacity"
          >
            <ChefHat 
              size={32} 
              className={cn(
                'text-fitcooker-orange transition-all duration-300',
                isScrolled ? 'scale-90' : 'scale-100'
              )} 
            />
            <span 
              className={cn(
                'font-bold tracking-tight text-gradient transition-all duration-300',
                isScrolled ? 'text-2xl' : 'text-3xl'
              )}
            >
              FitCooker
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/destaques" className="nav-link">Destaques</Link>
            <Link to="/recipes" className="nav-link">Receitas</Link>
            <Link to="/cooks" className="nav-link">Cozinheiros</Link>
            <Link to="/about" className="nav-link">Sobre</Link>
            <Link to="/alimentacao-saudavel" className="nav-link">Alimentação</Link>
          </div>
          
          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Buscar receitas"
              onClick={handleOpenSearch}
            >
              <Search size={20} />
            </button>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-fitcooker-orange rounded-full"></span>
                </button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100">
                      <Avatar className="w-9 h-9 border-2 border-fitcooker-orange/20">
                        <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                        <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full cursor-pointer">Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-recipes" className="w-full cursor-pointer">Minhas Receitas</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/favorites" className="w-full cursor-pointer">Favoritos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full cursor-pointer">Configurações</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={toggleLogin} className="text-red-600 cursor-pointer">
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={toggleLogin} // For demo purposes
              >
                <User size={20} />
                <span>Entrar</span>
              </Link>
            )}
            
            <Link 
              to="/add-recipe" 
              className="btn btn-primary flex items-center px-6 py-3"
            >
              <span>Adicionar Receita</span>
            </Link>
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Buscar receitas"
              onClick={handleOpenSearch}
            >
              <Search size={20} />
            </button>
            
            {isLoggedIn && (
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-fitcooker-orange rounded-full"></span>
              </button>
            )}
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <Avatar className="w-8 h-8 border-2 border-fitcooker-orange/20">
                      <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                      <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={toggleLogin}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      <div 
        className={cn(
          'fixed inset-0 bg-white z-40 pt-20 px-6 transition-transform duration-300 ease-in-out transform md:hidden',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex flex-col space-y-6">
          <Link to="/" className="flex items-center py-3 border-b border-gray-100">
            <span className="text-xl font-medium">Home</span>
          </Link>
          <Link to="/destaques" className="flex items-center py-3 border-b border-gray-100">
            <span className="text-xl font-medium">Destaques</span>
          </Link>
          <Link to="/recipes" className="flex items-center py-3 border-b border-gray-100">
            <span className="text-xl font-medium">Receitas</span>
          </Link>
          <Link to="/cooks" className="flex items-center py-3 border-b border-gray-100">
            <span className="text-xl font-medium">Cozinheiros</span>
          </Link>
          <Link to="/about" className="flex items-center py-3 border-b border-gray-100">
            <span className="text-xl font-medium">Sobre</span>
          </Link>
          <Link to="/alimentacao-saudavel" className="flex items-center py-3 border-b border-gray-100">
            <span className="text-xl font-medium">Alimentação</span>
          </Link>
          
          <div className="pt-6 flex flex-col space-y-4">
            {!isLoggedIn && (
              <Link to="/login" className="btn btn-outline flex items-center justify-center px-6 py-3" onClick={toggleLogin}>
                <User size={20} className="mr-2" />
                <span>Entrar</span>
              </Link>
            )}
            
            <Link to="/add-recipe" className="btn btn-primary flex items-center justify-center px-6 py-3">
              <span>Adicionar Receita</span>
            </Link>
          </div>
        </nav>
      </div>
      
      {/* Search Dialog with improved design */}
      <SearchDialog 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen} 
      />
    </header>
  );
};

export default Navbar;
