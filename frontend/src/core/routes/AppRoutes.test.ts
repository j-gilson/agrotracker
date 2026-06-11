import { existsSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from './AppRoutes';

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
    const appDir = path.resolve(process.cwd(), 'app');

    expect(existsSync(path.join(appDir, 'manejos.tsx'))).toBe(true);
    expect(existsSync(path.join(appDir, 'animal', '[id].tsx'))).toBe(true);
    expect(
      existsSync(path.join(appDir, 'animal', '[id]', 'event', 'create.tsx'))
    ).toBe(true);
  });

  it('mantem a rota usada pelo Scanner para abrir a ficha do animal', () => {
    expect(AppRoutes.ANIMAL_DETAIL('animal-scanner')).toEqual({
      pathname: '/animal/[id]',
      params: { id: 'animal-scanner' },
    });
  });
});
