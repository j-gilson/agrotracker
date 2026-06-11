import { mkdtemp, readFile, rm } from "fs/promises";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Animal } from "../../domain/entities/Animal";
import { AnimalRepository } from "./AnimalRepository";

describe("AnimalRepository", () => {
  let tempDir: string;
  let filePath: string;
  let repository: AnimalRepository;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "agrotracker-animal-"));
    filePath = path.join(tempDir, "animals.json");
    repository = new AnimalRepository(filePath);
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  const makeAnimal = (fazendaId: string, id: string) =>
    new Animal({
      id,
      fazendaId,
      codigoIdentificacao: "QR-001",
      raca: "Nelore",
      peso: 380,
      dataNascimento: new Date("2022-01-01T12:00:00.000Z"),
      status: "ATIVO",
      dataCriacao: new Date("2026-01-01T12:00:00.000Z"),
    });

  it("nao persiste idade", async () => {
    await repository.create(makeAnimal("fazenda-1", "animal-1"));

    const stored = JSON.parse(await readFile(filePath, "utf-8")) as object[];
    expect(stored[0]).not.toHaveProperty("idade");
    expect(stored[0]).toHaveProperty("dataNascimento");
  });

  it("garante unicidade do codigo dentro da mesma fazenda", async () => {
    await repository.create(makeAnimal("fazenda-1", "animal-1"));

    await expect(
      repository.create(makeAnimal("fazenda-1", "animal-2"))
    ).rejects.toThrow("Ja existe um animal com este codigo nesta fazenda.");
  });

  it("permite o mesmo codigo em fazendas diferentes e busca pelo par fazenda/codigo", async () => {
    const first = makeAnimal("fazenda-1", "animal-1");
    const second = makeAnimal("fazenda-2", "animal-2");
    await repository.create(first);
    await repository.create(second);

    expect(
      (await repository.findByCodigoIdentificacao("fazenda-1", "qr-001"))?.id
    ).toBe(first.id);
    expect(
      (await repository.findByCodigoIdentificacao("fazenda-2", "QR-001"))?.id
    ).toBe(second.id);
  });
});
