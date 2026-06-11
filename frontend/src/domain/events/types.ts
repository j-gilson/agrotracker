export const EVENT_TYPES = [
  'VACINACAO',
  'PESAGEM',
  'MEDICACAO',
  'INSEMINACAO',
  'OUTRO',
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_OPTIONS: readonly {
  value: EventType;
  label: string;
}[] = [
  { value: 'VACINACAO', label: 'Vacinação' },
  { value: 'PESAGEM', label: 'Pesagem' },
  { value: 'MEDICACAO', label: 'Medicação' },
  { value: 'INSEMINACAO', label: 'Inseminação' },
  { value: 'OUTRO', label: 'Outro' },
];

export const isEventType = (value: unknown): value is EventType =>
  typeof value === 'string' && EVENT_TYPES.includes(value as EventType);
