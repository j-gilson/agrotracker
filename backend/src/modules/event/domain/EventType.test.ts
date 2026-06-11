import { describe, expect, it } from "vitest";
import {
  EVENT_TYPES,
  isEventType,
  normalizeEventType,
} from "./types";

describe("EventType", () => {
  it("expoe somente os cinco tipos oficiais", () => {
    expect(EVENT_TYPES).toEqual([
      "VACINACAO",
      "PESAGEM",
      "MEDICACAO",
      "INSEMINACAO",
      "OUTRO",
    ]);
  });

  it("rejeita tipos fora do dominio", () => {
    expect(isEventType("VACINA")).toBe(false);
    expect(isEventType("QUALQUER")).toBe(false);
  });

  it("normaliza os tipos legados conhecidos", () => {
    expect(normalizeEventType("vacina")).toBe("VACINACAO");
    expect(normalizeEventType("Inseminação")).toBe("INSEMINACAO");
  });
});
