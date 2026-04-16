import { IFazendaRepository } from "../../domain/repositories/IFazendaRepository";
import { Fazenda } from "../../domain/entities/Fazenda";

export class FazendaRepository implements IFazendaRepository {
  private fazendas: Fazenda[] = [];

  async findAll(): Promise<Fazenda[]> {
    return this.fazendas;
  }

  async create(fazenda: Fazenda): Promise<Fazenda> {
    this.fazendas.push(fazenda);
    return fazenda;
  }
}
