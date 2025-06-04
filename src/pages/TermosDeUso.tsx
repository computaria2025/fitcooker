
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { FileText, CheckSquare, AlertCircle, HelpCircle } from 'lucide-react';

const TermosDeUso: React.FC = () => {
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
                <FileText className="h-12 w-12 text-fitcooker-orange" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Termos de Uso</h1>
              <p className="text-lg text-gray-700">
                Condições gerais para utilização do FitCooker
              </p>
            </motion.div>
          </div>
        </section>

        {/* Terms Content */}
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
                
                  <h2 className="text-2xl font-bold mb-4">1. Aceitação dos Termos</h2>
                  <p className="mb-6 text-gray-700">
                    Ao acessar ou utilizar o site e os serviços do FitCooker, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                    Se você não concorda com qualquer parte destes termos, não poderá acessar ou utilizar nossos serviços.
                  </p>
                  
                  <div className="flex items-start mb-8">
                    <div className="mt-1 bg-fitcooker-orange/10 p-3 rounded-full text-fitcooker-orange mr-4">
                      <CheckSquare size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">2. Uso do Serviço</h2>
                      <p className="mb-4 text-gray-700">
                        Ao utilizar nossos serviços, você concorda em:
                      </p>
                      <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                        <li>Fornecer informações precisas e completas ao se registrar e ao utilizar o serviço.</li>
                        <li>Manter a segurança de sua conta e senha, sendo totalmente responsável por qualquer atividade que ocorra sob sua conta.</li>
                        <li>Não utilizar o serviço para qualquer finalidade ilegal ou não autorizada.</li>
                        <li>Não tentar acessar, utilizar ou interferir em sistemas ou áreas não autorizadas do site.</li>
                        <li>Não reproduzir, duplicar, copiar, vender ou explorar qualquer parte do serviço sem autorização expressa.</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">3. Conteúdo do Usuário</h2>
                  <p className="mb-4 text-gray-700">
                    Ao enviar, postar ou compartilhar conteúdo, como receitas, comentários ou avaliações ("Conteúdo do Usuário"), você:
                  </p>
                  <ul className="list-disc pl-5 mb-8 space-y-2 text-gray-700">
                    <li>Concede ao FitCooker uma licença mundial, não exclusiva, livre de royalties para usar, modificar, publicar e exibir tal Conteúdo do Usuário.</li>
                    <li>Garante que possui todos os direitos necessários para conceder tal licença.</li>
                    <li>Concorda que é responsável por todo o Conteúdo do Usuário que você fornece.</li>
                  </ul>

                  <div className="flex items-start mb-8">
                    <div className="mt-1 bg-fitcooker-orange/10 p-3 rounded-full text-fitcooker-orange mr-4">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">4. Conteúdo Proibido</h2>
                      <p className="mb-4 text-gray-700">
                        Você concorda em não postar ou compartilhar conteúdo que:
                      </p>
                      <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                        <li>Seja ilegal, difamatório, obsceno, ofensivo, ameaçador ou abusivo.</li>
                        <li>Infrinja os direitos de propriedade intelectual ou outros direitos de terceiros.</li>
                        <li>Contenha vírus ou código malicioso que possam danificar ou interferir no funcionamento do site.</li>
                        <li>Viole qualquer lei ou regulamento aplicável.</li>
                        <li>Promova atividades ilegais ou condutas prejudiciais.</li>
                      </ul>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-4">5. Direitos de Propriedade Intelectual</h2>
                  <p className="mb-8 text-gray-700">
                    O conteúdo disponível em nosso site, incluindo, mas não se limitando a textos, gráficos, logos, ícones, 
                    imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade do FitCooker 
                    e está protegido por leis de propriedade intelectual. Você não pode usar, reproduzir ou distribuir 
                    qualquer conteúdo do site sem autorização prévia por escrito.
                  </p>

                  <h2 className="text-2xl font-bold mb-4">6. Limitação de Responsabilidade</h2>
                  <p className="mb-8 text-gray-700">
                    O FitCooker não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais, 
                    consequenciais ou punitivos resultantes do uso ou da incapacidade de usar nossos serviços, incluindo 
                    mas não se limitando a danos por perda de lucros, boa vontade, uso, dados ou outras perdas intangíveis.
                  </p>

                  <h2 className="text-2xl font-bold mb-4">7. Modificações dos Serviços e Termos</h2>
                  <p className="mb-8 text-gray-700">
                    O FitCooker reserva-se o direito de, a qualquer momento, modificar ou descontinuar, temporária ou 
                    permanentemente, o serviço (ou qualquer parte dele) com ou sem aviso prévio. Também podemos atualizar 
                    estes Termos de Uso a qualquer momento. Continuando a acessar ou usar nossos serviços após tais alterações, 
                    você concorda em estar vinculado aos termos atualizados.
                  </p>

                  <div className="flex items-start mb-8">
                    <div className="mt-1 bg-fitcooker-orange/10 p-3 rounded-full text-fitcooker-orange mr-4">
                      <HelpCircle size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">8. Entre em Contato</h2>
                      <p className="mb-4 text-gray-700">
                        Se você tiver dúvidas sobre estes Termos de Uso, por favor entre em contato conosco:
                      </p>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="font-medium">FitCooker - Suporte</p>
                        <p>Email: termos@fitcooker.com.br</p>
                        <p>Telefone: (11) 3456-7890</p>
                      </div>
                    </div>
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

export default TermosDeUso;
