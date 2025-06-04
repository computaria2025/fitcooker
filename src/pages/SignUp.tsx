// Dentro do componente SignUp
import { useToast } from '@/components/ui/use-toast'; // Certifique-se que está importado
import { useNavigate } from 'react-router-dom'; // Para redirecionar

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChefHat, Mail, Lock, User, Eye, EyeOff, Check, X } from 'lucide-react';

const SignUp: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
  const isPasswordStrong = hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordStrong) {
      toast({ // Seu toast para senha fraca já está aqui, o que é ótimo!
        title: "Senha fraca",
        description: "Por favor, certifique-se de que sua senha atende a todos os critérios.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true); // Inicia o estado de carregamento

    try {
      // 🎯 ETAPA 1: Fazer a requisição POST para o backend
      const response = await fetch('http://127.0.0.1:5000/register', { // URL do seu backend Flask
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Informa ao backend que estamos enviando JSON
        },
        body: JSON.stringify({
          nome: name,       // O backend espera 'nome', 'email', 'senha'
          email: email,
          senha: password,
        }),
      });

      // 🎯 ETAPA 2: Processar a resposta do backend
      const data = await response.json(); // Tenta converter a resposta para JSON

      if (response.ok) { // Código de status HTTP 2xx indica sucesso
        toast({
          title: "Cadastro realizado com sucesso! (Mock)",
          description: data.msg || "Seu usuário foi 'mockado' com sucesso.", // Usa a msg do backend ou uma padrão
          className: "bg-green-500 text-white", // Um estilo para sucesso
        });
        // Opcional: Redirecionar para a página de login após um tempo
        setTimeout(() => {
          navigate('/login'); // Use o hook useNavigate importado
        }, 2000); // Redireciona após 2 segundos
      } else {
        // Se o backend retornar um erro (ex: email já existe, dados faltando)
        toast({
          title: "Erro no cadastro",
          description: data.msg || `Erro ${response.status}: Ocorreu um problema.`, // Usa a msg do backend ou uma genérica
          variant: "destructive",
        });
      }
    } catch (error) {
      // 🎯 ETAPA 3: Lidar com erros de rede ou conexão
      console.error("Falha ao conectar com o backend:", error);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao servidor. Verifique se o backend está rodando.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento, independente do resultado
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
              <h2 className="heading-md mb-3">Crie sua conta</h2>
              <p className="text-gray-600">
                Junte-se à comunidade de cozinheiros fitness
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitcooker-orange focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
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
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitcooker-orange focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicators */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      {hasMinLength ? (
                        <Check size={16} className="text-green-500 mr-2" />
                      ) : (
                        <X size={16} className="text-gray-400 mr-2" />
                      )}
                      <span className={`text-sm ${hasMinLength ? 'text-green-500' : 'text-gray-500'}`}>
                        Pelo menos 8 caracteres
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      {hasUpperCase ? (
                        <Check size={16} className="text-green-500 mr-2" />
                      ) : (
                        <X size={16} className="text-gray-400 mr-2" />
                      )}
                      <span className={`text-sm ${hasUpperCase ? 'text-green-500' : 'text-gray-500'}`}>
                        Pelo menos uma letra maiúscula
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      {hasNumber ? (
                        <Check size={16} className="text-green-500 mr-2" />
                      ) : (
                        <X size={16} className="text-gray-400 mr-2" />
                      )}
                      <span className={`text-sm ${hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
                        Pelo menos um número
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      {hasSpecialChar ? (
                        <Check size={16} className="text-green-500 mr-2" />
                      ) : (
                        <X size={16} className="text-gray-400 mr-2" />
                      )}
                      <span className={`text-sm ${hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}>
                        Pelo menos um caractere especial (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !isPasswordStrong}
                  className={`w-full btn ${isPasswordStrong ? 'btn-primary' : 'bg-gray-300 text-gray-600 cursor-not-allowed'} relative`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Criando conta...</span>
                    </div>
                  ) : (
                    <span>Criar conta</span>
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-fitcooker-orange hover:underline font-medium">
                    Entrar
                  </Link>
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 text-center mt-6">
              Ao criar uma conta, você concorda com nossos{' '}
              <Link to="/terms" className="text-fitcooker-orange hover:underline">
                Termos de Serviço
              </Link>{' '}
              e{' '}
              <Link to="/privacy" className="text-fitcooker-orange hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;
