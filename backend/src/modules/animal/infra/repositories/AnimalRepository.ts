import { promises as fs } from "fs";
import path from "path";
import { IAnimalRepository } from "../../domain/repositories/IAnimalRepository";
import { Animal } from "../../domain/entities/Animal";

type StoredAnimal = {
  id: string;
  nome: string;
  raca: string;
  idade: number;
  peso: number;
  fazendaId: string;
  dataNascimento?: string;
};

const ANIMALS_FILE = path.resolve(process.cwd(), "data", "animals.json");

const ensureFile = async (): Promise<void> => {
  const dir = path.dirname(ANIMALS_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(ANIMALS_FILE);
  } catch {
    await fs.writeFile(ANIMALS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
};

const toDomain = (stored: StoredAnimal): Animal =>
  new Animal({
    id: stored.id,
    nome: stored.nome,
    raca: stored.raca,
    idade: stored.idade,
    peso: stored.peso,
    fazendaId: stored.fazendaId,
    dataNascimento: stored.dataNascimento ? new Date(stored.dataNascimento) : undefined,
  });

const toStored = (animal: Animal): StoredAnimal => ({
  id: animal.id ?? "",
  nome: animal.nome,
  raca: animal.raca,
  idade: animal.idade,
  peso: animal.peso,
  fazendaId: animal.fazendaId,
  dataNascimento: animal.dataNascimento ? animal.dataNascimento.toISOString() : undefined,
});

export class AnimalRepository implements IAnimalRepository {
  private async readAll(): Promise<StoredAnimal[]> {
    await ensureFile();
    const raw = await fs.readFile(ANIMALS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredAnimal[];
  }

  private async writeAll(items: StoredAnimal[]): Promise<void> {
    await ensureFile();
    await fs.writeFile(ANIMALS_FILE, JSON.stringify(items, null, 2), "utf-8");
  }

  async findAll(): Promise<Animal[]> {
    return (await this.readAll()).map(toDomain);
  }

  async findById(id: string): Promise<Animal | undefined> {
    const all = await this.readAll();
    const found = all.find((a) => a.id === id);
    return found ? toDomain(found) : undefined;
  }

  async create(animal: Animal): Promise<Animal> {
    const stored = toStored(animal);
    if (!stored.id?.trim()) {
      throw new Error("ID do animal e obrigatorio.");
    }

    const all = await this.readAll();
    all.push(stored);
    await this.writeAll(all);

    return animal;
  }

  async update(animal: Animal): Promise<Animal> {
    const stored = toStored(animal);
    if (!stored.id?.trim()) {
      throw new Error("ID do animal e obrigatorio.");
    }

    const all = await this.readAll();
    const idx = all.findIndex((a) => a.id === stored.id);
    if (idx < 0) {
      throw new Error("Animal nao encontrado.");
    }

    all[idx] = stored;
    await this.writeAll(all);
    return animal;
  }

  async deleteById(id: string): Promise<void> {
    const animalId = id?.trim() ?? "";
    if (!animalId) throw new Error("ID do animal e obrigatorio.");

    const all = await this.readAll();
    const filtered = all.filter((a) => a.id !== animalId);
    await this.writeAll(filtered);
  }
}
