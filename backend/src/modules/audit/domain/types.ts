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

export type AuditEntityType =
  | "animal"
  | "fazenda"
  | "manejo"
  | "event"
  | "membership"
  | "membro"
  | "auth";
export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "INVITE_USER"
  | "ACCEPT_INVITE"
  | "CHANGE_ROLE"
  | "TOGGLE_MEMBER"
  | "REMOVE_MEMBER";
