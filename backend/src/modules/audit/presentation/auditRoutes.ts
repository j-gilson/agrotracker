import { Router } from "express";
import { LocalAuditRepository } from "../infrastructure/LocalAuditRepository";
import { CreateAuditLog } from "../application/usecases/CreateAuditLog";
import { GetAuditLogs } from "../application/usecases/GetAuditLogs";
import { GetEntityHistory } from "../application/usecases/GetEntityHistory";
import { AuditController } from "./AuditController";
import { GetAuditByEntity } from "../application/usecases/GetAuditByEntity";
import { GetAuditByFazenda } from "../application/usecases/GetAuditByFazenda";
import { GetAuditByUser } from "../application/usecases/GetAuditByUser";
import { LocalUserRepository } from "../../auth/infrastructure/repositories/LocalUserRepository";
import { LocalSessionRepository } from "../../auth/infrastructure/repositories/LocalSessionRepository";
import { GetCurrentUser } from "../../auth/application/usecases/GetCurrentUser";
import { makeEnsureAuthenticated } from "../../auth/presentation/middlewares/makeEnsureAuthenticated";
import { LocalFazendaMemberRepository } from "../../membership/infrastructure/local/LocalFazendaMemberRepository";
import { makeEnsureFazendaMember } from "../../membership/presentation/middlewares/makeEnsureFazendaMember";
import { makeEnsureRole } from "../../membership/presentation/middlewares/makeEnsureRole";

const auditRoutes = Router();

const auditRepository = new LocalAuditRepository();
const createAuditLog = new CreateAuditLog(auditRepository);
const getAuditLogs = new GetAuditLogs(auditRepository);
const getEntityHistory = new GetEntityHistory(auditRepository);
const getAuditByEntity = new GetAuditByEntity(auditRepository);
const getAuditByFazenda = new GetAuditByFazenda(auditRepository);
const getAuditByUser = new GetAuditByUser(auditRepository);

const userRepository = new LocalUserRepository();
const sessionRepository = new LocalSessionRepository();
const getCurrentUser = new GetCurrentUser(sessionRepository, userRepository);
const ensureAuthenticated = makeEnsureAuthenticated(getCurrentUser);

const memberRepository = new LocalFazendaMemberRepository();
const ensureFazendaMemberFromQuery = makeEnsureFazendaMember(
  memberRepository,
  (req) => String((req.query as { fazendaId?: unknown } | undefined)?.fazendaId ?? "")
);
const ensureAdmin = makeEnsureRole(["ADMIN"]);

const controller = new AuditController(
  getAuditLogs,
  getEntityHistory,
  getAuditByEntity,
  getAuditByFazenda,
  getAuditByUser,
  memberRepository
);

auditRoutes.get("/", ensureAuthenticated, ensureFazendaMemberFromQuery, ensureAdmin, (req, res) =>
  controller.list(req, res)
);

auditRoutes.get("/entity/:type/:id", ensureAuthenticated, (req, res) => controller.entityHistory(req, res));

auditRoutes.get("/entity/:entityType/:entityId/timeline", ensureAuthenticated, (req, res) =>
  controller.entityTimeline(req, res)
);

auditRoutes.get(
  "/fazenda/:fazendaId",
  ensureAuthenticated,
  makeEnsureFazendaMember(memberRepository, (req) => String(req.params.fazendaId ?? "")),
  (req, res) => controller.fazendaHistory(req, res)
);

auditRoutes.get("/user/:userId", ensureAuthenticated, (req, res) => controller.userHistory(req, res));

export { auditRoutes, createAuditLog };

