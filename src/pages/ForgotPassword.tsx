
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChefHat, Mail, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSubmitted(true);
        toast({
          title: "Email enviado",
          description: "Instruções de recuperação de senha foram enviadas para seu email.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <ChefHat size={40} className="text-fitcooker-orange mr-2" />
                <h1 className="text-4xl font-bold">
                  Fit<span className="text-fitcooker-orange">Cooker</span>
                </h1>
              </div>
              <h2 className="heading-md mb-3">Recuperar Senha</h2>
              <p className="text-gray-600">
                Informe seu email para receber instruções de recuperação de senha
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-8">
              {isSubmitted ? (
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Email Enviado!</h3>
                  <p className="text-gray-600 mb-6">
                    Enviamos um link de recuperação de senha para <span className="font-medium">{email}</span>.
                    Verifique sua caixa de entrada e também a pasta de spam.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Tentar com outro email
                    </Button>
                    <Link to="/login" className="block">
                      <Button 
                        variant="ghost" 
                        className="w-full text-fitcooker-orange hover:text-fitcooker-orange/80"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para login
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitcooker-orange focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn btn-primary relative"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      <span>Recuperar Senha</span>
                    )}
                  </Button>
                  
                  <div className="mt-6 text-center">
                    <Link to="/login" className="text-fitcooker-orange hover:underline inline-flex items-center">
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Voltar para login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
