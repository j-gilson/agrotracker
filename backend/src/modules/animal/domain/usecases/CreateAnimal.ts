import { IAnimalRepository } from "../repositories/IAnimalRepository";
import { Animal } from "../entities/Animal";
import { CreateAnimalDTO } from "../../dtos/AnimalDTO";
import { v4 as uuidv4 } from "uuid";

export class CreateAnimal {
  constructor(private animalRepository: IAnimalRepository) {}

  async execute(data: CreateAnimalDTO): Promise<Animal> {
    const nome = data.nome?.trim() || undefined;
    const raca = data.raca?.trim() ?? "";
    const fazendaId = data.fazendaId?.trim() ?? "";
    const codigoIdentificacao = data.codigoIdentificacao?.trim() ?? "";
    const peso = Number(data.peso);
    const dataNascimento =
      data.dataNascimento instanceof Date
        ? data.dataNascimento
        : new Date(data.dataNascimento);

    if (!raca) throw new Error("A raca do animal e obrigatoria.");
    if (!fazendaId) throw new Error("A fazenda do animal e obrigatoria.");
    if (!codigoIdentificacao) {
      throw new Error("O codigo de identificacao e obrigatorio.");
    }

    if (!Number.isFinite(peso) || peso <= 0) {
      throw new Error("O peso do animal deve ser maior que zero.");
    }
    if (Number.isNaN(dataNascimento.getTime())) {
      throw new Error("Data de nascimento invalida.");
    }

    const existente = await this.animalRepository.findByCodigoIdentificacao(
      fazendaId,
      codigoIdentificacao
    );
    if (existente) {
      throw new Error("Ja existe um animal com este codigo nesta fazenda.");
    }

    const animal = new Animal({
      id: uuidv4(),
      fazendaId,
      codigoIdentificacao,
      nome,
      raca,
      peso,
      dataNascimento,
      status: "ATIVO",
      dataCriacao: new Date(),
    });

    return this.animalRepository.create(animal);
  }
}
