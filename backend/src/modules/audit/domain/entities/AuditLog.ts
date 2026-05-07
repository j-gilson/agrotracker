import { AuditAction, AuditChange, AuditEntityType, AuditMetadata, JsonObject } from "../types";

export interface AuditLogProps {
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
  timestamp?: Date;
  createdAt: Date;
}

export class AuditLog {
  constructor(private props: AuditLogProps) {
    this.validate();
  }

  private validate(): void {
    if (!this.props.id) throw new Error("ID do log e obrigatorio");
    if (!this.props.userId) throw new Error("UserId e obrigatorio");
    if (!this.props.userName?.trim()) throw new Error("UserName e obrigatorio");
    if (!this.props.userEmail?.trim()) throw new Error("UserEmail e obrigatorio");
    if (!this.props.entityType) throw new Error("EntityType e obrigatorio");
    if (!this.props.action) throw new Error("Action e obrigatorio");
    if (!this.props.description?.trim()) throw new Error("Description e obrigatorio");
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get userName(): string {
    return this.props.userName;
  }

  get userEmail(): string {
    return this.props.userEmail;
  }

  get fazendaId(): string | null {
    return this.props.fazendaId;
  }

  get fazendaNome(): string | null {
    return this.props.fazendaNome;
  }

  get entityType(): AuditEntityType {
    return this.props.entityType;
  }

  get entityId(): string | null {
    return this.props.entityId;
  }

  get action(): AuditAction {
    return this.props.action;
  }

  get description(): string {
    return this.props.description;
  }

  get before(): JsonObject | null {
    return this.props.before;
  }

  get after(): JsonObject | null {
    return this.props.after;
  }

  get metadata(): AuditMetadata | null {
    return this.props.metadata ?? null;
  }

  get changes(): AuditChange[] | null {
    return this.props.changes ?? null;
  }

  get timestamp(): Date {
    return this.props.timestamp ?? this.props.createdAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
