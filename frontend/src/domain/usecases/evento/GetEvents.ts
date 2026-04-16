import { IEventoRepository } from "../../repositories/IEventoRepository";
import { Evento } from "../../entities/Evento";

export class GetEvents {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(animalId: string): Promise<Evento[]> {
    if (!animalId) throw new Error("ID do animal é obrigatório");
    return await this.eventoRepository.findByAnimal(animalId);
  }
}
