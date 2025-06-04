
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Send, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Contato: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-fitcooker-orange/10 to-fitcooker-yellow/10 py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Entre em Contato</h1>
              <p className="text-lg text-gray-700">
                Estamos aqui para ajudar. Como podemos te auxiliar hoje?
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center text-fitcooker-orange mb-2">
                  <div className="h-px w-12 bg-fitcooker-orange mr-4"></div>
                  <span className="font-medium uppercase">Fale Conosco</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">Envie sua mensagem</h2>
                <p className="text-gray-700 mb-8">
                  Quer tirar uma dúvida, fazer uma sugestão ou simplesmente dizer oi? 
                  Preencha o formulário e entraremos em contato o mais breve possível.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome completo
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Do que se trata?"
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Como podemos ajudar?"
                      required
                      className="w-full min-h-[150px]"
                    />
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      className="w-full sm:w-auto bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                    >
                      <Send className="mr-2 h-4 w-4" /> Enviar mensagem
                    </Button>
                  </div>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-gray-50 p-8 rounded-xl h-full">
                  <h3 className="text-2xl font-bold mb-6">Informações de contato</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Mail className="h-6 w-6 text-fitcooker-orange mr-4 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">Email</h4>
                        <p className="text-gray-700">contato@fitcooker.com.br</p>
                        <p className="text-gray-700">suporte@fitcooker.com.br</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-6 w-6 text-fitcooker-orange mr-4 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">Telefone</h4>
                        <p className="text-gray-700">(11) 3456-7890</p>
                        <p className="text-gray-700">(11) 98765-4321</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="font-medium mb-3">Horário de atendimento</h4>
                    <p className="text-gray-700">Segunda à Sexta: 9h às 18h</p>
                    <p className="text-gray-700">Sábado: 9h às 13h</p>
                  </div>
                  
                  <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-medium mb-3 flex items-center">
                      <Mail className="h-5 w-5 text-fitcooker-orange mr-2" />
                      Resposta rápida
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Nossa equipe de suporte responde em até 24 horas úteis. Para assuntos urgentes, 
                      recomendamos entrar em contato por telefone.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contato;
