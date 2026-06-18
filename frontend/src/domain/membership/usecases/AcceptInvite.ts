import { IMembershipRepository } from '../repositories/IMembershipRepository';

export class AcceptInvite {
  constructor(private membershipRepository: IMembershipRepository) {}

  async execute(token: string): Promise<{ fazendaId: string }> {
    const value = token?.trim() ?? '';
    if (!value) throw new Error('Token invalido.');
    return this.membershipRepository.acceptInvite(value);
  }
}
