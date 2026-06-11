import { IAnimalRepository } from "../repositories/IAnimalRepository";
import { Animal, StatusAnimal } from "../entities/Animal";

export interface UpdateAnimalInput {
  id: string;
  nome?: string | null;
  raca?: string;
  peso?: number;
  status?: StatusAnimal;
}

export class UpdateAnimal {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(input: UpdateAnimalInput): Promise<{ before: Animal; after: Animal }> {
    const id = input.id?.trim() ?? "";
    if (!id) throw new Error("ID do animal é obrigatório.");

    if (input.raca !== undefined && !input.raca.trim()) {
      throw new Error("A raca do animal e obrigatoria.");
    }

    if (input.peso !== undefined && (!Number.isFinite(input.peso) || input.peso <= 0)) {
      throw new Error("O peso do animal deve ser maior que zero.");
    }

    const existing = await this.animalRepository.findById(id);
    if (!existing || !existing.id) throw new Error("Animal não encontrado.");

    const updated = new Animal({
      id: existing.id,
      fazendaId: existing.fazendaId,
      codigoIdentificacao: existing.codigoIdentificacao,
      nome:
        input.nome !== undefined
          ? input.nome?.trim() || undefined
          : existing.nome,
      raca: input.raca !== undefined ? input.raca.trim() : existing.raca,
      peso: input.peso !== undefined ? input.peso : existing.peso,
      dataNascimento: existing.dataNascimento,
      status: input.status ?? existing.status,
      dataCriacao: existing.dataCriacao,
    });

    await this.animalRepository.update(updated);

    return { before: existing, after: updated };
  }
}
