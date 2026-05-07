import { IFazendaMemberRepository } from "../../contracts/IFazendaMemberRepository";
import { MembershipError } from "../errors/MembershipError";

export interface RemoveMemberInput {
  fazendaId: string;
  memberId: string;
  requestedByUserId: string;
}

export class RemoveMember {
  constructor(private readonly memberRepository: IFazendaMemberRepository) {}

  async execute(input: RemoveMemberInput): Promise<void> {
    const fazendaId = input.fazendaId?.trim() ?? "";
    const memberId = input.memberId?.trim() ?? "";
    const requestedByUserId = input.requestedByUserId?.trim() ?? "";

    if (!fazendaId || !memberId || !requestedByUserId) {
      throw new MembershipError("Dados invalidos.", 400);
    }

    const requester = await this.memberRepository.findByFazendaAndUser(fazendaId, requestedByUserId);
    if (!requester || !requester.active) throw new MembershipError("Acesso negado.", 403);
    if (requester.role !== "ADMIN") throw new MembershipError("Apenas ADMIN pode remover membros.", 403);

    const member = await this.memberRepository.findById(memberId);
    if (!member || member.fazendaId !== fazendaId) throw new MembershipError("Membro nao encontrado.", 404);

    if (member.role === "ADMIN") {
      const activeAdmins = (await this.memberRepository.findAllByFazenda(fazendaId)).filter(
        (m) => m.role === "ADMIN" && m.active
      );
      if (activeAdmins.length <= 1) {
        throw new MembershipError("Nao e permitido remover o ultimo ADMIN.", 409);
      }
    }

    await this.memberRepository.deleteById(memberId);
  }
}
