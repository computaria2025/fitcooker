
import { CheckCircle } from "lucide-react";

const About = () => {
  const features = [
    "Design moderno e responsivo",
    "Desenvolvimento de alta qualidade",
    "Suporte técnico especializado",
    "Soluções personalizadas"
  ];

  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Sobre Nós
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Somos uma equipe dedicada a criar experiências digitais excepcionais. 
                Com anos de experiência no mercado, oferecemos soluções tecnológicas 
                que impulsionam o crescimento do seu negócio.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl p-8 shadow-lg">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Nossa Missão</h3>
                  <p className="text-gray-600">
                    Transformar ideias em realidade digital, criando soluções que 
                    fazem a diferença na vida das pessoas e no sucesso dos negócios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
