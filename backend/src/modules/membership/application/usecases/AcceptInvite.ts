import { IFazendaMemberRepository } from "../../contracts/IFazendaMemberRepository";
import { IInviteRepository } from "../../contracts/IInviteRepository";
import { IUserRepository } from "../../../auth/domain/repositories/IUserRepository";
import { MembershipError } from "../errors/MembershipError";
import { AddMemberToFazenda } from "./AddMemberToFazenda";
import { Invite } from "../../domain/entities/Invite";

export interface AcceptInviteInput {
  token: string;
  userId: string;
}

export class AcceptInvite {
  constructor(
    private readonly inviteRepository: IInviteRepository,
    private readonly userRepository: IUserRepository,
    private readonly addMemberToFazenda: AddMemberToFazenda,
    private readonly memberRepository: IFazendaMemberRepository
  ) {}

  async execute(input: AcceptInviteInput): Promise<Invite> {
    const token = input.token?.trim() ?? "";
    const userId = input.userId?.trim() ?? "";
    if (!token) throw new MembershipError("Token invalido.", 400);
    if (!userId) throw new MembershipError("Usuario invalido.", 400);

    const invite = await this.inviteRepository.findByToken(token);
    if (!invite) throw new MembershipError("Convite nao encontrado.", 404);
    if (invite.status !== "PENDING") throw new MembershipError("Convite invalido.", 409);

    const user = await this.userRepository.findById(userId);
    if (!user) throw new MembershipError("Usuario nao encontrado.", 404);

    const emailMatches = user.email.trim().toLowerCase() === invite.email.trim().toLowerCase();
    if (!emailMatches) {
      throw new MembershipError("Este convite nao pertence ao seu email.", 403);
    }

    const existing = await this.memberRepository.findByFazendaAndUser(invite.fazendaId, user.id);
    if (existing) {
      throw new MembershipError("Voce ja pertence a esta fazenda.", 409);
    }

    await this.addMemberToFazenda.execute({
      fazendaId: invite.fazendaId,
      userId: user.id,
      role: invite.role,
    });

    const accepted = invite.withStatus("ACCEPTED");
    await this.inviteRepository.update(accepted);
    return accepted;
  }
}
