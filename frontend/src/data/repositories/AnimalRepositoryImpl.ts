import { IAnimalRepository } from "../../domain/repositories/IAnimalRepository";
import { Animal } from "../../domain/entities/Animal";
import { animalApi } from "../api/animalApi";

export class AnimalRepositoryImpl implements IAnimalRepository {
  async findAllByFazenda(fazendaId: string): Promise<Animal[]> {
    const animalsData = await animalApi.fetchAnimals();

    return animalsData
      .filter(data => data.fazendaId === fazendaId)
      .map(data => new Animal({
        id: data.id,
        nome: data.nome,
        raca: data.raca,
        idade: data.idade,
        peso: data.peso,
        fazendaId: data.fazendaId,
        dataNascimento: data.dataNascimento
          ? new Date(data.dataNascimento)
          : undefined
      }));
  }

  async findById(id: string): Promise<Animal | undefined> {
    const animalsData = await animalApi.fetchAnimals();
    const data = animalsData.find(a => a.id === id);

    if (!data) return undefined;

    return new Animal({
      id: data.id,
      nome: data.nome,
      raca: data.raca,
      idade: data.idade,
      peso: data.peso,
      fazendaId: data.fazendaId,
      dataNascimento: data.dataNascimento
        ? new Date(data.dataNascimento)
        : undefined
    });
  }

  async create(animal: Animal): Promise<Animal> {
    const result = await animalApi.createAnimal({
      nome: animal.nome,
      raca: animal.raca,
      idade: animal.idade,
      peso: animal.peso,
      fazendaId: animal.fazendaId,
      dataNascimento: animal.dataNascimento?.toISOString()
    });

    return new Animal({
      id: result.id,
      nome: result.nome,
      raca: result.raca,
      idade: result.idade,
      peso: result.peso,
      fazendaId: result.fazendaId,
      dataNascimento: result.dataNascimento ? new Date(result.dataNascimento) : undefined
    });
  }

  async delete(id: string): Promise<void> {
    // Simula a remoção de um animal (Mock)
    return;
  }
}
