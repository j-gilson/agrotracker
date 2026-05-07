import { Animal } from "../entities/Animal";

export interface IAnimalRepository {
  findAll(): Promise<Animal[]>;
  findById(id: string): Promise<Animal | undefined>;
  create(animal: Animal): Promise<Animal>;
  update(animal: Animal): Promise<Animal>;
  deleteById(id: string): Promise<void>;
}
