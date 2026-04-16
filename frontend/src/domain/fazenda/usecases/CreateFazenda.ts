import { IFazendaRepository } from "../repositories/IFazendaRepository";
import { Fazenda } from "../entities/Fazenda";
import { CreateFazendaDTO } from "../dtos/FazendaDTO";

export class CreateFazenda {
  constructor(private fazendaRepository: IFazendaRepository) {}

  async execute(data: CreateFazendaDTO): Promise<Fazenda> {
    const fazenda = new Fazenda({
      nome: data.nome,
      localizacao: data.localizacao,
    });

    return await this.fazendaRepository.create(fazenda);
  }
}
