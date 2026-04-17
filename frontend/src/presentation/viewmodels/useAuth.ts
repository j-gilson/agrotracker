import { useState } from 'react';
import { router } from 'expo-router';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { humanizeError } from '../../core/utils/humanizeError';

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Simulação de login
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Sucesso simulado
      router.replace({ pathname: AppRoutes.HOME });
      return true;
    } catch {
      setError(
        humanizeError(
          new Error('Falha na autenticacao. Verifique suas credenciais.'),
          'Nao foi possivel entrar agora. Tente novamente.'
        )
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    // Implementação futura
    setError('Funcionalidade de cadastro em breve.');
    return false;
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    login,
    register,
  };
};
