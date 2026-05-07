import { v4 as uuidv4 } from "uuid";
import { Event } from "../../domain/entities/Event";
import { IEventRepository } from "../../domain/contracts/IEventRepository";
import { IAnimalRepository } from "../../../animal/domain/repositories/IAnimalRepository";
import { IFazendaMemberRepository } from "../../../membership/contracts/IFazendaMemberRepository";
import { EventError } from "../errors/EventError";

export interface CreateEventInput {
  animalId: string;
  fazendaId: string;
  type: string;
  description: string;
  date: Date;
  createdBy: string;
}

export class CreateEvent {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly animalRepository: IAnimalRepository,
    private readonly memberRepository: IFazendaMemberRepository
  ) {}

  async execute(input: CreateEventInput): Promise<Event> {
    const animalId = input.animalId?.trim() ?? "";
    const requestedFazendaId = input.fazendaId?.trim() ?? "";
    const type = input.type?.trim() ?? "";
    const description = input.description?.trim() ?? "";
    const createdBy = input.createdBy?.trim() ?? "";

    if (!animalId) throw new EventError("O animal do evento é obrigatório.", 400);
    if (!requestedFazendaId) throw new EventError("A fazenda do evento é obrigatória.", 400);
    if (!type) throw new EventError("O tipo do evento é obrigatório.", 400);
    if (!description) throw new EventError("A descrição do evento é obrigatória.", 400);
    if (!createdBy) throw new EventError("O usuário responsável pelo evento é obrigatório.", 400);

    const date = input.date instanceof Date ? input.date : new Date(input.date);
    if (Number.isNaN(date.getTime())) throw new EventError("Data invalida.", 400);

    const animal = await this.animalRepository.findById(animalId);
    if (!animal || !animal.id) throw new EventError("Animal nao encontrado.", 404);

    const fazendaId = animal.fazendaId?.trim() ?? "";
    if (!fazendaId) throw new EventError("Animal com fazenda invalida.", 500);

    if (fazendaId !== requestedFazendaId) {
      throw new EventError("Fazenda do animal nao corresponde.", 400);
    }

    const member = await this.memberRepository.findByFazendaAndUser(fazendaId, createdBy);
    if (!member) throw new EventError("Voce nao pertence a esta fazenda.", 403);
    if (!member.active) throw new EventError("Seu acesso a fazenda esta desativado.", 403);

    const now = new Date();
    const event = new Event({
      id: uuidv4(),
      animalId,
      fazendaId,
      type,
      description,
      date,
      createdBy,
      createdAt: now,
    });

    return this.eventRepository.save(event);
  }
}
