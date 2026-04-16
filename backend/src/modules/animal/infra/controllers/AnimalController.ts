import { Request, Response } from "express";
import { GetAnimals } from "../../domain/usecases/GetAnimals";
import { CreateAnimal } from "../../domain/usecases/CreateAnimal";
import { Animal } from "../../domain/entities/Animal";

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

export class AnimalController {
  constructor(
    private getAnimals: GetAnimals,
    private createAnimal: CreateAnimal
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

      return res.status(201).json(toDTO(animal));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro interno";

      return res.status(400).json({ error: message });
    }
  }
}