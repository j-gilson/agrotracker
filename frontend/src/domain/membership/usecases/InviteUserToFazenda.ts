import { IMembershipRepository } from '../repositories/IMembershipRepository';
import { Invite } from '../entities/Invite';
import { MemberRole } from '../types';

export class InviteUserToFazenda {
  constructor(private membershipRepository: IMembershipRepository) {}

  async execute(fazendaId: string, email: string, role: MemberRole): Promise<Invite> {
    const id = fazendaId?.trim() ?? '';
    const normalizedEmail = email?.trim().toLowerCase() ?? '';
    if (!id) throw new Error('Fazenda invalida.');
    if (!normalizedEmail || !normalizedEmail.includes('@')) throw new Error('Email invalido.');
    return this.membershipRepository.inviteUser(id, normalizedEmail, role);
  }
}

