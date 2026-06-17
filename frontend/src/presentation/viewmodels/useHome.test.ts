import { describe, expect, it, vi } from 'vitest';
import { Event } from '../../domain/events/entities/Event';
import { selectLatestEvents } from './useHome';

vi.mock('../../data/repositories/AnimalRepositoryImpl', () => ({
  AnimalRepositoryImpl: vi.fn(),
}));

vi.mock('../../data/events/repositories/EventRepositoryImpl', () => ({
  EventRepositoryImpl: vi.fn(),
}));

const makeEvent = (id: string, date: string) =>
  new Event({
    id,
    animalId: `animal-${id}`,
    fazendaId: 'fazenda-1',
    type: 'VACINACAO',
    description: `Manejo ${id}`,
    date: new Date(date),
    createdBy: 'user-1',
    createdAt: new Date(date),
  });

describe('selectLatestEvents', () => {
  it('retorna apenas os tres eventos mais recentes por data', () => {
    const result = selectLatestEvents([
      makeEvent('1', '2026-06-10T10:00:00.000Z'),
      makeEvent('2', '2026-06-13T10:00:00.000Z'),
      makeEvent('3', '2026-06-11T10:00:00.000Z'),
      makeEvent('4', '2026-06-16T10:00:00.000Z'),
    ]);

    expect(result.map((event) => event.id)).toEqual(['4', '2', '3']);
  });

  it('nao altera a ordem do array original recebido pelo useHome', () => {
    const events = [
      makeEvent('1', '2026-06-10T10:00:00.000Z'),
      makeEvent('2', '2026-06-13T10:00:00.000Z'),
    ];

    selectLatestEvents(events);

    expect(events.map((event) => event.id)).toEqual(['1', '2']);
  });
});
