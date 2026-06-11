import { describe, expect, it } from 'vitest';
import { resolveActiveFarmId } from './resolveActiveFarmId';

const farms = [{ id: 'farm-1' }, { id: 'farm-2' }];

describe('resolveActiveFarmId', () => {
  it('mantem a fazenda ativa atual quando ela continua disponivel', () => {
    expect(resolveActiveFarmId(farms, 'farm-2', 'farm-1')).toBe('farm-2');
  });

  it('recupera a fazenda persistida quando nao existe selecao atual', () => {
    expect(resolveActiveFarmId(farms, null, 'farm-2')).toBe('farm-2');
  });

  it('seleciona a primeira fazenda quando nao existe selecao valida', () => {
    expect(resolveActiveFarmId(farms, null, null)).toBe('farm-1');
  });

  it('retorna null quando nenhuma fazenda esta disponivel', () => {
    expect(resolveActiveFarmId([], 'farm-1', 'farm-1')).toBeNull();
  });
});
