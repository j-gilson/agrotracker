import { Request, Response } from "express";
import { CreateFazenda } from "../../domain/usecases/CreateFazenda";
import { GetFazendas } from "../../domain/usecases/GetFazendas";
import { Fazenda } from "../../domain/entities/Fazenda";

function toDTO(fazenda: Fazenda) {
  return {
    id: fazenda.id,
    nome: fazenda.nome,
    localizacao: fazenda.localizacao,
  };
}

export class FazendaController {
  constructor(
    private getFazendas: GetFazendas,
    private createFazenda: CreateFazenda
  ) {}

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const fazendas = await this.getFazendas.execute();
      const fazendasDTO = fazendas.map(toDTO);

      return res.status(200).json(fazendasDTO);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro interno";
      return res.status(500).json({ error: message });
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, localizacao } = req.body;

      if (!nome || !localizacao) {
        return res.status(400).json({ error: "Dados inválidos: nome e localizacao são obrigatórios" });
      }

      const fazenda = await this.createFazenda.execute({
        nome,
        localizacao,
      });

      return res.status(201).json(toDTO(fazenda));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro interno";
      return res.status(400).json({ error: message });
    }
  }
}
