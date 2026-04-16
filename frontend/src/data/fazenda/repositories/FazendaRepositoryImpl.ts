import { IFazendaRepository } from "../../../domain/fazenda/repositories/IFazendaRepository";
import { Fazenda } from "../../../domain/fazenda/entities/Fazenda";
import { fazendaApi } from "../api/fazendaApi";

export class FazendaRepositoryImpl implements IFazendaRepository {
  async findAll(): Promise<Fazenda[]> {
    const data = await fazendaApi.fetchFazendas();
    
    return data.map(item => new Fazenda({
      id: item.id,
      nome: item.nome,
      localizacao: item.localizacao
    }));
  }

  async create(fazenda: Fazenda): Promise<Fazenda> {
    const result = await fazendaApi.createFazenda({
      nome: fazenda.nome,
      localizacao: fazenda.localizacao
    });

    return new Fazenda({
      id: result.id,
      nome: result.nome,
      localizacao: result.localizacao
    });
  }
}
