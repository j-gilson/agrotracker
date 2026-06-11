import { describe, expect, it } from 'vitest';
import { buildHomeStats } from './homeStats';

describe('buildHomeStats', () => {
  it('utiliza a quantidade completa de eventos recebidos', () => {
    expect(buildHomeStats(18, 75)).toEqual({
      animais: 18,
      manejos: 75,
      fazendas: 1,
    });
  });
});
