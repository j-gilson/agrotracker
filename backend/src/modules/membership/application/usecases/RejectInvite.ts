import { IUserRepository } from "../../../auth/domain/repositories/IUserRepository";
import { IInviteRepository } from "../../contracts/IInviteRepository";
import { Invite } from "../../domain/entities/Invite";
import { MembershipError } from "../errors/MembershipError";

export interface RejectInviteInput {
  inviteId: string;
  userId: string;
}

export class RejectInvite {
  constructor(
    private readonly inviteRepository: IInviteRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: RejectInviteInput): Promise<Invite> {
    const inviteId = input.inviteId?.trim() ?? "";
    const userId = input.userId?.trim() ?? "";

    if (!inviteId) throw new MembershipError("Convite invalido.", 400);
    if (!userId) throw new MembershipError("Usuario invalido.", 400);

    const invite = await this.inviteRepository.findById(inviteId);
    if (!invite) throw new MembershipError("Convite nao encontrado.", 404);
    if (invite.status !== "PENDING") {
      throw new MembershipError("Convite invalido.", 409);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) throw new MembershipError("Usuario nao encontrado.", 404);

    if (
      user.email.trim().toLowerCase() !== invite.email.trim().toLowerCase()
    ) {
      throw new MembershipError(
        "Este convite nao pertence ao seu email.",
        403
      );
    }

    const rejected = invite.withStatus("RECUSADO");
    await this.inviteRepository.update(rejected);
    return rejected;
  }
}
