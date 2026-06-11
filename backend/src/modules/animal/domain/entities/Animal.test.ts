import { afterEach, describe, expect, it, vi } from "vitest";
import { Animal } from "./Animal";

const makeAnimal = (overrides: Partial<ConstructorParameters<typeof Animal>[0]> = {}) =>
  new Animal({
    id: "animal-1",
    fazendaId: "fazenda-1",
    codigoIdentificacao: "BRINCO-001",
    raca: "Nelore",
    peso: 420,
    dataNascimento: new Date("2020-06-15T12:00:00.000Z"),
    status: "ATIVO",
    dataCriacao: new Date("2024-01-10T12:00:00.000Z"),
    ...overrides,
  });

describe("Animal", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("calcula a idade dinamicamente a partir de dataNascimento", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T12:00:00.000Z"));

    expect(makeAnimal().idade).toBe(5);
  });

  it("permite criar animal sem nome", () => {
    expect(makeAnimal().nome).toBeUndefined();
  });

  it("exige codigoIdentificacao", () => {
    expect(() => makeAnimal({ codigoIdentificacao: " " })).toThrow(
      "Codigo de identificacao e obrigatorio."
    );
  });
});
