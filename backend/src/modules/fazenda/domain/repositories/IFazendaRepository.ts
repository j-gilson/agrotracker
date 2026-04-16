import { Fazenda } from "../entities/Fazenda";

export interface IFazendaRepository {
  findAll(): Promise<Fazenda[]>;
  create(fazenda: Fazenda): Promise<Fazenda>;
}
