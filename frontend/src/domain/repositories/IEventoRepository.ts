import { Evento } from "../entities/Evento";

export interface IEventoRepository {
  findByAnimal(animalId: string): Promise<Evento[]>;
  save(evento: Evento): Promise<Evento>;
}
