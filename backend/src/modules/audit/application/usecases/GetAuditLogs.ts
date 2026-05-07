import { IAuditRepository, PagedResult } from "../../domain/repositories/IAuditRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { AuditAction, AuditEntityType } from "../../domain/types";
import { AuditError } from "../errors/AuditError";

export interface GetAuditLogsInput {
  fazendaId?: string;
  userId?: string;
  action?: AuditAction;
  entityType?: AuditEntityType;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export class GetAuditLogs {
  constructor(private readonly auditRepository: IAuditRepository) {}

  async execute(input: GetAuditLogsInput): Promise<PagedResult<AuditLog>> {
    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(input.pageSize ?? 10, 50);

    const startDate = input.startDate ? new Date(input.startDate) : undefined;
    const endDate = input.endDate ? new Date(input.endDate) : undefined;

    if (startDate && Number.isNaN(startDate.getTime())) {
      throw new AuditError("Data inicial invalida.", 400);
    }
    if (endDate && Number.isNaN(endDate.getTime())) {
      throw new AuditError("Data final invalida.", 400);
    }

    return this.auditRepository.find(
      {
        fazendaId: input.fazendaId,
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        startDate,
        endDate,
      },
      page,
      pageSize
    );
  }
}
