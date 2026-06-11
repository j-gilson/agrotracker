import { Invite } from '../entities/Invite';
import { IMembershipRepository } from '../repositories/IMembershipRepository';

export class GetPendingInvites {
  constructor(private membershipRepository: IMembershipRepository) {}

  async execute(): Promise<Invite[]> {
    return this.membershipRepository.getPendingInvites();
  }
}
