import { IFazendaRepository } from "../../../fazenda/domain/repositories/IFazendaRepository";
import { IInviteRepository } from "../../contracts/IInviteRepository";
import { MembershipError } from "../errors/MembershipError";

export interface PendingInviteDTO {
  id: string;
  fazendaId: string;
  fazendaNome: string;
  email: string;
  role: "ADMIN" | "FUNCIONARIO";
  token: string;
  status: "PENDING";
  createdAt: string;
}

export class GetPendingInvites {
  constructor(
    private readonly inviteRepository: IInviteRepository,
    private readonly fazendaRepository: IFazendaRepository
  ) {}

  async execute(email: string): Promise<PendingInviteDTO[]> {
    const normalizedEmail = email?.trim().toLowerCase() ?? "";
    if (!normalizedEmail) {
      throw new MembershipError("Email invalido.", 400);
    }

    const invites = await this.inviteRepository.findPendingByEmail(
      normalizedEmail
    );

    return Promise.all(
      invites.map(async (invite) => {
        const fazenda = await this.fazendaRepository.findById(invite.fazendaId);
        if (!fazenda) {
          throw new MembershipError("Fazenda do convite nao encontrada.", 500);
        }

        return {
          id: invite.id,
          fazendaId: invite.fazendaId,
          fazendaNome: fazenda.nome,
          email: invite.email,
          role: invite.role,
          token: invite.token,
          status: "PENDING" as const,
          createdAt: invite.createdAt.toISOString(),
        };
      })
    );
  }
}
