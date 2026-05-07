import { v4 as uuidv4 } from "uuid";
import { AuditLog } from "../../domain/entities/AuditLog";
import { IAuditRepository } from "../../domain/repositories/IAuditRepository";
import { AuditAction, AuditChange, AuditEntityType, AuditMetadata, JsonObject } from "../../domain/types";
import { generateChanges } from "../utils/generateChanges";
import { AuditError } from "../errors/AuditError";

export interface CreateAuditLogData {
  userId: string;
  userName: string;
  userEmail: string;
  fazendaId: string | null;
  fazendaNome: string | null;
  entityType: AuditEntityType;
  entityId: string | null;
  action: AuditAction;
  description: string;
  metadata?: AuditMetadata | null;
  before?: JsonObject | null;
  after?: JsonObject | null;
  changes?: AuditChange[] | null;
  timestamp?: Date;
}

export class AuditService {
  constructor(private readonly auditRepository: IAuditRepository) {}

  async createLog(data: CreateAuditLogData): Promise<void> {
    if (!data.userId?.trim()) throw new AuditError("Usuario invalido.", 400);
    if (!data.userEmail?.trim()) throw new AuditError("Usuario invalido.", 400);
    if (!data.userName?.trim()) throw new AuditError("Usuario invalido.", 400);
    if (!data.entityType) throw new AuditError("Entidade invalida.", 400);
    if (!data.action) throw new AuditError("Acao invalida.", 400);
    if (!data.description?.trim()) throw new AuditError("Descricao invalida.", 400);

    const before = data.before ?? null;
    const after = data.after ?? null;

    const computedChanges =
      data.changes ?? (data.action === "UPDATE" ? generateChanges(before, after) : []);

    const log = new AuditLog({
      id: uuidv4(),
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      fazendaId: data.fazendaId,
      fazendaNome: data.fazendaNome,
      entityType: data.entityType,
      entityId: data.entityId,
      action: data.action,
      description: data.description,
      metadata: data.metadata ?? null,
      changes: computedChanges,
      before,
      after,
      timestamp: data.timestamp,
      createdAt: new Date(),
    });

    await this.auditRepository.save(log);
  }
}
