import { IFazendaMemberRepository } from "../../contracts/IFazendaMemberRepository";
import { MemberRole } from "../../domain/types";
import { MembershipError } from "../errors/MembershipError";

export interface ChangeMemberRoleInput {
  fazendaId: string;
  memberId: string;
  requestedByUserId: string;
  role: MemberRole;
}

export class ChangeMemberRole {
  constructor(private readonly memberRepository: IFazendaMemberRepository) {}

  async execute(input: ChangeMemberRoleInput) {
    const fazendaId = input.fazendaId?.trim() ?? "";
    const memberId = input.memberId?.trim() ?? "";
    const requestedByUserId = input.requestedByUserId?.trim() ?? "";

    if (!fazendaId || !memberId || !requestedByUserId) {
      throw new MembershipError("Dados invalidos.", 400);
    }

    const requester = await this.memberRepository.findByFazendaAndUser(fazendaId, requestedByUserId);
    if (!requester || !requester.active) throw new MembershipError("Acesso negado.", 403);
    if (requester.role !== "ADMIN") throw new MembershipError("Apenas ADMIN pode alterar papel.", 403);

    const member = await this.memberRepository.findById(memberId);
    if (!member || member.fazendaId !== fazendaId) throw new MembershipError("Membro nao encontrado.", 404);

    if (member.role === "ADMIN" && input.role !== "ADMIN") {
      const admins = (await this.memberRepository.findAllByFazenda(fazendaId)).filter(
        (m) => m.role === "ADMIN" && m.active
      );
      if (admins.length <= 1) {
        throw new MembershipError("Nao e permitido remover o ultimo ADMIN.", 409);
      }

      if (member.userId === requestedByUserId && admins.length <= 1) {
        throw new MembershipError("Voce nao pode se rebaixar sendo o unico ADMIN.", 409);
      }
    }

    const updated = member.withRole(input.role);
    await this.memberRepository.update(updated);
    return updated;
  }
}
