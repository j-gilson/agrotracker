import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { sessionStore } from '../../core/auth/SessionStore';
import { AuthSession } from '../../domain/entities/AuthSession';
import { AuthUser } from '../../domain/entities/AuthUser';
import { GetCurrentUser } from '../../domain/usecases/auth/GetCurrentUser';
import { LoginUser } from '../../domain/usecases/auth/LoginUser';
import { RegisterUser } from '../../domain/usecases/auth/RegisterUser';
import { humanizeError } from '../../core/utils/humanizeError';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  session: AuthSession | null;
  user: AuthUser | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<AuthSession>;
  register: (nome: string, email: string, senha: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<AuthSession | null>(null);

  const repository = useMemo(() => new AuthRepositoryImpl(), []);
  const loginUseCase = useMemo(() => new LoginUser(repository), [repository]);
  const registerUseCase = useMemo(() => new RegisterUser(repository), [repository]);
  const getCurrentUserUseCase = useMemo(() => new GetCurrentUser(repository), [repository]);

  const restore = useCallback(async () => {
    try {
      const stored = await sessionStore.get();
      if (!stored) {
        setSession(null);
        setStatus('unauthenticated');
        return;
      }

      const currentUser = await getCurrentUserUseCase.execute(stored.token);
      const restoredSession = new AuthSession({
        token: stored.token,
        user: currentUser,
      });

      setSession(restoredSession);
      setStatus('authenticated');
    } catch {
      await sessionStore.clear();
      setSession(null);
      setStatus('unauthenticated');
    }
  }, [getCurrentUserUseCase]);

  useEffect(() => {
    restore();
  }, [restore]);

  const login = useCallback(
    async (email: string, senha: string) => {
      try {
        const result = await loginUseCase.execute({ email, senha });
        await sessionStore.set(result);
        setSession(result);
        setStatus('authenticated');
        return result;
      } catch (error: unknown) {
        throw new Error(
          humanizeError(error, 'Nao foi possivel entrar agora. Tente novamente.')
        );
      }
    },
    [loginUseCase]
  );

  const register = useCallback(
    async (nome: string, email: string, senha: string) => {
      try {
        return await registerUseCase.execute({ nome, email, senha });
      } catch (error: unknown) {
        throw new Error(
          humanizeError(error, 'Nao foi possivel criar sua conta agora. Tente novamente.')
        );
      }
    },
    [registerUseCase]
  );

  const logout = useCallback(async () => {
    await sessionStore.clear();
    setSession(null);
    setStatus('unauthenticated');
  }, []);

  const value: AuthContextValue = {
    status,
    session,
    user: session?.user ?? null,
    token: session?.token ?? null,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthSession = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthSession deve ser usado dentro de AuthProvider');
  }
  return ctx;
};
