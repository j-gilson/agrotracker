import { IAnimalRepository } from "../repositories/IAnimalRepository";
import { Animal } from "../entities/Animal";

export class GetAnimals {
  constructor(private animalRepository: IAnimalRepository) {}

  async execute(): Promise<Animal[]> {
    return await this.animalRepository.findAll();
  }
}
