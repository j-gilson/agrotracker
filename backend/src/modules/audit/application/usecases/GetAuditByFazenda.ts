import { IAuditRepository, PagedResult } from "../../domain/repositories/IAuditRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { AuditError } from "../errors/AuditError";

export class GetAuditByFazenda {
  constructor(private readonly auditRepository: IAuditRepository) {}

  async execute(input: { fazendaId: string; page?: number; pageSize?: number }): Promise<PagedResult<AuditLog>> {
    const fazendaId = input.fazendaId?.trim() ?? "";
    if (!fazendaId) throw new AuditError("Fazenda invalida.", 400);

    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(input.pageSize ?? 10, 50);

    return this.auditRepository.find({ fazendaId }, page, pageSize);
  }
}
