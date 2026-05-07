import { IAnimalRepository } from "../repositories/IAnimalRepository";
import { Animal } from "../entities/Animal";

export interface UpdateAnimalInput {
  id: string;
  nome?: string;
  raca?: string;
  idade?: number;
  peso?: number;
  dataNascimento?: Date;
}

export class UpdateAnimal {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(input: UpdateAnimalInput): Promise<{ before: Animal; after: Animal }> {
    const id = input.id?.trim() ?? "";
    if (!id) throw new Error("ID do animal é obrigatório.");

    if (input.nome !== undefined && input.nome.trim().length < 2) {
      throw new Error("O nome do animal deve ter pelo menos 2 caracteres.");
    }

    if (input.raca !== undefined && !input.raca.trim()) {
      throw new Error("A raça do animal é obrigatória.");
    }

    if (input.idade !== undefined && (!Number.isFinite(input.idade) || input.idade < 0)) {
      throw new Error("A idade do animal deve ser um número maior ou igual a zero.");
    }

    if (input.peso !== undefined && (!Number.isFinite(input.peso) || input.peso <= 0)) {
      throw new Error("O peso do animal deve ser maior que zero.");
    }

    const existing = await this.animalRepository.findById(id);
    if (!existing || !existing.id) throw new Error("Animal não encontrado.");

    const updated = new Animal({
      id: existing.id,
      fazendaId: existing.fazendaId,
      nome: input.nome !== undefined ? input.nome.trim() : existing.nome,
      raca: input.raca !== undefined ? input.raca.trim() : existing.raca,
      idade: input.idade !== undefined ? input.idade : existing.idade,
      peso: input.peso !== undefined ? input.peso : existing.peso,
      dataNascimento: input.dataNascimento !== undefined ? input.dataNascimento : existing.dataNascimento,
    });

    await this.animalRepository.update(updated);

    return { before: existing, after: updated };
  }
}
