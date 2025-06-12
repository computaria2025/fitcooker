
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Search, Menu, X, ChefHat, PlusCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import SearchDialog from './SearchDialog';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Handle scroll for sophisticated navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navigation = [
    { name: 'Receitas', href: '/recipes' },
    { name: 'Chefs', href: '/cooks' },
    { name: 'Alimentação', href: '/alimentacao-saudavel' },
    { name: 'Ferramentas', href: '/ferramentas' },
    { name: 'Sobre', href: '/about' },
    { name: 'Contato', href: '/contact' }
  ];

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Você saiu da sua conta com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <motion.nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100/50' 
            : 'bg-transparent backdrop-blur-sm'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className={`flex justify-between items-center transition-all duration-500 ease-in-out ${
            isScrolled ? 'h-16' : 'h-24'
          }`}>
            {/* Enhanced Logo with Premium Animation */}
            <motion.div
              layout
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div
                  animate={{ 
                    scale: isScrolled ? 0.85 : 1,
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    scale: { duration: 0.5, ease: "easeInOut" },
                    rotate: { duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-fitcooker-orange to-orange-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <ChefHat className={`relative text-fitcooker-orange transition-all duration-500 ${
                    isScrolled ? 'h-7 w-7' : 'h-10 w-10'
                  }`} />
                </motion.div>
                <motion.div
                  layout
                  className="relative"
                >
                  <span className={`font-bold transition-all duration-500 ${
                    isScrolled 
                      ? 'text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent' 
                      : 'text-2xl text-fitcooker-orange drop-shadow-lg'
                  }`}>
                    Fit<span className={`transition-all duration-500 ${
                      isScrolled 
                        ? 'bg-gradient-to-r from-fitcooker-orange to-orange-500 bg-clip-text text-transparent'
                        : 'text-orange-600'
                    }`}>Cooker</span>
                  </span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-fitcooker-orange to-orange-500 group-hover:w-full transition-all duration-300"></div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                >
                  <Link
                    to={item.href}
                    className={`relative px-4 py-2 transition-all duration-300 group font-medium ${
                      isScrolled 
                        ? 'text-gray-700 hover:text-fitcooker-orange' 
                        : 'text-fitcooker-orange hover:text-orange-600 drop-shadow-md'
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className={`absolute inset-0 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out ${
                      isScrolled 
                        ? 'bg-gradient-to-r from-fitcooker-orange/10 to-orange-400/10'
                        : 'bg-white/10 backdrop-blur-sm'
                    }`}></div>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-fitcooker-orange to-orange-500 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"></div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Premium Search Button */}
              <motion.button
                onClick={() => setShowSearchDialog(true)}
                className={`relative p-3 transition-all duration-300 group ${
                  isScrolled 
                    ? 'text-gray-600 hover:text-fitcooker-orange'
                    : 'text-fitcooker-orange hover:text-orange-600'
                }`}
                aria-label="Buscar receitas"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-fitcooker-orange/20 to-orange-400/20'
                    : 'bg-white/20 backdrop-blur-sm'
                }`}></div>
                <Search className="relative h-5 w-5" />
              </motion.button>

              {user ? (
                <>
                  {/* Enhanced Add Recipe Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/add-recipe"
                      className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-fitcooker-orange/25 transition-all duration-300 font-medium"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Nova Receita</span>
                    </Link>
                  </motion.div>

                  {/* Enhanced User Menu with Avatar */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-fitcooker-orange to-orange-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                          <Avatar className="relative h-9 w-9 border-2 border-white shadow-lg">
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                            <AvatarFallback className="bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <span className={`hidden sm:inline font-medium transition-colors duration-300 ${
                          isScrolled 
                            ? 'text-gray-700 hover:text-fitcooker-orange'
                            : 'text-fitcooker-orange hover:text-orange-600 drop-shadow-md'
                        }`}>
                          {user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário'}
                        </span>
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2">
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <User className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="font-medium">Meu Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="sm:hidden">
                        <Link to="/add-recipe" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <PlusCircle className="h-4 w-4 mr-3 text-gray-500" />
                          <span className="font-medium">Nova Receita</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem onClick={handleSignOut} className="flex items-center p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                        <LogOut className="h-4 w-4 mr-3" />
                        <span className="font-medium">Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* Enhanced Login/Signup for non-authenticated users */}
                  <Link
                    to="/login"
                    className={`hidden sm:block transition-colors duration-300 font-medium px-4 py-2 ${
                      isScrolled 
                        ? 'text-gray-700 hover:text-fitcooker-orange'
                        : 'text-fitcooker-orange hover:text-orange-600 drop-shadow-md'
                    }`}
                  >
                    Entrar
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/signup"
                      className="bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-fitcooker-orange/25 transition-all duration-300 font-medium"
                    >
                      Cadastrar
                    </Link>
                  </motion.div>
                </>
              )}

              {/* Enhanced Mobile Menu Button */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`md:hidden p-2 transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-gray-600 hover:text-fitcooker-orange'
                    : 'text-fitcooker-orange hover:text-orange-600'
                }`}
                aria-label="Toggle menu"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isOpen ? 'close' : 'open'}
                    initial={{ rotate: 0, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-6 bg-white/90 backdrop-blur-xl rounded-2xl mx-4 mb-4 shadow-xl border border-gray-100/50">
                  <div className="flex flex-col space-y-2 px-6">
                    {navigation.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Link
                          to={item.href}
                          className="text-gray-700 hover:text-fitcooker-orange transition-colors duration-300 block py-3 px-4 rounded-lg hover:bg-gray-50 font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                    
                    {!user && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navigation.length * 0.1, duration: 0.3 }}
                        className="pt-4 border-t border-gray-200"
                      >
                        <Link
                          to="/login"
                          className="text-gray-700 hover:text-fitcooker-orange transition-colors duration-300 block py-3 px-4 rounded-lg hover:bg-gray-50 font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          Entrar
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Enhanced Spacer for fixed navbar */}
      <div className={`transition-all duration-500 ${isScrolled ? 'h-16' : 'h-24'}`}></div>

      {/* Search Dialog */}
      <SearchDialog open={showSearchDialog} onOpenChange={setShowSearchDialog} />
    </>
  );
};

export default Navbar;
