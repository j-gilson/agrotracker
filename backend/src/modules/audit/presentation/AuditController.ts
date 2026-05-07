import { Request, Response } from "express";
import { AuditError } from "../application/errors/AuditError";
import { GetAuditLogs } from "../application/usecases/GetAuditLogs";
import { GetEntityHistory } from "../application/usecases/GetEntityHistory";
import { GetAuditByEntity } from "../application/usecases/GetAuditByEntity";
import { GetAuditByFazenda } from "../application/usecases/GetAuditByFazenda";
import { GetAuditByUser } from "../application/usecases/GetAuditByUser";
import { AuditAction, AuditEntityType } from "../domain/types";
import { IFazendaMemberRepository } from "../../membership/contracts/IFazendaMemberRepository";
import { MemberRole } from "../../membership/domain/types";

const isAuditEntityType = (value: string): value is AuditEntityType => {
  return (
    value === "animal" ||
    value === "fazenda" ||
    value === "manejo" ||
    value === "event" ||
    value === "membership" ||
    value === "membro" ||
    value === "auth"
  );
};

const isAuditAction = (value: string): value is AuditAction => {
  return (
    value === "CREATE" ||
    value === "UPDATE" ||
    value === "DELETE" ||
    value === "LOGIN" ||
    value === "LOGOUT" ||
    value === "INVITE_USER" ||
    value === "ACCEPT_INVITE" ||
    value === "CHANGE_ROLE" ||
    value === "TOGGLE_MEMBER" ||
    value === "REMOVE_MEMBER"
  );
};

export class AuditController {
  constructor(
    private readonly getAuditLogs: GetAuditLogs,
    private readonly getEntityHistory: GetEntityHistory,
    private readonly getAuditByEntity: GetAuditByEntity,
    private readonly getAuditByFazenda: GetAuditByFazenda,
    private readonly getAuditByUser: GetAuditByUser,
    private readonly memberRepository: IFazendaMemberRepository
  ) {}

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const {
        fazendaId,
        userId,
        action,
        entityType,
        startDate,
        endDate,
        page,
        pageSize,
      } = req.query as Record<string, string | undefined>;

      const parsedAction = action ? (isAuditAction(action) ? action : null) : undefined;
      if (parsedAction === null) {
        return res.status(400).json({ success: false, message: "Acao invalida." });
      }

      const parsedEntityType = entityType ? (isAuditEntityType(entityType) ? entityType : null) : undefined;
      if (parsedEntityType === null) {
        return res.status(400).json({ success: false, message: "Tipo de entidade invalido." });
      }

      const result = await this.getAuditLogs.execute({
        fazendaId,
        userId,
        action: parsedAction,
        entityType: parsedEntityType,
        startDate,
        endDate,
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
      });

