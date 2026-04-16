import { IAnimalRepository } from "../../repositories/IAnimalRepository";
import { Animal } from "../../entities/Animal";

export class GetAnimals {
  constructor(private animalRepository: IAnimalRepository) {}

  async execute(fazendaId: string): Promise<Animal[]> {
    return this.animalRepository.findAllByFazenda(fazendaId);
  }
}
