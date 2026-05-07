import { IAnimalRepository } from "../repositories/IAnimalRepository";
import { Animal } from "../entities/Animal";

export class DeleteAnimal {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(id: string): Promise<Animal> {
    const animalId = id?.trim() ?? "";
    if (!animalId) throw new Error("ID do animal é obrigatório");

    const existing = await this.animalRepository.findById(animalId);
    if (!existing || !existing.id) throw new Error("Animal não encontrado");

    await this.animalRepository.deleteById(animalId);
    return existing;
  }
}
