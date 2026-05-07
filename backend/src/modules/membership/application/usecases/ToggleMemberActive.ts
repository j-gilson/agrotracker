import { IFazendaMemberRepository } from "../../contracts/IFazendaMemberRepository";
import { MembershipError } from "../errors/MembershipError";

export interface ToggleMemberActiveInput {
  fazendaId: string;
  memberId: string;
  requestedByUserId: string;
}

export class ToggleMemberActive {
  constructor(private readonly memberRepository: IFazendaMemberRepository) {}

  async execute(input: ToggleMemberActiveInput) {
    const fazendaId = input.fazendaId?.trim() ?? "";
    const memberId = input.memberId?.trim() ?? "";
    const requestedByUserId = input.requestedByUserId?.trim() ?? "";

    if (!fazendaId || !memberId || !requestedByUserId) {
      throw new MembershipError("Dados invalidos.", 400);
    }

    const requester = await this.memberRepository.findByFazendaAndUser(fazendaId, requestedByUserId);
    if (!requester || !requester.active) throw new MembershipError("Acesso negado.", 403);
    if (requester.role !== "ADMIN") throw new MembershipError("Apenas ADMIN pode ativar/desativar.", 403);

    const member = await this.memberRepository.findById(memberId);
    if (!member || member.fazendaId !== fazendaId) throw new MembershipError("Membro nao encontrado.", 404);

    const nextActive = !member.active;

    if (member.role === "ADMIN" && member.active && !nextActive) {
      const activeAdmins = (await this.memberRepository.findAllByFazenda(fazendaId)).filter(
        (m) => m.role === "ADMIN" && m.active
      );
      if (activeAdmins.length <= 1) {
        throw new MembershipError("Nao e permitido desativar o ultimo ADMIN.", 409);
      }
    }

    const updated = member.withActive(nextActive);
    await this.memberRepository.update(updated);
    return updated;
  }
}
