import { Event } from "../entities/Event";

export interface IEventRepository {
  save(event: Event): Promise<Event>;
  findByAnimalId(animalId: string): Promise<Event[]>;
  findByFazendaId(fazendaId: string): Promise<Event[]>;
}
