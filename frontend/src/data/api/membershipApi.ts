import { apiClient } from '../../core/network/ApiClient';

export type MemberRole = 'ADMIN' | 'FUNCIONARIO';

export interface MemberResponse {
  id: string;
  fazendaId: string;
  userId: string;
  nome: string;
  email: string;
  role: MemberRole;
  active: boolean;
  createdAt: string;
}

export interface InviteResponse {
  id: string;
  fazendaId: string;
  fazendaNome?: string;
  email: string;
  role: MemberRole;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'RECUSADO' | 'EXPIRED';
  createdAt: string;
}

export const membershipApi = {
  async inviteUser(fazendaId: string, data: { email: string; role: MemberRole }): Promise<{ success: boolean; invite: InviteResponse }> {
    return apiClient.post<{ success: boolean; invite: InviteResponse }>(`/fazendas/${fazendaId}/invite`, data);
  },

  async getMembers(fazendaId: string): Promise<{ success: boolean; members: MemberResponse[] }> {
    return apiClient.get<{ success: boolean; members: MemberResponse[] }>(`/fazendas/${fazendaId}/members`);
  },

  async getMyMembership(
    fazendaId: string
  ): Promise<{ success: boolean; member: { id: string; fazendaId: string; userId: string; role: MemberRole; active: boolean; createdAt: string } }> {
    return apiClient.get<{ success: boolean; member: { id: string; fazendaId: string; userId: string; role: MemberRole; active: boolean; createdAt: string } }>(
      `/fazendas/${fazendaId}/members/me`
    );
  },

  async changeRole(fazendaId: string, memberId: string, role: MemberRole): Promise<{ success: boolean }> {
    return apiClient.patch<{ success: boolean }>(`/fazendas/${fazendaId}/members/${memberId}/role`, { role });
  },

  async toggleActive(fazendaId: string, memberId: string): Promise<{ success: boolean }> {
    return apiClient.patch<{ success: boolean }>(`/fazendas/${fazendaId}/members/${memberId}/toggle`);
  },

  async removeMember(fazendaId: string, memberId: string): Promise<void> {
    await apiClient.delete<void>(`/fazendas/${fazendaId}/members/${memberId}`);
  },

  async acceptInvite(token: string): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>('/invites/accept', { token });
  },

  async getPendingInvites(): Promise<{ success: boolean; invites: InviteResponse[] }> {
    return apiClient.get<{ success: boolean; invites: InviteResponse[] }>(
      '/invites'
    );
  },

  async rejectInvite(inviteId: string): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(
      `/invites/${inviteId}/reject`
    );
  },
};
