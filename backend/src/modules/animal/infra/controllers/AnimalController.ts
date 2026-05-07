import { Request, Response } from "express";
import { GetAnimals } from "../../domain/usecases/GetAnimals";
import { CreateAnimal } from "../../domain/usecases/CreateAnimal";
import { UpdateAnimal } from "../../domain/usecases/UpdateAnimal";
import { DeleteAnimal } from "../../domain/usecases/DeleteAnimal";
import { Animal } from "../../domain/entities/Animal";
import { CreateAuditLog } from "../../../audit/application/usecases/CreateAuditLog";
import { FazendaRepository } from "../../../fazenda/infra/repositories/FazendaRepository";
import { JsonObject } from "../../../audit/domain/types";

// ✅ DTO COMPLETO E CONSISTENTE
function toDTO(animal: Animal) {
  return {
    id: animal.id,
    nome: animal.nome,
    raca: animal.raca,
    idade: animal.idade,
    peso: animal.peso,
    fazendaId: animal.fazendaId,
    dataNascimento: animal.dataNascimento ?? null,
  };
}

function toAuditSnapshot(animal: Animal): JsonObject {
  return {
    id: animal.id ?? null,
    nome: animal.nome,
    raca: animal.raca,
    idade: animal.idade,
    peso: animal.peso,
    fazendaId: animal.fazendaId,
    dataNascimento: animal.dataNascimento ? animal.dataNascimento.toISOString() : null,
  };
}

export class AnimalController {
  constructor(
    private getAnimals: GetAnimals,
    private createAnimal: CreateAnimal,
    private updateAnimal: UpdateAnimal,
    private deleteAnimal: DeleteAnimal,
    private readonly fazendaRepository: FazendaRepository,
    private readonly createAuditLog: CreateAuditLog
  ) {}

  // ✅ LISTAR ANIMAIS
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const animals = await this.getAnimals.execute();
      const animalsDTO = animals.map(toDTO);

      return res.status(200).json(animalsDTO);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro interno";

      return res.status(500).json({ error: message });
    }
  }

  // ✅ CRIAR ANIMAL (VERSÃO ROBUSTA)
  async store(req: Request, res: Response): Promise<Response> {
    try {
      let { nome, raca, idade, peso, fazendaId } = req.body;

      // 🔥 SANITIZAÇÃO (remove espaços e evita strings vazias)
      nome = nome?.trim();
      raca = raca?.trim();
      fazendaId = fazendaId?.trim();

      const idadeNumber = Number(idade);
      const pesoNumber = Number(peso);

      // ✅ VALIDAÇÃO FORTE
      if (
        !nome ||
        !raca ||
        !fazendaId ||
        isNaN(idadeNumber) ||
        isNaN(pesoNumber)
      ) {
        return res.status(400).json({
          error:
            "Dados inválidos: nome, raca, idade, peso e fazendaId são obrigatórios",
        });
      }

      // 🔒 VALIDAÇÃO DE NEGÓCIO
      if (idadeNumber < 0) {
        return res.status(400).json({
          error: "Idade não pode ser negativa",
        });
      }

      if (pesoNumber <= 0) {
        return res.status(400).json({
          error: "Peso deve ser maior que zero",
        });
      }

      // ✅ EXECUTA CASO DE USO
      const animal = await this.createAnimal.execute({
        nome,
        raca,
        idade: idadeNumber,
        peso: pesoNumber,
        fazendaId,
      });

      const currentUser = res.locals.currentUser as { id: string; nome: string; email: string } | undefined;
      if (currentUser) {
        const fazenda = await this.fazendaRepository.findById(fazendaId);
        await this.createAuditLog.execute({
          userId: currentUser.id,
          userName: currentUser.nome,
          userEmail: currentUser.email,
          fazendaId,
          fazendaNome: fazenda?.nome ?? null,
          entityType: "animal",
          entityId: animal.id ?? null,
          action: "CREATE",
          description: `${currentUser.nome} criou o animal ${animal.nome}.`,
          before: null,
          after: toAuditSnapshot(animal),
        });
      }

      return res.status(201).json(toDTO(animal));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro interno";

      return res.status(400).json({ error: message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id ?? "");
      const nome = typeof req.body?.nome === "string" ? req.body.nome.trim() : undefined;
      const raca = typeof req.body?.raca === "string" ? req.body.raca.trim() : undefined;
      const idade = req.body?.idade !== undefined ? Number(req.body.idade) : undefined;
      const peso = req.body?.peso !== undefined ? Number(req.body.peso) : undefined;
      const dataNascimento =
        typeof req.body?.dataNascimento === "string" ? new Date(req.body.dataNascimento) : undefined;

      if (idade !== undefined && Number.isNaN(idade)) {
        return res.status(400).json({ error: "Idade invalida" });
      }
      if (peso !== undefined && Number.isNaN(peso)) {
        return res.status(400).json({ error: "Peso invalido" });
      }
      if (dataNascimento && Number.isNaN(dataNascimento.getTime())) {
        return res.status(400).json({ error: "Data de nascimento invalida" });
      }

      const { before, after } = await this.updateAnimal.execute({
        id,
        nome,
        raca,
        idade,
        peso,
        dataNascimento,
      });

      const currentUser = res.locals.currentUser as { id: string; nome: string; email: string } | undefined;
      if (currentUser) {
        const fazenda = await this.fazendaRepository.findById(after.fazendaId);
        await this.createAuditLog.execute({
          userId: currentUser.id,
          userName: currentUser.nome,
          userEmail: currentUser.email,
          fazendaId: after.fazendaId,
          fazendaNome: fazenda?.nome ?? null,
          entityType: "animal",
          entityId: after.id ?? null,
          action: "UPDATE",
          description: `${currentUser.nome} atualizou o animal ${after.nome}.`,
          before: toAuditSnapshot(before),
          after: toAuditSnapshot(after),
        });
      }

      return res.status(200).json(toDTO(after));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro interno";
      return res.status(400).json({ error: message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = String(req.params.id ?? "");
      const deleted = await this.deleteAnimal.execute(id);

      const currentUser = res.locals.currentUser as { id: string; nome: string; email: string } | undefined;
      if (currentUser) {
        const fazenda = await this.fazendaRepository.findById(deleted.fazendaId);
        await this.createAuditLog.execute({
          userId: currentUser.id,
          userName: currentUser.nome,
          userEmail: currentUser.email,
          fazendaId: deleted.fazendaId,
          fazendaNome: fazenda?.nome ?? null,
          entityType: "animal",
          entityId: deleted.id ?? null,
          action: "DELETE",
          description: `${currentUser.nome} removeu o animal ${deleted.nome}.`,
          before: toAuditSnapshot(deleted),
          after: null,
        });
      }

      return res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro interno";
      return res.status(400).json({ error: message });
    }
  }
}
