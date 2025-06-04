
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SearchDialog from './SearchDialog';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, userProfile, signOut } = useAuth();

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Receitas', href: '/recipes' },
    { name: 'Chefs', href: '/cooks' },
    { name: 'Sobre', href: '/about' },
    { name: 'Contato', href: '/contato' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-fitcooker-orange">FitCooker</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-fitcooker-orange border-b-2 border-fitcooker-orange'
                      : 'text-gray-700 hover:text-fitcooker-orange'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-600 hover:text-fitcooker-orange transition-colors"
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/add-recipe"
                    className="inline-flex items-center px-4 py-2 bg-fitcooker-orange text-white text-sm font-medium rounded-md hover:bg-fitcooker-orange/90 transition-colors"
                  >
                    <Plus size={16} className="mr-2" />
                    Adicionar Receita
                  </Link>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-fitcooker-orange transition-colors"
                    >
                      {userProfile?.avatar_url ? (
                        <img
                          src={userProfile.avatar_url}
                          alt={userProfile.nome}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User size={16} />
                        </div>
                      )}
                      <span className="hidden lg:block">{userProfile?.nome}</span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <Link
                          to={`/cook-profile/${user.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Meu Perfil
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut size={16} className="inline mr-2" />
                          Sair
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-fitcooker-orange transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-fitcooker-orange text-white text-sm font-medium rounded-md hover:bg-fitcooker-orange/90 transition-colors"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-600 hover:text-fitcooker-orange transition-colors"
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-fitcooker-orange transition-colors"
                aria-label="Menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-fitcooker-orange bg-orange-50'
                      : 'text-gray-700 hover:text-fitcooker-orange hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    to="/add-recipe"
                    className="block px-3 py-2 text-base font-medium text-fitcooker-orange hover:bg-gray-50 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus size={16} className="inline mr-2" />
                    Adicionar Receita
                  </Link>
                  <Link
                    to={`/cook-profile/${user.id}`}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Meu Perfil
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-full text-left block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <LogOut size={16} className="inline mr-2" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-base font-medium bg-fitcooker-orange text-white rounded-md hover:bg-fitcooker-orange/90"
                    onClick={() => setIsOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <SearchDialog open={showSearch} onOpenChange={setShowSearch} />
    </>
  );
};

export default Navbar;
