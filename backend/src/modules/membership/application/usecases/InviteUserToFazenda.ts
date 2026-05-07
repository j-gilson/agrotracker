import { randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { IUserRepository } from "../../../auth/domain/repositories/IUserRepository";
import { IFazendaMemberRepository } from "../../contracts/IFazendaMemberRepository";
import { IInviteRepository } from "../../contracts/IInviteRepository";
import { Invite } from "../../domain/entities/Invite";
import { MemberRole } from "../../domain/types";
import { MembershipError } from "../errors/MembershipError";

export interface InviteUserToFazendaInput {
  fazendaId: string;
  invitedByUserId: string;
  email: string;
  role: MemberRole;
}

export class InviteUserToFazenda {
  constructor(
    private readonly memberRepository: IFazendaMemberRepository,
    private readonly inviteRepository: IInviteRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: InviteUserToFazendaInput): Promise<Invite> {
    const fazendaId = input.fazendaId?.trim() ?? "";
    const invitedByUserId = input.invitedByUserId?.trim() ?? "";
    const email = input.email?.trim().toLowerCase() ?? "";

    if (!fazendaId) throw new MembershipError("Fazenda invalida.", 400);
    if (!invitedByUserId) throw new MembershipError("Usuario invalido.", 400);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new MembershipError("Email invalido.", 400);

    const inviterMember = await this.memberRepository.findByFazendaAndUser(
      fazendaId,
      invitedByUserId
    );
    if (!inviterMember || !inviterMember.active) {
      throw new MembershipError("Acesso negado.", 403);
    }
    if (inviterMember.role !== "ADMIN") {
      throw new MembershipError("Apenas ADMIN pode convidar membros.", 403);
    }

    const pending = await this.inviteRepository.findPendingByFazendaAndEmail(fazendaId, email);
    if (pending) {
      throw new MembershipError("Ja existe um convite pendente para este email.", 409);
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const existingMember = await this.memberRepository.findByFazendaAndUser(fazendaId, existingUser.id);
      if (existingMember) {
        throw new MembershipError("Usuario ja pertence a fazenda.", 409);
      }
    }

    const token = randomBytes(24).toString("hex");
    const invite = new Invite({
      id: uuidv4(),
      fazendaId,
      email,
      role: input.role,
      token,
      status: "PENDING",
      createdAt: new Date(),
    });

    return this.inviteRepository.save(invite);
  }
}
