
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section id="inicio" className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
            Bem-vindo ao
            <span className="text-blue-600 block">Nosso Site</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in-delay">
            Criamos soluções digitais modernas e inovadoras para o seu negócio crescer
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Começar Agora
              <ArrowRight size={20} />
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all">
              Saiba Mais
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
