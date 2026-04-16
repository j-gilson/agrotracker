import { IFazendaRepository } from "../repositories/IFazendaRepository";
import { Fazenda } from "../entities/Fazenda";
import { CreateFazendaDTO } from "../../dtos/FazendaDTO";
import { v4 as uuidv4 } from "uuid";

export class CreateFazenda {
  constructor(private fazendaRepository: IFazendaRepository) {}

  async execute(data: CreateFazendaDTO): Promise<Fazenda> {
    const fazenda = new Fazenda({
      id: uuidv4(),
      nome: data.nome,
      localizacao: data.localizacao,
    });

    return await this.fazendaRepository.create(fazenda);
  }
}
