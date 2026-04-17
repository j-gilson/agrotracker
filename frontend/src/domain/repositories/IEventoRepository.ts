import { Evento } from "../entities/Evento";

export interface IEventoRepository {
  findByAnimal(animalId: string): Promise<Evento[]>;
  create(evento: Evento): Promise<Evento>;
}
