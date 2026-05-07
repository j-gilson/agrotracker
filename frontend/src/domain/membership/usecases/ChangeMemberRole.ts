import { IMembershipRepository } from '../repositories/IMembershipRepository';
import { MemberRole } from '../types';

export class ChangeMemberRole {
  constructor(private membershipRepository: IMembershipRepository) {}

  async execute(fazendaId: string, memberId: string, role: MemberRole): Promise<void> {
    const id = fazendaId?.trim() ?? '';
    const mId = memberId?.trim() ?? '';
    if (!id || !mId) throw new Error('Dados invalidos.');
    return this.membershipRepository.changeRole(id, mId, role);
  }
}

