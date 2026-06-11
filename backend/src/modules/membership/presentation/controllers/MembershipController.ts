import { Request, Response } from "express";
import { MembershipError } from "../../application/errors/MembershipError";
import { AcceptInvite } from "../../application/usecases/AcceptInvite";
import { ChangeMemberRole } from "../../application/usecases/ChangeMemberRole";
import { GetMembersByFazenda } from "../../application/usecases/GetMembersByFazenda";
import { InviteUserToFazenda } from "../../application/usecases/InviteUserToFazenda";
import { RemoveMember } from "../../application/usecases/RemoveMember";
import { ToggleMemberActive } from "../../application/usecases/ToggleMemberActive";
import { MemberRole } from "../../domain/types";

export class MembershipController {
  constructor(
    private readonly inviteUserToFazenda: InviteUserToFazenda,
    private readonly acceptInvite: AcceptInvite,
    private readonly getMembersByFazenda: GetMembersByFazenda,
    private readonly changeMemberRole: ChangeMemberRole,
    private readonly toggleMemberActive: ToggleMemberActive,
    private readonly removeMember: RemoveMember
  ) {}

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

      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof MembershipError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao remover membro." });
    }
  }
}
