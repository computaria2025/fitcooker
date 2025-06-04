
import { Code, Smartphone, Globe, Zap } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: "Desenvolvimento Web",
      description: "Sites modernos e responsivos que se adaptam a qualquer dispositivo."
    },
    {
      icon: Smartphone,
      title: "Apps Mobile",
      description: "Aplicativos mobile nativos e híbridos para iOS e Android."
    },
    {
      icon: Code,
      title: "Sistemas Personalizados",
      description: "Soluções sob medida para as necessidades específicas do seu negócio."
    },
    {
      icon: Zap,
      title: "Otimização",
      description: "Melhoria de performance e SEO para aumentar sua visibilidade online."
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma gama completa de serviços digitais para impulsionar seu negócio
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 group"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <service.icon className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
