import { IEventoRepository } from "../../domain/repositories/IEventoRepository";
import { Evento } from "../../domain/entities/Evento";
import { EventoMapper } from "../mappers/EventoMapper";
import { eventoApi } from "../api/eventoApi";

export class EventoRepositoryImpl implements IEventoRepository {
  async findByAnimal(animalId: string): Promise<Evento[]> {
    try {
      const dtos = await eventoApi.fetchEventsByAnimal(animalId);
      return dtos.map(dto => EventoMapper.toDomain(dto));
    } catch (error) {
      console.error(`Erro ao buscar eventos para animal ${animalId}:`, error);
      // Fallback para lista vazia em caso de erro, ou repassar o erro dependendo da política
      return [];
    }
  }

  async create(evento: Evento): Promise<Evento> {
    try {
      const dto = EventoMapper.toDTO(evento);
      const resultDto = await eventoApi.createEvent(dto);
      return EventoMapper.toDomain(resultDto);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  }
}
