import { v4 as uuidv4 } from "uuid";
import { IFazendaMemberRepository } from "../../contracts/IFazendaMemberRepository";
import { FazendaMember } from "../../domain/entities/FazendaMember";
import { MemberRole } from "../../domain/types";
import { MembershipError } from "../errors/MembershipError";

export interface AddMemberToFazendaInput {
  fazendaId: string;
  userId: string;
  role: MemberRole;
}

export class AddMemberToFazenda {
  constructor(private readonly memberRepository: IFazendaMemberRepository) {}

  async execute(input: AddMemberToFazendaInput): Promise<FazendaMember> {
    const fazendaId = input.fazendaId?.trim() ?? "";
    const userId = input.userId?.trim() ?? "";

    if (!fazendaId) throw new MembershipError("Fazenda invalida.", 400);
    if (!userId) throw new MembershipError("Usuario invalido.", 400);

    const existing = await this.memberRepository.findByFazendaAndUser(fazendaId, userId);
    if (existing) {
      throw new MembershipError("Usuario ja pertence a fazenda.", 409);
    }

    const member = new FazendaMember({
      id: uuidv4(),
      fazendaId,
      userId,
      role: input.role,
      active: true,
      createdAt: new Date(),
    });

    return this.memberRepository.save(member);
  }
}
