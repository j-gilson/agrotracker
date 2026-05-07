import { Fazenda } from "../entities/Fazenda";

export interface IFazendaRepository {
  findAll(): Promise<Fazenda[]>;
  findById(id: string): Promise<Fazenda | undefined>;
  create(fazenda: Fazenda): Promise<Fazenda>;
  update(fazenda: Fazenda): Promise<Fazenda>;
}
