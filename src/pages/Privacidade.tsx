
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, FileText } from 'lucide-react';

const Privacidade: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-fitcooker-orange/10 to-fitcooker-yellow/10 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="mb-4 inline-flex items-center justify-center">
                <Shield className="h-12 w-12 text-fitcooker-orange" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Privacidade</h1>
              <p className="text-lg text-gray-700">
                Como protegemos e tratamos seus dados no FitCooker
              </p>
            </motion.div>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <p className="text-gray-700">
                      <strong>Última atualização:</strong> 22 de maio de 2024
                    </p>
                  </div>
                
                  <h2 className="text-2xl font-bold mb-4">Introdução</h2>
                  <p className="mb-6 text-gray-700">
                    A FitCooker ("nós", "nosso" ou "nossa") se compromete em proteger sua privacidade. Esta Política de Privacidade 
                    explica como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nosso site e serviços.
                  </p>
                  
                  <div className="flex items-start mb-8">
                    <div className="mt-1 bg-fitcooker-orange/10 p-3 rounded-full text-fitcooker-orange mr-4">
                      <Eye size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Informações que coletamos</h2>
                      <p className="mb-4 text-gray-700">
                        Podemos coletar diferentes tipos de informações, incluindo:
                      </p>
                      <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                        <li>Informações pessoais: nome, e-mail, endereço e número de telefone.</li>
                        <li>Informações de conta: nome de usuário, senha e preferências.</li>
                        <li>Informações de uso: dados sobre como você interage com nosso site.</li>
                        <li>Informações de dispositivo: IP, tipo de navegador, sistema operacional.</li>
                        <li>Conteúdo gerado pelo usuário: receitas, comentários e avaliações.</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-8">
                    <div className="mt-1 bg-fitcooker-orange/10 p-3 rounded-full text-fitcooker-orange mr-4">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Como usamos suas informações</h2>
                      <p className="mb-4 text-gray-700">
                        Utilizamos as informações coletadas para:
                      </p>
                      <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                        <li>Fornecer, manter e melhorar nossos serviços.</li>
                        <li>Processar e gerenciar sua conta e solicitações.</li>
                        <li>Enviar notificações e atualizações relacionadas ao serviço.</li>
                        <li>Personalizar sua experiência e fornecer conteúdo relevante.</li>
                        <li>Analisar tendências e comportamentos dos usuários para melhorar nosso site.</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-8">
                    <div className="mt-1 bg-fitcooker-orange/10 p-3 rounded-full text-fitcooker-orange mr-4">
                      <Lock size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Segurança de dados</h2>
                      <p className="mb-6 text-gray-700">
                        Implementamos medidas de segurança técnicas e organizacionais adequadas para 
                        proteger suas informações pessoais contra acesso não autorizado, alteração, 
                        divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet 
                        ou armazenamento eletrônico é 100% seguro, e não podemos garantir segurança absoluta.
                      </p>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-4">Compartilhamento de informações</h2>
                  <p className="mb-6 text-gray-700">
                    Não vendemos suas informações pessoais a terceiros. Podemos compartilhar suas informações com:
                  </p>
                  <ul className="list-disc pl-5 mb-8 space-y-2 text-gray-700">
                    <li>Prestadores de serviços que nos auxiliam na operação do site.</li>
                    <li>Parceiros de negócios com seu consentimento prévio.</li>
                    <li>Autoridades quando legalmente exigido.</li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">Seus direitos</h2>
                  <p className="mb-6 text-gray-700">
                    Dependendo da sua localização, você pode ter os seguintes direitos em relação às suas informações pessoais:
                  </p>
                  <ul className="list-disc pl-5 mb-8 space-y-2 text-gray-700">
                    <li>Acessar e receber uma cópia das suas informações pessoais.</li>
                    <li>Retificar informações imprecisas.</li>
                    <li>Solicitar a exclusão de suas informações pessoais.</li>
                    <li>Restringir o processamento de suas informações.</li>
                    <li>Portabilidade de dados.</li>
                    <li>Retirar consentimento a qualquer momento.</li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">Alterações nesta Política</h2>
                  <p className="mb-8 text-gray-700">
                    Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos sobre quaisquer 
                    mudanças publicando a nova Política de Privacidade nesta página e atualizando a 
                    data de "última atualização".
                  </p>

                  <h2 className="text-2xl font-bold mb-4">Contato</h2>
                  <p className="mb-6 text-gray-700">
                    Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre 
                    nossas práticas de privacidade, entre em contato conosco em:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="font-medium">FitCooker - Equipe de Privacidade</p>
                    <p>Email: privacidade@fitcooker.com.br</p>
                    <p>Telefone: (11) 3456-7890</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacidade;
