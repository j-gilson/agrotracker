import { AuditLog } from '../entities/AuditLog';

export interface PagedAudit {
  items: AuditLog[];
  page: number;
  pageSize: number;
  total: number;
}

export interface IAuditRepository {
  getByEntity(entityType: string, entityId: string, params?: { page?: number; limit?: number }): Promise<PagedAudit>;
  getByFazenda(fazendaId: string, params?: { page?: number; limit?: number; startDate?: string; endDate?: string }): Promise<PagedAudit>;
  getByUser(userId: string, params?: { page?: number; limit?: number; startDate?: string; endDate?: string }): Promise<PagedAudit>;
}
