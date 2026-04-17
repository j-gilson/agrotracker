import { IAnimalRepository } from "../../repositories/IAnimalRepository";
import { Animal } from "../../entities/Animal";

export class GetAnimalById {
  constructor(private animalRepository: IAnimalRepository) {}

  async execute(id: string): Promise<Animal | undefined> {
    if (!id) throw new Error("ID do animal é obrigatório");
    return await this.animalRepository.findById(id);
  }
}
