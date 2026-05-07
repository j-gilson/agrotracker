import { IFazendaRepository } from "../repositories/IFazendaRepository";
import { Fazenda } from "../entities/Fazenda";

export interface UpdateFazendaInput {
  id: string;
  nome?: string;
  localizacao?: string;
}

export class UpdateFazenda {
  constructor(private readonly fazendaRepository: IFazendaRepository) {}

  async execute(input: UpdateFazendaInput): Promise<{ before: Fazenda; after: Fazenda }> {
    const id = input.id?.trim() ?? "";
    if (!id) throw new Error("ID da fazenda é obrigatório.");

    if (input.nome !== undefined && !input.nome.trim()) {
      throw new Error("O nome da fazenda é obrigatório.");
    }

    if (input.localizacao !== undefined && !input.localizacao.trim()) {
      throw new Error("A localização da fazenda é obrigatória.");
    }

    const existing = await this.fazendaRepository.findById(id);
    if (!existing || !existing.id) throw new Error("Fazenda não encontrada.");

    const updated = new Fazenda({
      id: existing.id,
      nome: input.nome !== undefined ? input.nome.trim() : existing.nome,
      localizacao: input.localizacao !== undefined ? input.localizacao.trim() : existing.localizacao,
    });

    await this.fazendaRepository.update(updated);

    return { before: existing, after: updated };
  }
}
