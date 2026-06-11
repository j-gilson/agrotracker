import { IAnimalRepository } from "../../repositories/IAnimalRepository";
import { Animal } from "../../entities/Animal";
import { CreateAnimalDTO } from "../../dtos/AnimalDTO";

export class CreateAnimal {
  constructor(private animalRepository: IAnimalRepository) {}

  async execute(data: CreateAnimalDTO): Promise<Animal> {
    return this.animalRepository.create(data);
  }
}
