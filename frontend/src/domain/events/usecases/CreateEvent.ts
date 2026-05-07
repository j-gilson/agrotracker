import { Event } from '../entities/Event';
import { IEventRepository } from '../repositories/IEventRepository';

export interface CreateEventInput {
  animalId: string;
  fazendaId: string;
  type: string;
  description: string;
  date: Date;
}

export class CreateEvent {
  constructor(private readonly repository: IEventRepository) {}

  async execute(input: CreateEventInput): Promise<Event> {
    if (!input.animalId?.trim()) throw new Error('ID do animal é obrigatório');
    if (!input.fazendaId?.trim()) throw new Error('ID da fazenda é obrigatório');
    if (!input.type?.trim()) throw new Error('Tipo do evento é obrigatório');
    if (!input.description?.trim()) throw new Error('Descrição é obrigatória');

    return this.repository.create({
      animalId: input.animalId.trim(),
      fazendaId: input.fazendaId.trim(),
      type: input.type.trim(),
      description: input.description.trim(),
      date: input.date,
    });
  }
}
