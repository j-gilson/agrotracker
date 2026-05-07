import { IAuditRepository, PagedResult } from "../../domain/repositories/IAuditRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { AuditError } from "../errors/AuditError";

export class GetAuditByUser {
  constructor(private readonly auditRepository: IAuditRepository) {}

  async execute(input: { userId: string; page?: number; pageSize?: number }): Promise<PagedResult<AuditLog>> {
    const userId = input.userId?.trim() ?? "";
    if (!userId) throw new AuditError("Usuario invalido.", 400);

    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(input.pageSize ?? 10, 50);

    return this.auditRepository.find({ userId }, page, pageSize);
  }
}
