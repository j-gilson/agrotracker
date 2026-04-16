import { IAnimalRepository } from "../repositories/IAnimalRepository";
import { Animal } from "../entities/Animal";
import { CreateAnimalDTO } from "../../dtos/AnimalDTO";
import { v4 as uuidv4 } from "uuid";

export class CreateAnimal {
  constructor(private animalRepository: IAnimalRepository) {}

  async execute(data: CreateAnimalDTO): Promise<Animal> {
    if (data.peso === undefined || !data.fazendaId) {
      throw new Error("Peso e fazendaId são obrigatórios");
    }

    if (!data.nome || !data.raca) {
      throw new Error("Nome e raça são obrigatórios");
    }

    const animal = new Animal({
      id: uuidv4(),
      nome: data.nome,
      raca: data.raca,
      idade: data.idade,
      peso: data.peso,
      fazendaId: data.fazendaId,
      dataNascimento: data.dataNascimento || new Date(),
    });

    return this.animalRepository.create(animal);
  }
}