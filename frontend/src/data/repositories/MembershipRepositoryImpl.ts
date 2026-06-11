import { membershipApi } from '../api/membershipApi';
import { FazendaMember } from '../../domain/membership/entities/FazendaMember';
import { Invite } from '../../domain/membership/entities/Invite';
import { IMembershipRepository } from '../../domain/membership/repositories/IMembershipRepository';
import { MemberRole } from '../../domain/membership/types';

export class MembershipRepositoryImpl implements IMembershipRepository {
  async inviteUser(fazendaId: string, email: string, role: MemberRole): Promise<Invite> {
    const response = await membershipApi.inviteUser(fazendaId, { email, role });
    const invite = response.invite;

    return new Invite({
      id: invite.id,
      fazendaId: invite.fazendaId,
      fazendaNome: invite.fazendaNome,
      email: invite.email,
      role: invite.role,
      token: invite.token,
      status: invite.status,
      createdAt: new Date(invite.createdAt),
    });
  }

  async getMembers(fazendaId: string): Promise<FazendaMember[]> {
    const response = await membershipApi.getMembers(fazendaId);
    return response.members.map(
      (m) =>
        new FazendaMember({
          id: m.id,
          fazendaId: m.fazendaId,
          userId: m.userId,
          nome: m.nome,
          email: m.email,
          role: m.role,
          active: m.active,
          createdAt: new Date(m.createdAt),
        })
    );
  }

  async getMyMembership(
    fazendaId: string
  ): Promise<{ role: MemberRole; active: boolean }> {
    const response = await membershipApi.getMyMembership(fazendaId);

    return {
      role: response.member.role,
      active: response.member.active,
    };
  }

  async changeRole(fazendaId: string, memberId: string, role: MemberRole): Promise<void> {
    await membershipApi.changeRole(fazendaId, memberId, role);
  }

  async toggleActive(fazendaId: string, memberId: string): Promise<void> {
    await membershipApi.toggleActive(fazendaId, memberId);
  }

  async removeMember(fazendaId: string, memberId: string): Promise<void> {
    await membershipApi.removeMember(fazendaId, memberId);
  }

  async acceptInvite(token: string): Promise<void> {
    await membershipApi.acceptInvite(token);
  }

  async getPendingInvites(): Promise<Invite[]> {
    const response = await membershipApi.getPendingInvites();

    return response.invites.map(
      (invite) =>
        new Invite({
          id: invite.id,
          fazendaId: invite.fazendaId,
          fazendaNome: invite.fazendaNome,
          email: invite.email,
          role: invite.role,
          token: invite.token,
          status: invite.status,
          createdAt: new Date(invite.createdAt),
        })
    );
  }

  async rejectInvite(inviteId: string): Promise<void> {
    await membershipApi.rejectInvite(inviteId);
  }
}
