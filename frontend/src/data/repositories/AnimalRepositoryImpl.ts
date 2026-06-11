import { IAnimalRepository } from "../../domain/repositories/IAnimalRepository";
import { Animal } from "../../domain/entities/Animal";
import {
  CreateAnimalDTO,
  UpdateAnimalDTO,
} from "../../domain/dtos/AnimalDTO";
import { AnimalResponse, animalApi } from "../api/animalApi";

const toDomain = (data: AnimalResponse): Animal =>
  new Animal({
    id: data.id,
    fazendaId: data.fazendaId,
    codigoIdentificacao: data.codigoIdentificacao,
    nome: data.nome?.trim() || undefined,
    raca: data.raca,
    peso: data.peso,
    dataNascimento: new Date(data.dataNascimento),
    status: data.status,
    dataCriacao: new Date(data.dataCriacao),
  });

export class AnimalRepositoryImpl implements IAnimalRepository {
  async findAllByFazenda(fazendaId: string): Promise<Animal[]> {
    return (await animalApi.fetchAnimals({ fazendaId })).map(toDomain);
  }

  async findById(id: string): Promise<Animal | undefined> {
    try {
      return toDomain(await animalApi.fetchAnimalById(id));
    } catch (error: unknown) {
      if ((error as { status?: number }).status === 404) return undefined;
      throw error;
    }
  }

  async findByCodigoIdentificacao(
    fazendaId: string,
    codigoIdentificacao: string
  ): Promise<Animal | undefined> {
    try {
      return toDomain(
        await animalApi.fetchAnimalByCode(fazendaId, codigoIdentificacao)
      );
    } catch (error: unknown) {
      if ((error as { status?: number }).status === 404) return undefined;
      throw error;
    }
  }

  async create(data: CreateAnimalDTO): Promise<Animal> {
    const result = await animalApi.createAnimal({
      fazendaId: data.fazendaId,
      codigoIdentificacao: data.codigoIdentificacao,
      nome: data.nome,
      raca: data.raca,
      peso: data.peso,
      dataNascimento: data.dataNascimento.toISOString(),
    });
    return toDomain(result);
  }

  async update(id: string, data: UpdateAnimalDTO): Promise<Animal> {
    return toDomain(await animalApi.updateAnimal(id, data));
  }
}
