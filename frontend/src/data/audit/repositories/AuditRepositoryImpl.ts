import { auditApi } from '../api/auditApi';
import { AuditLog, AuditLogProps } from '../../../domain/audit/entities/AuditLog';
import { IAuditRepository, PagedAudit } from '../../../domain/audit/repositories/IAuditRepository';

const toDomain = (dto: any): AuditLog => {
  const props: AuditLogProps = {
    id: dto.id,
    entityType: dto.entityType,
    entityId: dto.entityId ?? null,
    action: dto.action,
    userId: dto.userId,
    userName: dto.userName,
    userEmail: dto.userEmail,
    fazendaId: dto.fazendaId ?? null,
    fazendaNome: dto.fazendaNome ?? null,
    description: dto.description,
    before: dto.before ?? null,
    after: dto.after ?? null,
    metadata: dto.metadata ?? null,
    changes: dto.changes ?? null,
    timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(dto.createdAt),
    createdAt: new Date(dto.createdAt),
  };
  return new AuditLog(props);
};

export class AuditRepositoryImpl implements IAuditRepository {
  async getByEntity(entityType: string, entityId: string, params?: { page?: number; limit?: number }): Promise<PagedAudit> {
    const response = await auditApi.getByEntity(entityType, entityId, params);
    return {
      items: response.items.map(toDomain),
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
    };
  }

  async getByFazenda(fazendaId: string, params?: { page?: number; limit?: number; startDate?: string; endDate?: string }): Promise<PagedAudit> {
    const response = await auditApi.getByFazenda(fazendaId, params);
    return {
      items: response.items.map(toDomain),
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
    };
  }

  async getByUser(userId: string, params?: { page?: number; limit?: number; startDate?: string; endDate?: string }): Promise<PagedAudit> {
    const response = await auditApi.getByUser(userId, params);
    return {
      items: response.items.map(toDomain),
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
    };
  }
}
