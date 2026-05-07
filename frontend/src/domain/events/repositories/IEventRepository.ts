import { Event } from '../entities/Event';

export interface IEventRepository {
  getByAnimal(animalId: string): Promise<Event[]>;
  getByFazenda(fazendaId: string): Promise<Event[]>;
  create(input: { animalId: string; fazendaId: string; type: string; description: string; date: Date }): Promise<Event>;
}
