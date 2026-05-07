import { IEventRepository } from '../repositories/IEventRepository';
import { Event } from '../entities/Event';

export class GetEventsByFazenda {
  constructor(private readonly repository: IEventRepository) {}

  async execute(fazendaId: string): Promise<Event[]> {
    if (!fazendaId?.trim()) throw new Error('ID da fazenda é obrigatório');
    return this.repository.getByFazenda(fazendaId.trim());
  }
}
