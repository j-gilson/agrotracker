import { Request, Response } from "express";
import { MembershipError } from "../../application/errors/MembershipError";
import { AcceptInvite } from "../../application/usecases/AcceptInvite";
import { ChangeMemberRole } from "../../application/usecases/ChangeMemberRole";
import { GetMembersByFazenda } from "../../application/usecases/GetMembersByFazenda";
import { InviteUserToFazenda } from "../../application/usecases/InviteUserToFazenda";
import { RemoveMember } from "../../application/usecases/RemoveMember";
import { ToggleMemberActive } from "../../application/usecases/ToggleMemberActive";
import { MemberRole } from "../../domain/types";
import { CreateAuditLog } from "../../../audit/application/usecases/CreateAuditLog";
import { FazendaRepository } from "../../../fazenda/infra/repositories/FazendaRepository";

export class MembershipController {
  constructor(
    private readonly inviteUserToFazenda: InviteUserToFazenda,
    private readonly acceptInvite: AcceptInvite,
    private readonly getMembersByFazenda: GetMembersByFazenda,
    private readonly changeMemberRole: ChangeMemberRole,
    private readonly toggleMemberActive: ToggleMemberActive,
    private readonly removeMember: RemoveMember,
    private readonly fazendaRepository: FazendaRepository,
    private readonly createAuditLog: CreateAuditLog
  ) {}

  private async getFazendaNome(fazendaId: string): Promise<string | null> {
    const fazenda = await this.fazendaRepository.findById(fazendaId);
    return fazenda?.nome ?? null;
  }

