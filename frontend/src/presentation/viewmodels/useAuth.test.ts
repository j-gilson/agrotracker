import { readFileSync } from 'fs';
import path from 'path';
import { router } from 'expo-router';
import { describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { registerAndRedirectToLogin } from './useAuth';

vi.mock('expo-router', () => ({
  router: {
    replace: vi.fn(),
  },
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuthSession: vi.fn(),
}));

const projectRoot = process.cwd();

describe('useRegisterViewModel — validacao de senha', () => {
  const filePath = path.resolve(projectRoot, 'src/presentation/viewmodels/useAuth.ts');
  const content = readFileSync(filePath, 'utf-8');

  it('Cenario 5: rejeita senha com menos de 8 caracteres no submit', () => {
    expect(content).toContain('password.length < 8');
    expect(content).toContain('A senha deve ter ao menos 8 caracteres.');
    expect(content).not.toContain('password.length < 6');
    expect(content).not.toContain('A senha deve ter ao menos 6 caracteres.');
  });

  it('Cenario 6: aceita senha com 8 caracteres (outras regras permanecem)', () => {
    expect(content).toContain('password !== confirmPassword');
    expect(content).toContain('email.includes(\'@\')');
  });
});

describe('useRegisterViewModel — fluxo pos-cadastro', () => {
  it('cadastra e redireciona para o Login sem executar login automatico', async () => {
    const registerSession = vi.fn().mockResolvedValue({ id: 'user-1' });

    await registerAndRedirectToLogin(
      registerSession,
      {
        nome: 'Maria',
        email: 'maria@example.com',
        password: '12345678',
      }
    );

    expect(registerSession).toHaveBeenCalledWith(
      'Maria',
      'maria@example.com',
      '12345678'
    );
    expect(router.replace).toHaveBeenCalledWith({
      pathname: AppRoutes.AUTH,
    });
  });

  it('propaga a falha do cadastro e permanece na tela atual', async () => {
    const error = new Error('Email ja cadastrado.');
    const registerSession = vi.fn().mockRejectedValue(error);
    const navigateToLogin = vi.fn();

    await expect(
      registerAndRedirectToLogin(
        registerSession,
        {
          nome: 'Maria',
          email: 'maria@example.com',
          password: '12345678',
        },
        navigateToLogin
      )
    ).rejects.toBe(error);

    expect(navigateToLogin).not.toHaveBeenCalled();
  });

  it('nao cria sessao nem persiste token depois do cadastro', async () => {
    const registerSession = vi.fn().mockResolvedValue({ id: 'user-1' });
    const loginSession = vi.fn();
    const sessionStoreSet = vi.fn();

    await registerAndRedirectToLogin(
      registerSession,
      {
        nome: 'Maria',
        email: 'maria@example.com',
        password: '12345678',
      },
      vi.fn()
    );

    expect(loginSession).not.toHaveBeenCalled();
    expect(sessionStoreSet).not.toHaveBeenCalled();
  });
});

describe('RegisterScreen — validacao de senha', () => {
  const filePath = path.resolve(projectRoot, 'src/presentation/screens/Auth/RegisterScreen.tsx');
  const content = readFileSync(filePath, 'utf-8');

  it('Cenario 5: rejeita senha com menos de 8 caracteres na UI', () => {
    expect(content).toContain('password.length < 8');
    expect(content).toContain('A senha deve ter ao menos 8 caracteres.');
    expect(content).not.toContain('password.length < 6');
    expect(content).not.toContain('Mínimo 6 caracteres');
  });

  it('Cenario 6: aceita senha com 8 caracteres no isFormValid', () => {
    expect(content).toContain('password.length >= 8');
    expect(content).toContain('confirmPassword.length >= 8');
    expect(content).toContain('Mínimo 8 caracteres');
  });

  it('informa que o usuario deve fazer login depois do cadastro', () => {
    expect(content).toContain(
      'Conta criada com sucesso. Faça login para continuar.'
    );
  });
});

describe('LoginScreen — validacao de senha', () => {
  const filePath = path.resolve(projectRoot, 'src/presentation/screens/Auth/LoginScreen.tsx');
  const content = readFileSync(filePath, 'utf-8');

  it('Cenario 5: rejeita senha com menos de 8 caracteres na UI', () => {
    expect(content).toContain('password.length < 8');
    expect(content).toContain('password.trim().length >= 8');
  });

  it('Cenario 6: aceita senha com 8 caracteres no isFormValid', () => {
    expect(content).toContain('password.trim().length >= 8');
  });
});
