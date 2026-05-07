import { AuditChange, JsonObject, JsonValue } from "../../domain/types";

const TECH_FIELDS = new Set([
  "id",
  "createdAt",
  "updatedAt",
]);

const normalize = (value: unknown): JsonValue => {
  if (value === undefined) return null;
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) {
    return value.map((item) => normalize(item));
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, itemValue]) => itemValue !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, itemValue]) => [key, normalize(itemValue)] as const);

    return Object.fromEntries(entries) as JsonObject;
  }

  try {
    return JSON.parse(JSON.stringify(value)) as JsonValue;
  } catch {
    return String(value);
  }
};

const isEqual = (left: JsonValue, right: JsonValue): boolean => {
  if (left === right) return true;

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) return false;
    return left.every((item, index) => isEqual(item, right[index] as JsonValue));
  }

  if (
    typeof left === "object" &&
    left !== null &&
    typeof right === "object" &&
    right !== null &&
    !Array.isArray(left) &&
    !Array.isArray(right)
  ) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    if (leftKeys.length !== rightKeys.length) return false;

    return leftKeys.every((key) =>
      Object.prototype.hasOwnProperty.call(right, key) &&
      isEqual(left[key] as JsonValue, right[key] as JsonValue)
    );
  }

  return false;
};

export const generateChanges = (oldData: JsonObject | null, newData: JsonObject | null): AuditChange[] => {
  if (!oldData || !newData) return [];

  const changes: AuditChange[] = [];

  const keys = new Set<string>([...Object.keys(oldData), ...Object.keys(newData)]);
  for (const key of keys) {
    if (TECH_FIELDS.has(key)) continue;

    const beforeRaw = (oldData as Record<string, unknown>)[key];
    const afterRaw = (newData as Record<string, unknown>)[key];

    const before = normalize(beforeRaw);
    const after = normalize(afterRaw);

    if (isEqual(before, after)) continue;

    changes.push({ field: key, before, after });
  }

  return changes;
};
