import { promises as fs } from "fs";
import path from "path";
import { AuditLog } from "../domain/entities/AuditLog";
import { AuditLogFilters, IAuditRepository, PagedResult } from "../domain/repositories/IAuditRepository";
import { AuditAction, AuditChange, AuditEntityType, AuditMetadata, JsonObject } from "../domain/types";

type StoredAuditLog = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  fazendaId: string | null;
  fazendaNome: string | null;
  entityType: AuditEntityType;
  entityId: string | null;
  action: AuditAction;
  description: string;
  before: JsonObject | null;
  after: JsonObject | null;
  metadata?: AuditMetadata | null;
  changes?: AuditChange[] | null;
  timestamp?: string;
  createdAt: string;
};

const AUDIT_FILE = path.resolve(process.cwd(), "data", "auditlogs.json");

const ensureFile = async (): Promise<void> => {
  const dir = path.dirname(AUDIT_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(AUDIT_FILE);
  } catch {
    await fs.writeFile(AUDIT_FILE, JSON.stringify([], null, 2), "utf-8");
  }
};

const toDomain = (stored: StoredAuditLog): AuditLog =>
  new AuditLog({
    id: stored.id,
    userId: stored.userId,
    userName: stored.userName,
    userEmail: stored.userEmail,
    fazendaId: stored.fazendaId,
    fazendaNome: stored.fazendaNome,
    entityType: stored.entityType,
    entityId: stored.entityId,
    action: stored.action,
    description: stored.description,
    before: stored.before,
    after: stored.after,
    metadata: stored.metadata ?? null,
    changes: stored.changes ?? null,
    timestamp: stored.timestamp ? new Date(stored.timestamp) : undefined,
    createdAt: new Date(stored.createdAt),
  });

const toStored = (log: AuditLog): StoredAuditLog => ({
  id: log.id,
  userId: log.userId,
  userName: log.userName,
  userEmail: log.userEmail,
  fazendaId: log.fazendaId,
  fazendaNome: log.fazendaNome,
  entityType: log.entityType,
  entityId: log.entityId,
  action: log.action,
  description: log.description,
  before: log.before,
  after: log.after,
  metadata: log.metadata,
  changes: log.changes,
  timestamp: log.timestamp?.toISOString(),
  createdAt: log.createdAt.toISOString(),
});

export class LocalAuditRepository implements IAuditRepository {
  private async readAll(): Promise<StoredAuditLog[]> {
    await ensureFile();
    const raw = await fs.readFile(AUDIT_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredAuditLog[];
  }

  private async writeAll(items: StoredAuditLog[]): Promise<void> {
    await ensureFile();
    await fs.writeFile(AUDIT_FILE, JSON.stringify(items, null, 2), "utf-8");
  }

  async save(log: AuditLog): Promise<void> {
    const all = await this.readAll();
    all.push(toStored(log));
    await this.writeAll(all);
  }

  async find(filters: AuditLogFilters, page: number, pageSize: number): Promise<PagedResult<AuditLog>> {
    const all = (await this.readAll()).map(toDomain);

    const filtered = all.filter((log) => {
      if (filters.fazendaId && log.fazendaId !== filters.fazendaId) return false;
      if (filters.userId && log.userId !== filters.userId) return false;
      if (filters.action && log.action !== filters.action) return false;
      if (filters.entityType && log.entityType !== filters.entityType) return false;
      if (filters.startDate && log.createdAt < filters.startDate) return false;
      if (filters.endDate && log.createdAt > filters.endDate) return false;
      return true;
    });

    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return { items, page, pageSize, total };
  }

  async findByEntity(entityType: AuditEntityType, entityId: string): Promise<AuditLog[]> {
    const all = (await this.readAll()).map(toDomain);
    const filtered = all.filter((log) => log.entityType === entityType && log.entityId === entityId);
    filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return filtered;
  }
}

