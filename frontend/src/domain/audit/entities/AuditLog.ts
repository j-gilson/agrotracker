export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'INVITE_USER'
  | 'ACCEPT_INVITE'
  | 'CHANGE_ROLE'
  | 'TOGGLE_MEMBER'
  | 'REMOVE_MEMBER';

export type AuditEntityType =
  | 'animal'
  | 'fazenda'
  | 'manejo'
  | 'event'
  | 'membership'
  | 'membro'
  | 'auth';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type AuditMetadata = JsonObject;

export type AuditChange = {
  field: string;
  before: JsonValue;
  after: JsonValue;
};

export interface AuditLogProps {
  id: string;
  entityType: AuditEntityType;
  entityId: string | null;
  action: AuditAction;
  userId: string;
  userName: string;
  userEmail: string;
  fazendaId: string | null;
  fazendaNome: string | null;
  description: string;
  before: JsonObject | null;
  after: JsonObject | null;
  metadata: AuditMetadata | null;
  changes: AuditChange[] | null;
  timestamp: Date;
  createdAt: Date;
}

export class AuditLog {
  constructor(private props: AuditLogProps) {}

  get id() {
    return this.props.id;
  }
  get entityType() {
    return this.props.entityType;
  }
  get entityId() {
    return this.props.entityId;
  }
  get action() {
    return this.props.action;
  }
  get userId() {
    return this.props.userId;
  }
  get userName() {
    return this.props.userName;
  }
  get userEmail() {
    return this.props.userEmail;
  }
  get fazendaId() {
    return this.props.fazendaId;
  }
  get fazendaNome() {
    return this.props.fazendaNome;
  }
  get description() {
    return this.props.description;
  }
  get before() {
    return this.props.before;
  }
  get after() {
    return this.props.after;
  }
  get metadata() {
    return this.props.metadata;
  }
  get changes() {
    return this.props.changes;
  }
  get timestamp() {
    return this.props.timestamp;
  }
  get createdAt() {
    return this.props.createdAt;
  }
}
