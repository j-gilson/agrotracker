import { apiClient } from '../../../core/network/ApiClient';

export type AuditChangeResponse = {
  field: string;
  before: unknown;
  after: unknown;
};

export type AuditLogResponse = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  fazendaId: string | null;
  fazendaNome: string | null;
  entityType: string;
  entityId: string | null;
  action: string;
  description: string;
  metadata?: unknown;
  changes?: AuditChangeResponse[] | null;
  before?: unknown;
  after?: unknown;
  timestamp?: string;
  createdAt: string;
};

export type PagedAuditResponse = {
  success: boolean;
  page: number;
  pageSize: number;
  total: number;
  items: AuditLogResponse[];
};

export const auditApi = {
  async getByEntity(entityType: string, entityId: string, params?: { page?: number; limit?: number }): Promise<PagedAuditResponse> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    return apiClient.get<PagedAuditResponse>(
      `/audit/entity/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}/timeline?page=${page}&limit=${limit}`
    );
  },

  async getByFazenda(fazendaId: string, params?: { page?: number; limit?: number; startDate?: string; endDate?: string }): Promise<PagedAuditResponse> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    let url = `/audit/fazenda/${encodeURIComponent(fazendaId)}?page=${page}&limit=${limit}`;
    if (params?.startDate) url += `&startDate=${params.startDate}`;
    if (params?.endDate) url += `&endDate=${params.endDate}`;
    return apiClient.get<PagedAuditResponse>(url);
  },

  async getByUser(userId: string, params?: { page?: number; limit?: number; startDate?: string; endDate?: string }): Promise<PagedAuditResponse> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    let url = `/audit/user/${encodeURIComponent(userId)}?page=${page}&limit=${limit}`;
    if (params?.startDate) url += `&startDate=${params.startDate}`;
    if (params?.endDate) url += `&endDate=${params.endDate}`;
    return apiClient.get<PagedAuditResponse>(url);
  },
};
