export const EVENT_TYPES = [
  "VACINACAO",
  "PESAGEM",
  "MEDICACAO",
  "INSEMINACAO",
  "OUTRO",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

const LEGACY_EVENT_TYPES: Record<string, EventType> = {
  VACINA: "VACINACAO",
  VACCINATION: "VACINACAO",
  WEIGHT: "PESAGEM",
  MEDICATION: "MEDICACAO",
  REPRODUCTION: "INSEMINACAO",
};

const normalizeKey = (value: string): string =>
  value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

export const isEventType = (value: unknown): value is EventType =>
  typeof value === "string" && EVENT_TYPES.includes(value as EventType);

export const normalizeEventType = (value: unknown): EventType | undefined => {
  if (typeof value !== "string") return undefined;

  const normalized = normalizeKey(value);
  if (isEventType(normalized)) return normalized;
  return LEGACY_EVENT_TYPES[normalized];
};
