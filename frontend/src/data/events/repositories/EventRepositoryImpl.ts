import { eventsApi } from '../api/eventsApi';
import { Event } from '../../../domain/events/entities/Event';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { EventType } from '../../../domain/events/types';

export class EventRepositoryImpl implements IEventRepository {
  async getByAnimal(animalId: string): Promise<Event[]> {
    const response = await eventsApi.getByAnimal(animalId);
    return response.events.map(
      (e) =>
        new Event({
          id: e.id,
          animalId: e.animalId,
          fazendaId: e.fazendaId,
          type: e.type,
          description: e.description,
          date: new Date(e.date),
          createdBy: e.createdBy,
          createdAt: new Date(e.createdAt),
        })
    );
  }

  async getByFazenda(fazendaId: string): Promise<Event[]> {
    const response = await eventsApi.getByFazenda(fazendaId);
    return response.events.map(
      (e) =>
        new Event({
          id: e.id,
          animalId: e.animalId,
          fazendaId: e.fazendaId,
          type: e.type,
          description: e.description,
          date: new Date(e.date),
          createdBy: e.createdBy,
          createdAt: new Date(e.createdAt),
        })
    );
  }

  async create(input: { animalId: string; fazendaId: string; type: EventType; description: string; date: Date }): Promise<Event> {
    const response = await eventsApi.create({
      animalId: input.animalId,
      fazendaId: input.fazendaId,
      type: input.type,
      description: input.description,
      date: input.date.toISOString(),
    });

    const e = response.event;
    return new Event({
      id: e.id,
      animalId: e.animalId,
      fazendaId: e.fazendaId,
      type: e.type,
      description: e.description,
      date: new Date(e.date),
      createdBy: e.createdBy,
      createdAt: new Date(e.createdAt),
    });
  }
}
