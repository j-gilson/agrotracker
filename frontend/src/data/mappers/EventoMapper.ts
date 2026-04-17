import { Evento } from "../../domain/entities/Evento";
import { EventoDTO } from "../../domain/dtos/EventoDTO";

export class EventoMapper {
  static toDomain(dto: EventoDTO): Evento {
    return new Evento({
      id: dto.id,
      animalId: dto.animal_id,
      tipoEvento: dto.tipo_evento,
      dataHora: new Date(dto.data_hora),
      pesoKg: dto.peso_kg,
      vacina: dto.vacina,
      observacoes: dto.observacoes,
    });
  }

  static toDTO(entity: Evento): EventoDTO {
    return {
      id: entity.id,
      animal_id: entity.animalId,
      tipo_evento: entity.tipoEvento,
      data_hora: entity.dataHora.toISOString(),
      peso_kg: entity.pesoKg,
      vacina: entity.vacina,
      observacoes: entity.observacoes,
    };
  }
}
