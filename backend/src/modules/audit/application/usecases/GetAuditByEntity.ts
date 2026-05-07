import { IAuditRepository, PagedResult } from "../../domain/repositories/IAuditRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { AuditEntityType } from "../../domain/types";
import { AuditError } from "../errors/AuditError";

export class GetAuditByEntity {
  constructor(private readonly auditRepository: IAuditRepository) {}

  async execute(input: {
    entityType: AuditEntityType;
    entityId: string;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<AuditLog>> {
    const entityId = input.entityId?.trim() ?? "";
    if (!entityId) throw new AuditError("Entidade invalida.", 400);
    if (!input.entityType) throw new AuditError("Tipo invalido.", 400);

    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(input.pageSize ?? 10, 50);

    const all = await this.auditRepository.findByEntity(input.entityType, entityId);
    const sorted = [...all].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const total = sorted.length;
    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    return { items, page, pageSize, total };
  }
}
