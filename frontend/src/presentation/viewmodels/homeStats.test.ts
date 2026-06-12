import { describe, expect, it } from 'vitest';
import { buildHomeStats } from './homeStats';

describe('buildHomeStats', () => {
  it('utiliza a quantidade completa de eventos recebidos', () => {
    expect(buildHomeStats(18, 75, 1)).toEqual({
      animais: 18,
      manejos: 75,
      fazendas: 1,
    });
  });

  it('retorna a quantidade correta de fazendas quando ha multiplas fazendas', () => {
    expect(buildHomeStats(50, 120, 3)).toEqual({
      animais: 50,
      manejos: 120,
      fazendas: 3,
    });
  });
});
