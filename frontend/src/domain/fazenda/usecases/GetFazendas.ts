import { IFazendaRepository } from "../repositories/IFazendaRepository";
import { Fazenda } from "../entities/Fazenda";

export class GetFazendas {
  constructor(private fazendaRepository: IFazendaRepository) {}

  async execute(): Promise<Fazenda[]> {
    return await this.fazendaRepository.findAll();
  }
}
