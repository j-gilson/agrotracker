import { IAuditRepository } from "../../domain/repositories/IAuditRepository";
import { AuditAction, AuditChange, AuditEntityType, AuditMetadata, JsonObject } from "../../domain/types";
import { AuditService } from "../services/AuditService";

export interface CreateAuditLogInput {
  userId: string;
  userName: string;
  userEmail: string;
  fazendaId: string | null;
  fazendaNome: string | null;
  entityType: AuditEntityType;
  entityId: string | null;
  action: AuditAction;
  description: string;
  before?: JsonObject | null;
  after?: JsonObject | null;
  metadata?: AuditMetadata | null;
  changes?: AuditChange[] | null;
  timestamp?: Date;
}

export class CreateAuditLog {
  private readonly service: AuditService;

  constructor(private readonly auditRepository: IAuditRepository) {
    this.service = new AuditService(auditRepository);
  }

  async execute(input: CreateAuditLogInput): Promise<void> {
    await this.service.createLog({
      userId: input.userId,
      userName: input.userName,
      userEmail: input.userEmail,
      fazendaId: input.fazendaId,
      fazendaNome: input.fazendaNome,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      description: input.description,
      metadata: input.metadata ?? null,
      changes: input.changes ?? null,
      before: input.before ?? null,
      after: input.after ?? null,
      timestamp: input.timestamp,
    });
  }
}

