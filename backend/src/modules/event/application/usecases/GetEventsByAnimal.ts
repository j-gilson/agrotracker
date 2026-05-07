import { IEventRepository } from "../../domain/contracts/IEventRepository";
import { IAnimalRepository } from "../../../animal/domain/repositories/IAnimalRepository";
import { IFazendaMemberRepository } from "../../../membership/contracts/IFazendaMemberRepository";
import { Event } from "../../domain/entities/Event";
import { EventError } from "../errors/EventError";

export class GetEventsByAnimal {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly animalRepository: IAnimalRepository,
    private readonly memberRepository: IFazendaMemberRepository
  ) {}

  async execute(animalId: string, userId: string): Promise<Event[]> {
    const id = animalId?.trim() ?? "";
    const uid = userId?.trim() ?? "";
    if (!id) throw new EventError("Animal invalido.", 400);
    if (!uid) throw new EventError("Usuario invalido.", 401);

    const animal = await this.animalRepository.findById(id);
    if (!animal || !animal.id) throw new EventError("Animal nao encontrado.", 404);

    const fazendaId = animal.fazendaId?.trim() ?? "";
    if (!fazendaId) throw new EventError("Animal com fazenda invalida.", 500);

    const member = await this.memberRepository.findByFazendaAndUser(fazendaId, uid);
    if (!member) throw new EventError("Voce nao pertence a esta fazenda.", 403);
    if (!member.active) throw new EventError("Seu acesso a fazenda esta desativado.", 403);

    const events = await this.eventRepository.findByAnimalId(id);
    events.sort((a, b) => b.date.getTime() - a.date.getTime());
    return events;
  }
}
