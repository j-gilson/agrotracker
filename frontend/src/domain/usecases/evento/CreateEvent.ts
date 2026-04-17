import { IEventoRepository } from "../../repositories/IEventoRepository";
import { Evento, EventoProps } from "../../entities/Evento";

export class CreateEvent {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(data: EventoProps): Promise<Evento> {
    const evento = new Evento(data);
    return await this.eventoRepository.create(evento);
  }
}
