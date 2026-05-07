import { IMembershipRepository } from '../repositories/IMembershipRepository';
import { FazendaMember } from '../entities/FazendaMember';

export class GetMembersByFazenda {
  constructor(private membershipRepository: IMembershipRepository) {}

  async execute(fazendaId: string): Promise<FazendaMember[]> {
    const id = fazendaId?.trim() ?? '';
    if (!id) throw new Error('Fazenda invalida.');
    return this.membershipRepository.getMembers(id);
  }
}

