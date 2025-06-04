
import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Instagram, Facebook, Twitter, Youtube, HelpCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-fitcooker-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <ChefHat size={32} className="text-fitcooker-orange" />
              <span className="text-2xl font-bold tracking-tight text-gradient">
                FitCooker
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              Receitas fit para uma vida saudável e saborosa.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Explorar</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/recipes" className="text-gray-400 hover:text-white transition-colors">
                  Todas as Receitas
                </Link>
              </li>
              <li>
                <Link to="/destaques" className="text-gray-400 hover:text-white transition-colors">
                  Destaques
                </Link>
              </li>
              <li>
                <Link to="/cooks" className="text-gray-400 hover:text-white transition-colors">
                  Cozinheiros
                </Link>
              </li>
              <li>
                <Link to="/add-recipe" className="text-gray-400 hover:text-white transition-colors">
                  Adicionar Receita
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Ajuda</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about#faq" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <HelpCircle size={16} className="mr-2" /> Dúvidas?
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/quem-somos" className="text-gray-400 hover:text-white transition-colors">
                  Quem Somos
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos-de-uso" className="text-gray-400 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} FitCooker. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
