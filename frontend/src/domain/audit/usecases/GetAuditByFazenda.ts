import { IAuditRepository } from '../repositories/IAuditRepository';

export class GetAuditByFazenda {
  constructor(private readonly repository: IAuditRepository) {}

  async execute(fazendaId: string, params?: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
    if (!fazendaId?.trim()) throw new Error('ID da fazenda é obrigatório');
    return this.repository.getByFazenda(fazendaId.trim(), params);
  }
}
