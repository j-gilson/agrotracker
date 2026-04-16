import { Animal } from "../entities/Animal";

export interface IAnimalRepository {
  findAllByFazenda(fazendaId: string): Promise<Animal[]>;
  findById(id: string): Promise<Animal | undefined>;
  create(animal: Animal): Promise<Animal>;
  delete(id: string): Promise<void>;
}
