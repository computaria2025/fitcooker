
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Pelo menos 8 caracteres');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Pelo menos uma letra minúscula');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Pelo menos uma letra maiúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Pelo menos um número');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Pelo menos um caractere especial (!@#$%^&*...)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      return !!data;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Verificação de campos obrigatórios
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    // Validação de email
    if (!validateEmail(email)) {
      setErrorMessage('Por favor, insira um email válido (exemplo: usuario@email.com).');
      return;
    }

    // Verificar se email já está em uso
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setErrorMessage('Este email já está cadastrado. Tente fazer login ou use outro email.');
      return;
    }

    // Validação de senha
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setErrorMessage(`A senha deve ter: ${passwordValidation.errors.join(', ')}.`);
      return;
    }

    // Verificação de confirmação de senha
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem. Por favor, verifique se as senhas são iguais.');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password, { nome: name });
      
      if (error) {
        console.log('SignUp error:', error.message);
        
        let errorMsg = "Erro ao criar conta.";
        
        if (error.message.includes("User already registered") || 
            error.message.includes("already been registered") ||
            error.message.includes("email_address_not_authorized")) {
          errorMsg = "Este email já está cadastrado. Tente fazer login ou use outro email.";
        } else if (error.message.includes("Invalid email") || 
                   error.message.includes("invalid_email")) {
          errorMsg = "Email inválido. Por favor, verifique o formato do email.";
        } else if (error.message.includes("Password should be") || 
                   error.message.includes("weak_password")) {
          errorMsg = "A senha não atende aos requisitos de segurança. Use pelo menos 8 caracteres com maiúscula, minúscula, número e caractere especial.";
        } else if (error.message.includes("signup_disabled")) {
          errorMsg = "Cadastro temporariamente desabilitado.";
        } else if (error.message.includes("email_not_allowed")) {
          errorMsg = "Este domínio de email não é permitido.";
        } else if (error.message.includes("rate_limit")) {
          errorMsg = "Muitas tentativas de cadastro. Tente novamente mais tarde.";
        }
        
        setErrorMessage(errorMsg);
        
        toast({
          title: "Erro no cadastro",
          description: errorMsg,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Conta criada!",
          description: "Bem-vindo ao FitCooker!",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('SignUp catch error:', error);
      const errorMsg = "Não foi possível conectar ao servidor. Tente novamente.";
      setErrorMessage(errorMsg);
      
      toast({
        title: "Erro de conexão",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitcooker-orange via-orange-500 to-orange-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-2xl flex items-center justify-center mx-auto"
            >
              <ChefHat className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Junte-se ao FitCooker
              </CardTitle>
              <CardDescription className="text-gray-600">
                Crie sua conta e comece a cozinhar de forma saudável
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="pl-10 pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua senha"
                      className="pl-10 pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-md border border-red-200">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-fitcooker-orange to-orange-500 hover:from-fitcooker-orange hover:to-orange-600 text-white h-14 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Criando conta...
                  </div>
                ) : (
                  'Criar Conta'
                )}
              </Button>

              <div className="text-center">
                <span className="text-gray-600">Já tem uma conta? </span>
                <Link 
                  to="/login" 
                  className="text-fitcooker-orange hover:text-fitcooker-orange/80 font-medium transition-colors"
                >
                  Fazer login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUp;
