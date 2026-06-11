import { describe, expect, it, vi } from 'vitest';
import { Event } from '../entities/Event';
import { IEventRepository } from '../repositories/IEventRepository';
import { CreateEvent } from './CreateEvent';

describe('CreateEvent frontend', () => {
  it('cria evento a partir do fluxo da ficha do animal', async () => {
    const created = new Event({
      id: 'event-1',
      animalId: 'animal-1',
      fazendaId: 'fazenda-1',
      type: 'VACINACAO',
      description: 'Vacina anual',
      date: new Date('2026-06-11T12:00:00.000Z'),
      createdBy: 'user-1',
      createdAt: new Date('2026-06-11T12:00:00.000Z'),
    });
    const repository = {
      create: vi.fn(async () => created),
    } as unknown as IEventRepository;
    const useCase = new CreateEvent(repository);

    const result = await useCase.execute({
      animalId: 'animal-1',
      fazendaId: 'fazenda-1',
      type: 'VACINACAO',
      description: 'Vacina anual',
      date: new Date('2026-06-11T12:00:00.000Z'),
    });

    expect(result).toBe(created);
    expect(repository.create).toHaveBeenCalledWith({
      animalId: 'animal-1',
      fazendaId: 'fazenda-1',
      type: 'VACINACAO',
      description: 'Vacina anual',
      date: new Date('2026-06-11T12:00:00.000Z'),
    });
  });
});
