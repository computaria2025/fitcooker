
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            MeuSite
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors">
              Início
            </a>
            <a href="#sobre" className="text-gray-700 hover:text-blue-600 transition-colors">
              Sobre
            </a>
            <a href="#servicos" className="text-gray-700 hover:text-blue-600 transition-colors">
              Serviços
            </a>
            <a href="#contato" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contato
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <a 
                href="#inicio" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </a>
              <a 
                href="#sobre" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </a>
              <a 
                href="#servicos" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </a>
              <a 
                href="#contato" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
