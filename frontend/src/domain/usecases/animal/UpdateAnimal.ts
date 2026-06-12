import { IAnimalRepository } from "../../repositories/IAnimalRepository";
import { Animal } from "../../entities/Animal";
import { UpdateAnimalDTO } from "../../dtos/AnimalDTO";

export class UpdateAnimal {
  constructor(private animalRepository: IAnimalRepository) {}

  async execute(id: string, data: UpdateAnimalDTO): Promise<Animal> {
    return this.animalRepository.update(id, data);
  }
}
