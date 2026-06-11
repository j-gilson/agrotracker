import { describe, expect, it } from "vitest";
import { Animal } from "../entities/Animal";
import { IAnimalRepository } from "../repositories/IAnimalRepository";
import { CreateAnimal } from "./CreateAnimal";
import { UpdateAnimal } from "./UpdateAnimal";

class InMemoryAnimalRepository implements IAnimalRepository {
  items: Animal[] = [];

  async findAll(): Promise<Animal[]> {
    return [...this.items];
  }

  async findById(id: string): Promise<Animal | undefined> {
    return this.items.find((animal) => animal.id === id);
  }

  async findByCodigoIdentificacao(
    fazendaId: string,
    codigoIdentificacao: string
  ): Promise<Animal | undefined> {
    const code = codigoIdentificacao.trim().toLowerCase();
    return this.items.find(
      (animal) =>
        animal.fazendaId === fazendaId &&
        animal.codigoIdentificacao.toLowerCase() === code
    );
  }

  async create(animal: Animal): Promise<Animal> {
    this.items.push(animal);
    return animal;
  }

  async update(animal: Animal): Promise<Animal> {
    const index = this.items.findIndex((item) => item.id === animal.id);
    if (index < 0) throw new Error("Animal nao encontrado.");
    this.items[index] = animal;
    return animal;
  }
}

const createInput = {
  fazendaId: "fazenda-1",
  codigoIdentificacao: "BRINCO-001",
  raca: "Nelore",
  peso: 400,
  dataNascimento: new Date("2021-02-10T12:00:00.000Z"),
};

describe("CreateAnimal", () => {
  it("cria sem nome e define status ATIVO", async () => {
    const repository = new InMemoryAnimalRepository();
    const animal = await new CreateAnimal(repository).execute(createInput);

    expect(animal.nome).toBeUndefined();
    expect(animal.status).toBe("ATIVO");
  });

  it("rejeita codigo duplicado na mesma fazenda", async () => {
    const repository = new InMemoryAnimalRepository();
    const useCase = new CreateAnimal(repository);
    await useCase.execute(createInput);

    await expect(
      useCase.execute({ ...createInput, codigoIdentificacao: "brinco-001" })
    ).rejects.toThrow("Ja existe um animal com este codigo nesta fazenda.");
  });

  it("permite o mesmo codigo em fazendas diferentes", async () => {
    const repository = new InMemoryAnimalRepository();
    const useCase = new CreateAnimal(repository);

    await useCase.execute(createInput);
    await useCase.execute({ ...createInput, fazendaId: "fazenda-2" });

    expect(repository.items).toHaveLength(2);
  });
});

describe("UpdateAnimal", () => {
  it("altera somente nome, raca, peso e status", async () => {
    const repository = new InMemoryAnimalRepository();
    const original = await new CreateAnimal(repository).execute({
      ...createInput,
      nome: "Mimosa",
    });

    const { after } = await new UpdateAnimal(repository).execute({
      id: original.id,
      nome: "Estrela",
      raca: "Angus",
      peso: 455,
      status: "VENDIDO",
      fazendaId: "fazenda-invasora",
      codigoIdentificacao: "CODIGO-INVADEDOR",
      dataCriacao: new Date("2000-01-01T00:00:00.000Z"),
    } as Parameters<UpdateAnimal["execute"]>[0]);

    expect(after.nome).toBe("Estrela");
    expect(after.raca).toBe("Angus");
    expect(after.peso).toBe(455);
    expect(after.status).toBe("VENDIDO");
    expect(after.id).toBe(original.id);
    expect(after.fazendaId).toBe(original.fazendaId);
    expect(after.codigoIdentificacao).toBe(original.codigoIdentificacao);
    expect(after.dataCriacao).toEqual(original.dataCriacao);
    expect(after.dataNascimento).toEqual(original.dataNascimento);
  });
});
