import { Request, Response } from "express";
import { CreateAnimal } from "../../domain/usecases/CreateAnimal";
import { UpdateAnimal } from "../../domain/usecases/UpdateAnimal";
import { Animal, StatusAnimal } from "../../domain/entities/Animal";
import { IAnimalRepository } from "../../domain/repositories/IAnimalRepository";

export const toAnimalDTO = (animal: Animal) => ({
  id: animal.id,
  fazendaId: animal.fazendaId,
  codigoIdentificacao: animal.codigoIdentificacao,
  nome: animal.nome ?? null,
  raca: animal.raca,
  peso: animal.peso,
  dataNascimento: animal.dataNascimento.toISOString(),
  status: animal.status,
  dataCriacao: animal.dataCriacao.toISOString(),
});

export class AnimalController {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly createAnimal: CreateAnimal,
    private readonly updateAnimal: UpdateAnimal
  ) {}

  async show(req: Request, res: Response): Promise<Response> {
    const animal = await this.animalRepository.findById(String(req.params.id ?? ""));
    if (!animal) return res.status(404).json({ error: "Animal nao encontrado." });
    return res.status(200).json(toAnimalDTO(animal));
  }

  async findByCode(req: Request, res: Response): Promise<Response> {
    const fazendaId =
      typeof req.query.fazendaId === "string" ? req.query.fazendaId.trim() : "";
    const codigoIdentificacao =
      typeof req.query.codigoIdentificacao === "string"
        ? req.query.codigoIdentificacao.trim()
        : "";

    if (!fazendaId || !codigoIdentificacao) {
      return res.status(400).json({
        error: "fazendaId e codigoIdentificacao sao obrigatorios.",
      });
    }

    const animal = await this.animalRepository.findByCodigoIdentificacao(
      fazendaId,
      codigoIdentificacao
    );
    if (!animal) return res.status(404).json({ error: "Animal nao encontrado." });
    return res.status(200).json(toAnimalDTO(animal));
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const fazendaId =
        typeof req.body?.fazendaId === "string" ? req.body.fazendaId.trim() : "";
      const codigoIdentificacao =
        typeof req.body?.codigoIdentificacao === "string"
          ? req.body.codigoIdentificacao.trim()
          : "";
      const nome =
        typeof req.body?.nome === "string" ? req.body.nome.trim() : undefined;
      const raca =
        typeof req.body?.raca === "string" ? req.body.raca.trim() : "";
      const peso = Number(req.body?.peso);
      const dataNascimento = new Date(req.body?.dataNascimento);

      if (Number.isNaN(dataNascimento.getTime())) {
        return res.status(400).json({ error: "Data de nascimento invalida." });
      }

      const animal = await this.createAnimal.execute({
        fazendaId,
        codigoIdentificacao,
        nome,
        raca,
        peso,
        dataNascimento,
      });

      return res.status(201).json(toAnimalDTO(animal));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro interno";
      return res.status(400).json({ error: message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id ?? "");
      const nome =
        req.body?.nome === null
          ? null
          : typeof req.body?.nome === "string"
          ? req.body.nome.trim()
          : undefined;
      const raca =
        typeof req.body?.raca === "string" ? req.body.raca.trim() : undefined;
      const peso =
        req.body?.peso !== undefined ? Number(req.body.peso) : undefined;
      const status =
        typeof req.body?.status === "string"
          ? (req.body.status as StatusAnimal)
          : undefined;

      if (peso !== undefined && Number.isNaN(peso)) {
        return res.status(400).json({ error: "Peso invalido." });
      }

      const { after } = await this.updateAnimal.execute({
        id,
        nome,
        raca,
        peso,
        status,
      });

      return res.status(200).json(toAnimalDTO(after));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro interno";
      return res.status(400).json({ error: message });
    }
  }
}
