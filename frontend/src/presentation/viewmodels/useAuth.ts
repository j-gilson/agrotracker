import { router } from 'expo-router';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { humanizeError } from '../../core/utils/humanizeError';
import { useAuthSession } from '../contexts/AuthContext';
import { useState } from 'react';

export const useLoginViewModel = () => {
  const { login: loginSession } = useAuthSession();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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

      await loginSession(email, password);
      router.replace({ pathname: AppRoutes.HOME });
      return true;
    } catch (err: unknown) {
      setError(
        humanizeError(
          err,
          'Nao foi possivel entrar agora. Tente novamente.'
        )
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    login,
  };
};

export const useRegisterViewModel = () => {
  const { register: registerSession, login: loginSession } = useAuthSession();
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!nome.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return false;
    }

    if (!email.includes('@')) {
      setError('Digite um e-mail valido.');
      return false;
    }

    if (password.length < 6) {
      setError('A senha deve ter ao menos 6 caracteres.');
      return false;
    }

    if (password !== confirmPassword) {
      setError('As senhas nao conferem.');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      await registerSession(nome, email, password);
      await loginSession(email, password);
      router.replace({ pathname: AppRoutes.HOME });
      return true;
    } catch (err: unknown) {
      setError(
        humanizeError(
          err,
          'Nao foi possivel criar sua conta agora. Tente novamente.'
        )
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    nome,
    setNome,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    register: submit,
  };
};
