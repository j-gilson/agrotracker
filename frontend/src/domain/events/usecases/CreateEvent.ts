import { Event } from '../entities/Event';
import { IEventRepository } from '../repositories/IEventRepository';
import { EventType, isEventType } from '../types';

export interface CreateEventInput {
  animalId: string;
  fazendaId: string;
  type: EventType;
  description: string;
  date: Date;
}

export class CreateEvent {
  constructor(private readonly repository: IEventRepository) {}

  async execute(input: CreateEventInput): Promise<Event> {
    if (!input.animalId?.trim()) throw new Error('ID do animal é obrigatório');
    if (!input.fazendaId?.trim()) throw new Error('ID da fazenda é obrigatório');
    if (!isEventType(input.type)) throw new Error('Tipo de evento inválido');
    if (!input.description?.trim()) throw new Error('Descrição é obrigatória');

    return this.repository.create({
      animalId: input.animalId.trim(),
      fazendaId: input.fazendaId.trim(),
      type: input.type,
      description: input.description.trim(),
      date: input.date,
    });
  }
}
