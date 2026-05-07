import { IEventRepository } from "../../domain/contracts/IEventRepository";
import { IFazendaMemberRepository } from "../../../membership/contracts/IFazendaMemberRepository";
import { Event } from "../../domain/entities/Event";
import { EventError } from "../errors/EventError";

export class GetEventsByFazenda {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly memberRepository: IFazendaMemberRepository
  ) {}

  async execute(fazendaId: string, userId: string): Promise<Event[]> {
    const fid = fazendaId?.trim() ?? "";
    const uid = userId?.trim() ?? "";
    if (!fid) throw new EventError("Fazenda invalida.", 400);
    if (!uid) throw new EventError("Usuario invalido.", 401);

    const member = await this.memberRepository.findByFazendaAndUser(fid, uid);
    if (!member) throw new EventError("Voce nao pertence a esta fazenda.", 403);
    if (!member.active) throw new EventError("Seu acesso a fazenda esta desativado.", 403);

    const events = await this.eventRepository.findByFazendaId(fid);
    events.sort((a, b) => b.date.getTime() - a.date.getTime());
    return events;
  }
}
