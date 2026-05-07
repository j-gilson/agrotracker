import { IFazendaRepository } from "../repositories/IFazendaRepository";
import { Fazenda } from "../entities/Fazenda";
import { CreateFazendaDTO } from "../../dtos/FazendaDTO";
import { v4 as uuidv4 } from "uuid";

export class CreateFazenda {
  constructor(private fazendaRepository: IFazendaRepository) {}

  async execute(data: CreateFazendaDTO): Promise<Fazenda> {
    const nome = data.nome?.trim() ?? "";
    const localizacao = data.localizacao?.trim() ?? "";

    if (!nome) {
      throw new Error("O nome da fazenda é obrigatório.");
    }

    if (!localizacao) {
      throw new Error("A localização da fazenda é obrigatória.");
    }

    const fazenda = new Fazenda({
      id: uuidv4(),
      nome,
      localizacao,
    });

    return await this.fazendaRepository.create(fazenda);
  }
}
