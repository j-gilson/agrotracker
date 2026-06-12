import { describe, expect, it, vi } from 'vitest';
import { useUpdateAnimal } from './useUpdateAnimal';

vi.mock('../../data/repositories/AnimalRepositoryImpl', () => ({
  AnimalRepositoryImpl: vi.fn(function () {
    return { update: vi.fn() };
  }),
}));

vi.mock('../../core/utils/humanizeError', () => ({
  humanizeError: vi.fn((_err: unknown, fallback: string) => fallback),
}));

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();

  return {
    ...actual,
    useState: vi.fn(function (initial: unknown) {
      const entry: [unknown, (v: unknown) => void] = [
        initial,
        (v: unknown) => {
          entry[0] = typeof v === 'function' ? (v as (prev: unknown) => unknown)(entry[0]) : v;
        },
      ];
      return entry;
    }),
    useMemo: vi.fn((fn: () => unknown) => fn()),
    useCallback: vi.fn((fn: () => unknown) => fn),
    useEffect: vi.fn(),
  };
});

describe('useUpdateAnimal', () => {
  it('retorna estrutura inicial correta', () => {
    const hook = useUpdateAnimal();

    expect(hook).toHaveProperty('updateAnimal');
    expect(hook).toHaveProperty('updatedAnimal');
    expect(hook).toHaveProperty('loading');
    expect(hook).toHaveProperty('error');
    expect(hook).toHaveProperty('success');
    expect(hook).toHaveProperty('resetState');

    expect(typeof hook.updateAnimal).toBe('function');
    expect(typeof hook.resetState).toBe('function');
  });

  it('updateAnimal retorna o animal atualizado em caso de sucesso', async () => {
    const mockAnimal = {
      id: 'animal-1',
      fazendaId: 'fazenda-1',
      codigoIdentificacao: 'BRINCO-001',
      nome: 'Atualizado',
      raca: 'Angus',
      peso: 500,
      dataNascimento: new Date('2020-06-15'),
      status: 'ATIVO' as const,
      dataCriacao: new Date('2024-01-01'),
      idade: 4,
    };

    vi.mocked(
      (await import('../../data/repositories/AnimalRepositoryImpl'))
        .AnimalRepositoryImpl
    ).mockImplementation(function () {
      return {
        update: vi.fn().mockResolvedValue(mockAnimal),
        findAllByFazenda: vi.fn(),
        findById: vi.fn(),
        findByCodigoIdentificacao: vi.fn(),
        create: vi.fn(),
      };
    });

    const hook = useUpdateAnimal();
    const result = await hook.updateAnimal('animal-1', {
      nome: 'Atualizado',
      raca: 'Angus',
      peso: 500,
      status: 'ATIVO',
    });

    expect(result).toBe(mockAnimal);
  });

  it('updateAnimal retorna null em caso de erro', async () => {
    vi.mocked(
      (await import('../../data/repositories/AnimalRepositoryImpl'))
        .AnimalRepositoryImpl
    ).mockImplementation(function () {
      return {
        update: vi.fn().mockRejectedValue(new Error('Erro no servidor')),
        findAllByFazenda: vi.fn(),
        findById: vi.fn(),
        findByCodigoIdentificacao: vi.fn(),
        create: vi.fn(),
      };
    });

    const hook = useUpdateAnimal();
    const result = await hook.updateAnimal('animal-1', {
      nome: 'Teste',
      raca: 'Nelore',
      peso: 450,
      status: 'ATIVO',
    });

    expect(result).toBeNull();
  });
});
