
import React from 'react';
import { Heart, Github, Linkedin, Instagram, Mail, ChefHat } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-lg flex items-center justify-center">
                <ChefHat className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold">FitCooker</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sua plataforma de receitas saudáveis e saborosas. 
              Conecte-se com chefs apaixonados e descubra o melhor da gastronomia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="/recipes" className="text-gray-300 hover:text-fitcooker-orange transition-colors">Receitas</a></li>
              <li><a href="/cooks" className="text-gray-300 hover:text-fitcooker-orange transition-colors">Chefs</a></li>
              <li><a href="/alimentacao-saudavel" className="text-gray-300 hover:text-fitcooker-orange transition-colors">Alimentação Saudável</a></li>
              <li><a href="/ferramentas" className="text-gray-300 hover:text-fitcooker-orange transition-colors">Ferramentas</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre</h3>
            <ul className="space-y-2">
              <li><a href="/quem-somos" className="text-gray-300 hover:text-fitcooker-orange transition-colors">Quem Somos</a></li>
              <li><a href="/contato" className="text-gray-300 hover:text-fitcooker-orange transition-colors">Contato</a></li>
              <li><a href="/termos-de-uso" className="text-gray-300 hover:text-fitcooker-orange transition-colors">Termos de Uso</a></li>
              <li><a href="/privacidade" className="text-gray-300 hover:text-fitcooker-orange transition-colors">Privacidade</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-fitcooker-orange transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-fitcooker-orange transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-fitcooker-orange transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contato@fitcooker.com" 
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-fitcooker-orange transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-300 text-sm">
            <span>© 2025 FitCooker. Todos os direitos reservados.</span>
            <span>•</span>
            <span>Desenvolvido por Ígor Tavares Rocha</span>
          </div>
          <div className="flex items-center space-x-1 mt-4 md:mt-0 text-gray-300 text-sm">
            <span>Feito com</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>para a comunidade culinária</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