      return res.status(200).json({
        success: true,
        ...result,
        items: result.items.map((log) => ({
          id: log.id,
          userId: log.userId,
          userName: log.userName,
          userEmail: log.userEmail,
          fazendaId: log.fazendaId,
          fazendaNome: log.fazendaNome,
          entityType: log.entityType,
          entityId: log.entityId,
          action: log.action,
          description: log.description,
          before: log.before,
          after: log.after,
          createdAt: log.createdAt.toISOString(),
        })),
      });
    } catch (error: unknown) {
      if (error instanceof AuditError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao listar logs." });
    }
  }

  async entityHistory(req: Request, res: Response): Promise<Response> {
    try {
      const type = String(req.params.type ?? "");
      const id = String(req.params.id ?? "");

      if (!isAuditEntityType(type)) {
        return res.status(400).json({ success: false, message: "Tipo de entidade invalido." });
      }

      const history = await this.getEntityHistory.execute(type, id);
      if (history.length === 0) {
        return res.status(404).json({ success: false, message: "Historico nao encontrado." });
      }

      const currentUser = res.locals.currentUser as { id: string } | undefined;
      const userId = currentUser?.id ?? "";
      if (!userId) return res.status(401).json({ success: false, message: "Nao autenticado." });

      const fazendaIds = Array.from(new Set(history.map((h) => h.fazendaId).filter((x): x is string => !!x)));
      if (fazendaIds.length === 0) {
        return res.status(200).json({
          success: true,
          items: history.map((log) => ({
            id: log.id,
            userId: log.userId,
            userName: log.userName,
            userEmail: log.userEmail,
            fazendaId: log.fazendaId,
            fazendaNome: log.fazendaNome,
            entityType: log.entityType,
            entityId: log.entityId,
            action: log.action,
            description: log.description,
            before: log.before,
            after: log.after,
            createdAt: log.createdAt.toISOString(),
          })),
        });
      }

      const requiredRoles: MemberRole[] = type === "animal" ? ["ADMIN", "FUNCIONARIO"] : ["ADMIN"];

      for (const fazendaId of fazendaIds) {
        const member = await this.memberRepository.findByFazendaAndUser(fazendaId, userId);
        if (!member || !member.active) {
          return res.status(403).json({ success: false, message: "Acesso restrito." });
        }
        if (!requiredRoles.includes(member.role)) {
          return res.status(403).json({ success: false, message: "Acesso restrito." });
        }
      }

      return res.status(200).json({
        success: true,
        items: history.map((log) => ({
          id: log.id,
          userId: log.userId,
          userName: log.userName,
          userEmail: log.userEmail,
          fazendaId: log.fazendaId,
          fazendaNome: log.fazendaNome,
          entityType: log.entityType,
          entityId: log.entityId,
          action: log.action,
          description: log.description,
          before: log.before,
          after: log.after,
          createdAt: log.createdAt.toISOString(),
        })),
      });
    } catch (error: unknown) {
      if (error instanceof AuditError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao carregar historico." });
    }
  }

  async entityTimeline(req: Request, res: Response): Promise<Response> {
    try {
      const entityType = String(req.params.entityType ?? "");
      const entityId = String(req.params.entityId ?? "");
      const { page, limit } = req.query as Record<string, string | undefined>;

      if (!isAuditEntityType(entityType)) {
        return res.status(400).json({ success: false, message: "Tipo de entidade invalido." });
      }

      const currentUser = res.locals.currentUser as { id: string } | undefined;
      const userId = currentUser?.id ?? "";
      if (!userId) return res.status(401).json({ success: false, message: "Nao autenticado." });

      const result = await this.getAuditByEntity.execute({
        entityType,
        entityId,
        page: page ? Number(page) : undefined,
        pageSize: limit ? Number(limit) : undefined,
      });

      // Security: user can only see logs for fazendas they belong to.
      const fazendaIds = Array.from(new Set(result.items.map((h) => h.fazendaId).filter((x): x is string => !!x)));
      for (const fid of fazendaIds) {
        const member = await this.memberRepository.findByFazendaAndUser(fid, userId);
        if (!member || !member.active) {
          return res.status(403).json({ success: false, message: "Acesso restrito." });
        }
      }

      return res.status(200).json({
        success: true,
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        items: result.items.map((log) => ({
          id: log.id,
          userId: log.userId,
          userName: log.userName,
          userEmail: log.userEmail,
          fazendaId: log.fazendaId,
          fazendaNome: log.fazendaNome,
          entityType: log.entityType,
          entityId: log.entityId,
          action: log.action,
          description: log.description,
          metadata: log.metadata,
          changes: log.changes,
          before: log.before,
          after: log.after,
          timestamp: log.timestamp.toISOString(),
          createdAt: log.createdAt.toISOString(),
        })),
      });
    } catch (error: unknown) {
      if (error instanceof AuditError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao carregar timeline." });
    }
  }

  async fazendaHistory(req: Request, res: Response): Promise<Response> {
    try {
      const fazendaId = String(req.params.fazendaId ?? "");
      const { page, limit } = req.query as Record<string, string | undefined>;

      const currentUser = res.locals.currentUser as { id: string } | undefined;
      const userId = currentUser?.id ?? "";
      if (!userId) return res.status(401).json({ success: false, message: "Nao autenticado." });

      const member = await this.memberRepository.findByFazendaAndUser(fazendaId, userId);
      if (!member || !member.active) {
        return res.status(403).json({ success: false, message: "Acesso restrito." });
      }

      const result = await this.getAuditByFazenda.execute({
        fazendaId,
        page: page ? Number(page) : undefined,
        pageSize: limit ? Number(limit) : undefined,
      });

      return res.status(200).json({
        success: true,
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        items: result.items.map((log) => ({
          id: log.id,
          userId: log.userId,
          userName: log.userName,
          userEmail: log.userEmail,
          fazendaId: log.fazendaId,
          fazendaNome: log.fazendaNome,
          entityType: log.entityType,
          entityId: log.entityId,
          action: log.action,
          description: log.description,
          metadata: log.metadata,
          changes: log.changes,
          before: log.before,
          after: log.after,
          timestamp: log.timestamp.toISOString(),
          createdAt: log.createdAt.toISOString(),
        })),
      });
    } catch (error: unknown) {
      if (error instanceof AuditError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao carregar historico da fazenda." });
    }
  }

  async userHistory(req: Request, res: Response): Promise<Response> {
    try {
      const targetUserId = String(req.params.userId ?? "");
      const { page, limit } = req.query as Record<string, string | undefined>;

      const currentUser = res.locals.currentUser as { id: string } | undefined;
      const requesterId = currentUser?.id ?? "";
      if (!requesterId) return res.status(401).json({ success: false, message: "Nao autenticado." });
      if (!targetUserId) {
        return res.status(400).json({ success: false, message: "Usuario invalido." });
      }

      const isSelfRequest = requesterId === targetUserId;

      let sharedFazendaIds = new Set<string>();
      if (!isSelfRequest) {
        const [requesterMemberships, targetMemberships] = await Promise.all([
          this.memberRepository.findAllByUser(requesterId),
          this.memberRepository.findAllByUser(targetUserId),
        ]);

        const requesterActiveFazendas = new Set(
          requesterMemberships.filter((member) => member.active).map((member) => member.fazendaId)
        );

        sharedFazendaIds = new Set(
          targetMemberships
            .filter((member) => member.active && requesterActiveFazendas.has(member.fazendaId))
            .map((member) => member.fazendaId)
        );

        if (sharedFazendaIds.size === 0) {
          return res.status(403).json({ success: false, message: "Acesso negado." });
        }
      }

      const result = await this.getAuditByUser.execute({
        userId: targetUserId,
        page: page ? Number(page) : undefined,
        pageSize: limit ? Number(limit) : undefined,
      });

      const allowedItems: typeof result.items = [];
      for (const item of result.items) {
        const fid = item.fazendaId;
        if (!fid) {
          if (isSelfRequest) allowedItems.push(item);
          continue;
        }

        if (isSelfRequest || sharedFazendaIds.has(fid)) {
          allowedItems.push(item);
        }
      }

      return res.status(200).json({
        success: true,
        page: result.page,
        pageSize: result.pageSize,
        total: allowedItems.length,
        items: allowedItems.map((log) => ({
          id: log.id,
          userId: log.userId,
          userName: log.userName,
          userEmail: log.userEmail,
          fazendaId: log.fazendaId,
          fazendaNome: log.fazendaNome,
          entityType: log.entityType,
          entityId: log.entityId,
          action: log.action,
          description: log.description,
          metadata: log.metadata,
          changes: log.changes,
          before: log.before,
          after: log.after,
          timestamp: log.timestamp.toISOString(),
          createdAt: log.createdAt.toISOString(),
        })),
      });
    } catch (error: unknown) {
      if (error instanceof AuditError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao carregar historico do usuario." });
    }
  }
}
