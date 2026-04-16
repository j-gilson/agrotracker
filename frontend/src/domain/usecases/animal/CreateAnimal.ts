import { IAnimalRepository } from "../../repositories/IAnimalRepository";
import { Animal } from "../../entities/Animal";
import { CreateAnimalDTO } from "../../dtos/AnimalDTO";

export class CreateAnimal {
  constructor(private animalRepository: IAnimalRepository) {}

  async execute(data: CreateAnimalDTO): Promise<Animal> {
    const animal = new Animal({
      nome: data.nome,
      raca: data.raca,
      idade: data.idade,
      peso: data.peso,
      fazendaId: data.fazendaId
    });

    return await this.animalRepository.create(animal);
  }
}
