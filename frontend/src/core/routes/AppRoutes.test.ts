import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from './AppRoutes';

const projectRoot = process.cwd();

describe('rotas de Eventos', () => {
  it('mantem acessiveis as rotas de manejos, ficha e criacao de evento', () => {
    expect(AppRoutes.MANEJOS).toBe('/manejos');
    expect(AppRoutes.ANIMAL_DETAIL('animal-1')).toEqual({
      pathname: '/animal/[id]',
      params: { id: 'animal-1' },
    });
    expect(AppRoutes.CREATE_EVENT('animal-1', 'fazenda-1')).toEqual({
      pathname: '/animal/[id]/event/create',
      params: {
        id: 'animal-1',
        animalId: 'animal-1',
        fazendaId: 'fazenda-1',
      },
    });
  });

  it('possui arquivos Expo Router para todas as rotas do fluxo', () => {
    const appDir = path.resolve(projectRoot, 'app');

    expect(existsSync(path.join(appDir, 'manejos.tsx'))).toBe(true);
    expect(existsSync(path.join(appDir, 'animal', '[id].tsx'))).toBe(true);
    expect(
      existsSync(path.join(appDir, 'animal', '[id]', 'event', 'create.tsx'))
    ).toBe(true);
    expect(
      existsSync(path.join(appDir, 'animal', '[id]', 'edit.tsx'))
    ).toBe(true);
  });

  it('possui rota de edicao de animal', () => {
    expect(AppRoutes.EDIT_ANIMAL('animal-1')).toEqual({
      pathname: '/animal/[id]/edit',
      params: { id: 'animal-1' },
    });
  });
});

describe('Sprint 6.2.4.2 — UX e Limpeza', () => {
  it('Cenario 1: AnimalDetailScreen nao possui elemento visual sem comportamento (aba Historico removida)', () => {
    const filePath = path.resolve(
      projectRoot,
      'src/presentation/screens/AnimalDetailScreen.tsx'
    );
    const content = readFileSync(filePath, 'utf-8');
    expect(content).not.toContain('Historico');
    expect(content).toContain('Histórico de Manejos');
  });

  it('Cenario 2: FazendaListScreen nao possui fetch duplicado (nao importa useFazendas)', () => {
    const filePath = path.resolve(
      projectRoot,
      'src/presentation/screens/FazendaListScreen.tsx'
    );
    const content = readFileSync(filePath, 'utf-8');
    expect(content).not.toContain('useFazendas');
    expect(content).toContain('useActiveFarm');
  });

  it('Cenario 3: AuthScreen removido — nenhuma rota quebrada', () => {
    const filePath = path.resolve(
      projectRoot,
      'src/presentation/screens/AuthScreen.tsx'
    );
    expect(existsSync(filePath)).toBe(false);
  });

  it('Cenario 4: SCANNER removido — navegacao continua funcionando', () => {
    expect(AppRoutes.SCANNER_WITH_FAZENDA('fazenda-1')).toEqual({
      pathname: '/scanner',
      params: { fazendaId: 'fazenda-1' },
    });
    expect(AppRoutes.HOME).toBe('/');
    expect(AppRoutes.ANIMAL_LIST).toBe('/animal');
  });

  it('Cenario 7: Regressao — rotas principais continuam acessiveis', () => {
    expect(AppRoutes.AUTH).toBe('/auth');
    expect(AppRoutes.REGISTER).toBe('/auth/register');
    expect(AppRoutes.PROFILE).toBe('/profile');
    expect(AppRoutes.FAZENDAS).toBe('/fazendas');
    expect(AppRoutes.CREATE_FAZENDA).toBe('/fazendas/create');
    expect(AppRoutes.FAZENDA_TEAM).toBe('/fazenda/team');
    expect(AppRoutes.FAZENDA_TEAM_INVITE).toBe('/fazenda/team/invite');
    expect(AppRoutes.INVITES).toBe('/invites');
    expect(AppRoutes.INVENTARIO).toBe('/inventario');
    expect(AppRoutes.MANEJOS).toBe('/manejos');
    expect(AppRoutes.CREATE_ANIMAL).toBe('/animal/create');
  });
});
