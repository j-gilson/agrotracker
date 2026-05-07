import { IAuditRepository } from "../../domain/repositories/IAuditRepository";
import { AuditEntityType } from "../../domain/types";
import { AuditError } from "../errors/AuditError";
import { AuditLog } from "../../domain/entities/AuditLog";

export class GetEntityHistory {
  constructor(private readonly auditRepository: IAuditRepository) {}

  async execute(entityType: AuditEntityType, entityId: string): Promise<AuditLog[]> {
    const id = entityId?.trim() ?? "";
    if (!id) throw new AuditError("Entidade invalida.", 400);
    if (!entityType) throw new AuditError("Tipo invalido.", 400);

    return this.auditRepository.findByEntity(entityType, id);
  }
}

