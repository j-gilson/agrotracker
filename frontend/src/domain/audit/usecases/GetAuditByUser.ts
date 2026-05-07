import { IAuditRepository } from '../repositories/IAuditRepository';

export class GetAuditByUser {
  constructor(private readonly repository: IAuditRepository) {}

  async execute(userId: string, params?: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
    if (!userId?.trim()) throw new Error('ID do usuário é obrigatório');
    return this.repository.getByUser(userId.trim(), params);
  }
}
