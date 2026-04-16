import { IAnimalRepository } from "../../domain/repositories/IAnimalRepository";
import { Animal } from "../../domain/entities/Animal";

export class AnimalRepository implements IAnimalRepository {
  private animals: Animal[] = [];

  async findAll(): Promise<Animal[]> {
    return this.animals;
  }

  async findById(id: string): Promise<Animal | undefined> {
    return this.animals.find((animal) => animal.id === id);
  }

  // async create(animal: Animal): Promise<Animal> {
  //   this.animals.push(animal);
  //   return animal;
  // }
  async create(animal: Animal): Promise<Animal> {
  const newAnimal = new Animal({
    id: animal.id, // // ✅ AQUI GERA O ID
    nome: animal.nome,
    raca: animal.raca,
    idade: animal.idade,
    peso: animal.peso,
    fazendaId: animal.fazendaId,
    dataNascimento: animal.dataNascimento,
  });


  this.animals.push(newAnimal);
  return newAnimal;
}
}
function uuidv4(): string {
  throw new Error("Function not implemented.");
}

