import { IEventRepository } from '../repositories/IEventRepository';
import { Event } from '../entities/Event';

export class GetEventsByAnimal {
  constructor(private readonly repository: IEventRepository) {}

  async execute(animalId: string): Promise<Event[]> {
    if (!animalId?.trim()) throw new Error('ID do animal é obrigatório');
    return this.repository.getByAnimal(animalId.trim());
  }
}
