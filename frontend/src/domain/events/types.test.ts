import { describe, expect, it } from 'vitest';
import { EVENT_TYPES, EVENT_TYPE_OPTIONS, isEventType } from './types';

describe('EventType frontend', () => {
  it('disponibiliza somente as opcoes oficiais no formulario', () => {
    expect(EVENT_TYPE_OPTIONS.map((option) => option.value)).toEqual(EVENT_TYPES);
    expect(EVENT_TYPE_OPTIONS).toHaveLength(5);
  });

  it('rejeita valores fora das opcoes controladas', () => {
    expect(isEventType('VACINACAO')).toBe(true);
    expect(isEventType('VACINA')).toBe(false);
    expect(isEventType('CONSULTA')).toBe(false);
  });
});
