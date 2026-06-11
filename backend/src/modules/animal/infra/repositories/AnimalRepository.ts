import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { IAnimalRepository } from "../../domain/repositories/IAnimalRepository";
import {
  Animal,
  StatusAnimal,
} from "../../domain/entities/Animal";

type StoredAnimal = {
  id: string;
  fazendaId: string;
  codigoIdentificacao: string;
  nome?: string;
  raca: string;
  peso: number;
  dataNascimento: string;
  status: StatusAnimal;
  dataCriacao: string;
};

type LegacyStoredAnimal = Partial<StoredAnimal> & {
  id?: string;
  fazendaId?: string;
  nome?: string;
  raca?: string;
  idade?: number;
  peso?: number;
  dataNascimento?: string;
};

const DEFAULT_ANIMALS_FILE = path.resolve(process.cwd(), "data", "animals.json");
const STATUS_VALIDOS: StatusAnimal[] = ["ATIVO", "VENDIDO", "MORTO"];

const ensureFile = async (filePath: string): Promise<void> => {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify([], null, 2), "utf-8");
  }
};

const normalizeCode = (value: string): string => value.trim().toLowerCase();

const legacyBirthDate = (idade?: number): Date => {
  const date = new Date();
  const years = Number.isFinite(idade) && Number(idade) >= 0 ? Number(idade) : 0;
  date.setFullYear(date.getFullYear() - years);
  return date;
};

const migrateStored = (
  stored: LegacyStoredAnimal,
  index: number
): { animal: StoredAnimal; changed: boolean } => {
  const id = stored.id?.trim() || randomUUID();
  const fazendaId = stored.fazendaId?.trim() ?? "";
  if (!fazendaId) {
    throw new Error(`Registro legado de animal sem fazendaId na posicao ${index}.`);
  }
  const parsedBirthDate = stored.dataNascimento
    ? new Date(stored.dataNascimento)
    : legacyBirthDate(stored.idade);
  const dataNascimento = Number.isNaN(parsedBirthDate.getTime())
    ? legacyBirthDate(stored.idade)
    : parsedBirthDate;
  const parsedCreatedAt = stored.dataCriacao
    ? new Date(stored.dataCriacao)
    : new Date();
  const dataCriacao = Number.isNaN(parsedCreatedAt.getTime())
    ? new Date()
    : parsedCreatedAt;
  const status = STATUS_VALIDOS.includes(stored.status as StatusAnimal)
    ? (stored.status as StatusAnimal)
    : "ATIVO";

  const animal: StoredAnimal = {
    id,
    fazendaId,
    codigoIdentificacao:
      stored.codigoIdentificacao?.trim() || `LEGACY-${id}`,
    nome: stored.nome?.trim() || undefined,
    raca: stored.raca?.trim() || "NAO_INFORMADA",
    peso:
      Number.isFinite(Number(stored.peso)) && Number(stored.peso) > 0
        ? Number(stored.peso)
        : 0.01,
    dataNascimento: dataNascimento.toISOString(),
    status,
    dataCriacao: dataCriacao.toISOString(),
  };

  const changed =
    "idade" in stored ||
    !stored.codigoIdentificacao ||
    !stored.dataNascimento ||
    !stored.status ||
    !stored.dataCriacao ||
    stored.nome === "";

  return { animal, changed };
};

const toDomain = (stored: StoredAnimal): Animal =>
  new Animal({
    id: stored.id,
    fazendaId: stored.fazendaId,
    codigoIdentificacao: stored.codigoIdentificacao,
    nome: stored.nome,
    raca: stored.raca,
    peso: stored.peso,
    dataNascimento: new Date(stored.dataNascimento),
    status: stored.status,
    dataCriacao: new Date(stored.dataCriacao),
  });

const toStored = (animal: Animal): StoredAnimal => ({
  id: animal.id,
  fazendaId: animal.fazendaId,
  codigoIdentificacao: animal.codigoIdentificacao,
  nome: animal.nome,
  raca: animal.raca,
  peso: animal.peso,
  dataNascimento: animal.dataNascimento.toISOString(),
  status: animal.status,
  dataCriacao: animal.dataCriacao.toISOString(),
});

export class AnimalRepository implements IAnimalRepository {
  constructor(private readonly filePath = DEFAULT_ANIMALS_FILE) {}

  private async readAll(): Promise<StoredAnimal[]> {
    await ensureFile(this.filePath);
    const raw = await fs.readFile(this.filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    let changed = false;
    const animals = (parsed as LegacyStoredAnimal[]).map((item, index) => {
      const migrated = migrateStored(item, index);
      changed ||= migrated.changed;
      return migrated.animal;
    });

    if (changed) await this.writeAll(animals);
    return animals;
  }

  private async writeAll(items: StoredAnimal[]): Promise<void> {
    await ensureFile(this.filePath);
    await fs.writeFile(this.filePath, JSON.stringify(items, null, 2), "utf-8");
  }

  async findAll(): Promise<Animal[]> {
    return (await this.readAll()).map(toDomain);
  }

  async findById(id: string): Promise<Animal | undefined> {
    const animalId = id?.trim() ?? "";
    const found = (await this.readAll()).find((animal) => animal.id === animalId);
    return found ? toDomain(found) : undefined;
  }

  async findByCodigoIdentificacao(
    fazendaId: string,
    codigoIdentificacao: string
  ): Promise<Animal | undefined> {
    const farmId = fazendaId?.trim() ?? "";
    const code = normalizeCode(codigoIdentificacao ?? "");
    const found = (await this.readAll()).find(
      (animal) =>
        animal.fazendaId === farmId &&
        normalizeCode(animal.codigoIdentificacao) === code
    );
    return found ? toDomain(found) : undefined;
  }

  async create(animal: Animal): Promise<Animal> {
    const all = await this.readAll();
    const duplicate = all.some(
      (item) =>
        item.fazendaId === animal.fazendaId &&
        normalizeCode(item.codigoIdentificacao) ===
          normalizeCode(animal.codigoIdentificacao)
    );
    if (duplicate) {
      throw new Error("Ja existe um animal com este codigo nesta fazenda.");
    }

    all.push(toStored(animal));
    await this.writeAll(all);
    return animal;
  }

  async update(animal: Animal): Promise<Animal> {
    const all = await this.readAll();
    const index = all.findIndex((item) => item.id === animal.id);
    if (index < 0) throw new Error("Animal nao encontrado.");

    all[index] = toStored(animal);
    await this.writeAll(all);
    return animal;
  }
}
