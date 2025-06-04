
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contato" className="bg-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-blue-400">MeuSite</h3>
              <p className="text-gray-300 mb-6">
                Criando soluções digitais inovadoras para transformar seu negócio 
                e conectar você ao futuro.
              </p>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Contato</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-400" size={20} />
                  <span className="text-gray-300">contato@meusite.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-blue-400" size={20} />
                  <span className="text-gray-300">(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-blue-400" size={20} />
                  <span className="text-gray-300">São Paulo, SP</span>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Pronto para começar?</h4>
              <p className="text-gray-300 mb-6">
                Entre em contato conosco e vamos transformar suas ideias em realidade.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Fale Conosco
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 MeuSite. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
