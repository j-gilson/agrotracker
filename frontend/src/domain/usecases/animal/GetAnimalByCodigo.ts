import { Animal } from "../../entities/Animal";
import { IAnimalRepository } from "../../repositories/IAnimalRepository";

export class GetAnimalByCodigo {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(
    fazendaId: string,
    codigoIdentificacao: string
  ): Promise<Animal | undefined> {
    const farmId = fazendaId?.trim() ?? "";
    const code = codigoIdentificacao?.trim() ?? "";
    if (!farmId) throw new Error("Fazenda e obrigatoria.");
    if (!code) throw new Error("Codigo de identificacao e obrigatorio.");

    return this.animalRepository.findByCodigoIdentificacao(farmId, code);
  }
}
