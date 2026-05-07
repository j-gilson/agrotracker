import { IAuditRepository } from '../repositories/IAuditRepository';

export class GetAuditByEntity {
  constructor(private readonly repository: IAuditRepository) {}

  async execute(entityType: string, entityId: string, params?: { page?: number; limit?: number }) {
    if (!entityType?.trim()) throw new Error('Tipo de entidade é obrigatório');
    if (!entityId?.trim()) throw new Error('ID da entidade é obrigatório');
    return this.repository.getByEntity(entityType.trim(), entityId.trim(), params);
  }
}
