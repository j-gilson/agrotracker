import { IUserRepository } from "../../../auth/domain/repositories/IUserRepository";
import { IFazendaMemberRepository } from "../../contracts/IFazendaMemberRepository";
import { MembershipError } from "../errors/MembershipError";

export interface FazendaMemberDTO {
  id: string;
  fazendaId: string;
  userId: string;
  nome: string;
  email: string;
  role: "ADMIN" | "FUNCIONARIO";
  active: boolean;
  createdAt: string;
}

export class GetMembersByFazenda {
  constructor(
    private readonly memberRepository: IFazendaMemberRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(fazendaId: string): Promise<FazendaMemberDTO[]> {
    const id = fazendaId?.trim() ?? "";
    if (!id) throw new MembershipError("Fazenda invalida.", 400);

    const members = await this.memberRepository.findAllByFazenda(id);

    const users = await Promise.all(members.map((m) => this.userRepository.findById(m.userId)));

    return members.map((member, index) => {
      const user = users[index];
      if (!user) {
        throw new MembershipError("Dados de membro inconsistentes.", 500);
      }

      return {
        id: member.id,
        fazendaId: member.fazendaId,
        userId: member.userId,
        nome: user.nome,
        email: user.email,
        role: member.role,
        active: member.active,
        createdAt: member.createdAt.toISOString(),
      };
    });
  }
}

