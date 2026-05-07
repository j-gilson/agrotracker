import { IFazendaRepository } from "../../domain/repositories/IFazendaRepository";
import { Fazenda } from "../../domain/entities/Fazenda";
import { promises as fs } from "fs";
import path from "path";

export class FazendaRepository implements IFazendaRepository {
  private readonly filePath = path.resolve(process.cwd(), "data", "fazendas.json");

  private async ensureFile(): Promise<void> {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, JSON.stringify([], null, 2), "utf-8");
    }
  }

  private async readAll(): Promise<Fazenda[]> {
    await this.ensureFile();
    const raw = await fs.readFile(this.filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return (parsed as Array<{ id?: string; nome: string; localizacao: string }>).map(
      (f) =>
        new Fazenda({
          id: f.id,
          nome: f.nome,
          localizacao: f.localizacao,
        })
    );
  }

  private async writeAll(items: Fazenda[]): Promise<void> {
    await this.ensureFile();
    await fs.writeFile(
      this.filePath,
      JSON.stringify(
        items.map((f) => ({ id: f.id, nome: f.nome, localizacao: f.localizacao })),
        null,
        2
      ),
      "utf-8"
    );
  }

  async findAll(): Promise<Fazenda[]> {
    return this.readAll();
  }

  async findById(id: string): Promise<Fazenda | undefined> {
    const all = await this.readAll();
    return all.find((f) => f.id === id);
  }

  async create(fazenda: Fazenda): Promise<Fazenda> {
    const all = await this.readAll();
    all.push(fazenda);
    await this.writeAll(all);
    return fazenda;
  }

  async update(fazenda: Fazenda): Promise<Fazenda> {
    const all = await this.readAll();
    const idx = all.findIndex((f) => f.id === fazenda.id);
    if (idx < 0) {
      throw new Error("Fazenda nao encontrada.");
    }
    all[idx] = fazenda;
    await this.writeAll(all);
    return fazenda;
  }
}
