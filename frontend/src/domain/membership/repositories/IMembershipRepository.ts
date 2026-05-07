import { FazendaMember } from '../entities/FazendaMember';
import { Invite } from '../entities/Invite';
import { MemberRole } from '../types';

export interface IMembershipRepository {
  inviteUser(fazendaId: string, email: string, role: MemberRole): Promise<Invite>;
  getMembers(fazendaId: string): Promise<FazendaMember[]>;
  getMyMembership(fazendaId: string): Promise<{ role: MemberRole; active: boolean }>;
  changeRole(fazendaId: string, memberId: string, role: MemberRole): Promise<void>;
  toggleActive(fazendaId: string, memberId: string): Promise<void>;
  removeMember(fazendaId: string, memberId: string): Promise<void>;
  acceptInvite(token: string): Promise<void>;
}
