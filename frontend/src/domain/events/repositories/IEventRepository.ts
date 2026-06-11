import { Event } from '../entities/Event';
import { EventType } from '../types';

export interface IEventRepository {
  getByAnimal(animalId: string): Promise<Event[]>;
  getByFazenda(fazendaId: string): Promise<Event[]>;
  create(input: { animalId: string; fazendaId: string; type: EventType; description: string; date: Date }): Promise<Event>;
}
