import { IMembershipRepository } from '../repositories/IMembershipRepository';

export class RejectInvite {
  constructor(private membershipRepository: IMembershipRepository) {}

  async execute(inviteId: string): Promise<void> {
    const id = inviteId?.trim() ?? '';
    if (!id) throw new Error('Convite invalido.');
    return this.membershipRepository.rejectInvite(id);
  }
}
