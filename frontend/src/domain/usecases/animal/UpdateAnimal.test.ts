import { describe, expect, it, vi } from 'vitest';
import { UpdateAnimal } from './UpdateAnimal';
import { IAnimalRepository } from '../../repositories/IAnimalRepository';
import { Animal } from '../../entities/Animal';

describe('UpdateAnimal', () => {
  it('chama repository.update com id e dados corretos', async () => {
    const mockAnimal = new Animal({
      id: 'animal-1',
      fazendaId: 'fazenda-1',
      codigoIdentificacao: 'BRINCO-001',
      nome: 'Mimosa',
      raca: 'Nelore',
      peso: 450,
      dataNascimento: new Date('2020-01-01'),
      status: 'ATIVO',
      dataCriacao: new Date('2024-01-01'),
    });

    const repository: IAnimalRepository = {
      findAllByFazenda: vi.fn(),
      findById: vi.fn(),
      findByCodigoIdentificacao: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue(mockAnimal),
    };

    const useCase = new UpdateAnimal(repository);

    const result = await useCase.execute('animal-1', {
      nome: 'Mimosa Atualizada',
      raca: 'Angus',
      peso: 480,
      status: 'ATIVO',
    });

    expect(repository.update).toHaveBeenCalledWith('animal-1', {
      nome: 'Mimosa Atualizada',
      raca: 'Angus',
      peso: 480,
      status: 'ATIVO',
    });

    expect(result).toBe(mockAnimal);
  });
});
