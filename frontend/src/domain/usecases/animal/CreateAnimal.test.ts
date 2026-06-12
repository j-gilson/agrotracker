import { describe, expect, it, vi } from 'vitest';
import { CreateAnimal } from './CreateAnimal';
import { IAnimalRepository } from '../../repositories/IAnimalRepository';
import { Animal } from '../../entities/Animal';

describe('CreateAnimal', () => {
  it('chama repository.create com os dados corretos', async () => {
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
      create: vi.fn().mockResolvedValue(mockAnimal),
      update: vi.fn(),
    };

    const useCase = new CreateAnimal(repository);

    const result = await useCase.execute({
      fazendaId: 'fazenda-1',
      codigoIdentificacao: 'BRINCO-001',
      nome: 'Mimosa',
      raca: 'Nelore',
      peso: 450,
      dataNascimento: new Date('2020-01-01'),
    });

    expect(repository.create).toHaveBeenCalledWith({
      fazendaId: 'fazenda-1',
      codigoIdentificacao: 'BRINCO-001',
      nome: 'Mimosa',
      raca: 'Nelore',
      peso: 450,
      dataNascimento: new Date('2020-01-01'),
    });

    expect(result).toBe(mockAnimal);
  });
});
