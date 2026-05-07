import { IMembershipRepository } from '../repositories/IMembershipRepository';

export class RemoveMember {
  constructor(private membershipRepository: IMembershipRepository) {}

  async execute(fazendaId: string, memberId: string): Promise<void> {
    const id = fazendaId?.trim() ?? '';
    const mId = memberId?.trim() ?? '';
    if (!id || !mId) throw new Error('Dados invalidos.');
    return this.membershipRepository.removeMember(id, mId);
  }
}

