import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { router } from 'expo-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { confirmLogout, executeLogout, navigateToInvites } from './ProfileScreen';

vi.mock('expo-router', () => ({
  router: {
    push: vi.fn(),
  },
}));

vi.mock('react-native', () => ({
  Alert: {
    alert: vi.fn(),
  },
  SafeAreaView: 'SafeAreaView',
  Text: 'Text',
  View: 'View',
  StyleSheet: {
    create: <T,>(styles: T) => styles,
  },
}));

vi.mock('../components', () => ({
  Button: 'Button',
  Card: 'Card',
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuthSession: vi.fn(),
}));

const projectRoot = process.cwd();
const profileScreenPath = path.resolve(
  projectRoot,
  'src/presentation/screens/ProfileScreen.tsx'
);
const profileRoutePath = path.resolve(projectRoot, 'app/profile.tsx');
const homeScreenPath = path.resolve(
  projectRoot,
  'src/presentation/screens/HomeScreen.tsx'
);
const authContextPath = path.resolve(
  projectRoot,
  'src/presentation/contexts/AuthContext.tsx'
);

describe('Sprint 7.3.2.2 — Perfil e Logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Cenario 1: PROFILE existe em AppRoutes', () => {
    expect(AppRoutes.PROFILE).toBe('/profile');
  });

  it('Cenario 2: arquivo profile.tsx existe', () => {
    expect(existsSync(profileRoutePath)).toBe(true);
    expect(readFileSync(profileRoutePath, 'utf-8')).toContain('ProfileScreen');
  });

  it('Cenario 3: ProfileScreen exibe o usuario autenticado', () => {
    const content = readFileSync(profileScreenPath, 'utf-8');

    expect(content).toContain('useAuthSession()');
    expect(content).toContain('user?.nome');
    expect(content).toContain('user?.email');
  });

  it('Cenario 4: botao Convites navega para AppRoutes.INVITES', () => {
    const content = readFileSync(profileScreenPath, 'utf-8');

    navigateToInvites();

    expect(content).toContain('title="Meus Convites"');
    expect(router.push).toHaveBeenCalledWith({
      pathname: AppRoutes.INVITES,
    });
  });

  it('Cenario 5: botao Logout executa logout()', async () => {
    const content = readFileSync(profileScreenPath, 'utf-8');
    const logout = vi.fn().mockResolvedValue(undefined);

    await executeLogout(logout);

    expect(content).toContain('title="Sair"');
    expect(content).toContain('confirmLogout(logout)');
    expect(logout).toHaveBeenCalledOnce();
  });

  it('Cenario 6: acesso ao Perfil existe com e sem fazendas', () => {
    const content = readFileSync(homeScreenPath, 'utf-8');
    const profileAccessCount = content.split('<ProfileAccess />').length - 1;

    expect(content).toContain('if (farms.length === 0)');
    expect(content).toContain('router.push(AppRoutes.PROFILE as Href)');
    expect(profileAccessCount).toBe(2);
  });
});

describe('Sprint 7.4.3.2.2 — confirmacao de Logout', () => {
  it('Cenario 1: tocar em Sair exibe confirmacao', () => {
    const logout = vi.fn().mockResolvedValue(undefined);
    const showAlert = vi.fn();

    confirmLogout(logout, showAlert);

    expect(showAlert).toHaveBeenCalledWith(
      'Sair da conta',
      'Deseja realmente sair da sua conta?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancelar', style: 'cancel' }),
        expect.objectContaining({ text: 'Sair', style: 'destructive' }),
      ])
    );
    expect(logout).not.toHaveBeenCalled();
  });

  it('Cenario 2: cancelar permanece logado e nao executa logout', () => {
    const logout = vi.fn().mockResolvedValue(undefined);
    const showAlert = vi.fn();

    confirmLogout(logout, showAlert);

    const buttons = showAlert.mock.calls[0][2];
    const cancelButton = buttons.find(
      (button: { text?: string }) => button.text === 'Cancelar'
    );

    cancelButton.onPress?.();

    expect(logout).not.toHaveBeenCalled();
  });

  it('Cenario 3: confirmar executa o mesmo logout atual', () => {
    const logout = vi.fn().mockResolvedValue(undefined);
    const showAlert = vi.fn();

    confirmLogout(logout, showAlert);

    const buttons = showAlert.mock.calls[0][2];
    const logoutButton = buttons.find(
      (button: { text?: string }) => button.text === 'Sair'
    );

    logoutButton.onPress?.();

    expect(logout).toHaveBeenCalledOnce();
  });

  it('Cenarios 4, 5 e 6: remocao de sessao, fazenda ativa e redirecionamento seguem no AuthContext', () => {
    const content = readFileSync(authContextPath, 'utf-8');

    expect(content).toContain('sessionStore.clear()');
    expect(content).toContain('activeFarmStore.clear()');
    expect(content).toContain("setStatus('unauthenticated')");
  });
});
