import { IAnimalRepository } from "../repositories/IAnimalRepository";
import { Animal } from "../entities/Animal";
import { CreateAnimalDTO } from "../../dtos/AnimalDTO";
import { v4 as uuidv4 } from "uuid";

export class CreateAnimal {
  constructor(private animalRepository: IAnimalRepository) {}

  async execute(data: CreateAnimalDTO): Promise<Animal> {
    const nome = data.nome?.trim() ?? "";
    const raca = data.raca?.trim() ?? "";
    const fazendaId = data.fazendaId?.trim() ?? "";
    const idade = Number(data.idade);
    const peso = Number(data.peso);

    if (nome.length < 2) {
      throw new Error("O nome do animal deve ter pelo menos 2 caracteres.");
    }

    if (!raca) {
      throw new Error("A raça do animal é obrigatória.");
    }

    if (!fazendaId) {
      throw new Error("A fazenda do animal é obrigatória.");
    }

    if (!Number.isFinite(idade) || idade < 0) {
      throw new Error("A idade do animal deve ser um número maior ou igual a zero.");
    }

    if (!Number.isFinite(peso) || peso <= 0) {
      throw new Error("O peso do animal deve ser maior que zero.");
    }

    const animal = new Animal({
      id: uuidv4(),
      nome,
      raca,
      idade,
      peso,
      fazendaId,
      dataNascimento: data.dataNascimento || new Date(),
    });

    return this.animalRepository.create(animal);
  }
}
