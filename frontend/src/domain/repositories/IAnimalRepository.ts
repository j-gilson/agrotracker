import { Animal } from "../entities/Animal";
import { CreateAnimalDTO, UpdateAnimalDTO } from "../dtos/AnimalDTO";

export interface IAnimalRepository {
  findAllByFazenda(fazendaId: string): Promise<Animal[]>;
  findById(id: string): Promise<Animal | undefined>;
  findByCodigoIdentificacao(
    fazendaId: string,
    codigoIdentificacao: string
  ): Promise<Animal | undefined>;
  create(data: CreateAnimalDTO): Promise<Animal>;
  update(id: string, data: UpdateAnimalDTO): Promise<Animal>;
}
