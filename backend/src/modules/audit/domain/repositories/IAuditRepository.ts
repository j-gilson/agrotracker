import { AuditLog } from "../entities/AuditLog";
import { AuditAction, AuditEntityType } from "../types";

export interface AuditLogFilters {
  fazendaId?: string;
  userId?: string;
  action?: AuditAction;
  entityType?: AuditEntityType;
  startDate?: Date;
  endDate?: Date;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface IAuditRepository {
  save(log: AuditLog): Promise<void>;
  find(filters: AuditLogFilters, page: number, pageSize: number): Promise<PagedResult<AuditLog>>;
  findByEntity(entityType: AuditEntityType, entityId: string): Promise<AuditLog[]>;
}