  async invite(req: Request, res: Response): Promise<Response> {
    try {
      const fazendaId = req.params.id as string;
      const { email, role } = req.body as { email?: string; role?: MemberRole };
      const currentUser = res.locals.currentUser as { id: string; nome: string; email: string } | undefined;

      const invite = await this.inviteUserToFazenda.execute({
        fazendaId,
        invitedByUserId: currentUser?.id ?? "",
        email: email ?? "",
        role: role ?? "FUNCIONARIO",
      });

      if (currentUser) {
        await this.createAuditLog.execute({
          userId: currentUser.id,
          userName: currentUser.nome,
          userEmail: currentUser.email,
          fazendaId,
          fazendaNome: await this.getFazendaNome(fazendaId),
          entityType: "membro",
          entityId: invite.id,
          action: "INVITE_USER",
          description: `${currentUser.nome} convidou ${invite.email} como ${invite.role}.`,
          before: null,
          after: { inviteId: invite.id, email: invite.email, role: invite.role, status: invite.status },
        });
      }

      return res.status(201).json({
        success: true,
        invite: {
          id: invite.id,
          fazendaId: invite.fazendaId,
          email: invite.email,
          role: invite.role,
          token: invite.token,
          status: invite.status,
          createdAt: invite.createdAt.toISOString(),
        },
      });
    } catch (error: unknown) {
      if (error instanceof MembershipError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao enviar convite." });
    }
  }

  async accept(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.body as { token?: string };
      const currentUser = res.locals.currentUser as { id: string; nome: string; email: string } | undefined;

      const invite = await this.acceptInvite.execute({
        token: token ?? "",
        userId: currentUser?.id ?? "",
      });

      if (currentUser) {
        await this.createAuditLog.execute({
          userId: currentUser.id,
          userName: currentUser.nome,
          userEmail: currentUser.email,
          fazendaId: invite.fazendaId,
          fazendaNome: await this.getFazendaNome(invite.fazendaId),
          entityType: "membro",
          entityId: invite.id,
          action: "ACCEPT_INVITE",
          description: `${currentUser.nome} aceitou o convite.`,
          before: { status: "PENDING" },
          after: { status: invite.status },
        });
      }

      return res.status(200).json({
        success: true,
        invite: {
          id: invite.id,
          fazendaId: invite.fazendaId,
          email: invite.email,
          role: invite.role,
          status: invite.status,
          createdAt: invite.createdAt.toISOString(),
        },
      });
    } catch (error: unknown) {
      if (error instanceof MembershipError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao aceitar convite." });
    }
  }

  async listMembers(req: Request, res: Response): Promise<Response> {
    try {
      const fazendaId = req.params.id as string;
      const members = await this.getMembersByFazenda.execute(fazendaId);
      return res.status(200).json({ success: true, members });
    } catch (error: unknown) {
      if (error instanceof MembershipError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao listar membros." });
    }
  }

  async changeRole(req: Request, res: Response): Promise<Response> {
    try {
      const fazendaId = req.params.id as string;
      const memberId = req.params.memberId as string;
      const { role } = req.body as { role?: MemberRole };
      const currentUser = res.locals.currentUser as { id: string; nome: string; email: string } | undefined;

      const updated = await this.changeMemberRole.execute({
        fazendaId,
        memberId,
        requestedByUserId: currentUser?.id ?? "",
        role: role ?? "FUNCIONARIO",
      });

      if (currentUser) {
        await this.createAuditLog.execute({
          userId: currentUser.id,
          userName: currentUser.nome,
          userEmail: currentUser.email,
          fazendaId,
          fazendaNome: await this.getFazendaNome(fazendaId),
          entityType: "membro",
          entityId: updated.id,
          action: "CHANGE_ROLE",
          description: `${currentUser.nome} alterou o papel de um membro para ${updated.role}.`,
          before: null,
          after: { memberId: updated.id, role: updated.role },
        });
      }

      return res.status(200).json({
        success: true,
        member: {
          id: updated.id,
          fazendaId: updated.fazendaId,
          userId: updated.userId,
          role: updated.role,
          active: updated.active,
          createdAt: updated.createdAt.toISOString(),
        },
      });
    } catch (error: unknown) {
      if (error instanceof MembershipError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao alterar papel." });
    }
  }

  async toggle(req: Request, res: Response): Promise<Response> {
    try {
      const fazendaId = req.params.id as string;
      const memberId = req.params.memberId as string;
      const currentUser = res.locals.currentUser as { id: string; nome: string; email: string } | undefined;

      const updated = await this.toggleMemberActive.execute({
        fazendaId,
        memberId,
        requestedByUserId: currentUser?.id ?? "",
      });

      if (currentUser) {
        await this.createAuditLog.execute({
          userId: currentUser.id,
          userName: currentUser.nome,
          userEmail: currentUser.email,
          fazendaId,
          fazendaNome: await this.getFazendaNome(fazendaId),
          entityType: "membro",
          entityId: updated.id,
          action: "TOGGLE_MEMBER",
          description: `${currentUser.nome} ${updated.active ? "ativou" : "desativou"} um membro.`,
          before: null,
          after: { memberId: updated.id, active: updated.active },
        });
      }

      return res.status(200).json({
        success: true,
        member: {
          id: updated.id,
          fazendaId: updated.fazendaId,
          userId: updated.userId,
          role: updated.role,
          active: updated.active,
          createdAt: updated.createdAt.toISOString(),
        },
      });
    } catch (error: unknown) {
      if (error instanceof MembershipError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao atualizar membro." });
    }
  }

  async remove(req: Request, res: Response): Promise<Response> {
    try {
      const fazendaId = req.params.id as string;
      const memberId = req.params.memberId as string;
      const currentUser = res.locals.currentUser as { id: string; nome: string; email: string } | undefined;

      await this.removeMember.execute({
        fazendaId,
        memberId,
        requestedByUserId: currentUser?.id ?? "",
      });

      if (currentUser) {
        await this.createAuditLog.execute({
          userId: currentUser.id,
          userName: currentUser.nome,
          userEmail: currentUser.email,
          fazendaId,
          fazendaNome: await this.getFazendaNome(fazendaId),
          entityType: "membro",
          entityId: memberId,
          action: "REMOVE_MEMBER",
          description: `${currentUser.nome} removeu um membro.`,
          before: { memberId },
          after: null,
        });
      }

      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof MembershipError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao remover membro." });
    }
  }
}
