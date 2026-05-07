import { Router } from "express";
import { EventController } from "./EventController";
import { LocalEventRepository } from "../infrastructure/repositories/LocalEventRepository";
import { CreateEvent } from "../application/usecases/CreateEvent";
import { GetEventsByAnimal } from "../application/usecases/GetEventsByAnimal";
import { GetEventsByFazenda } from "../application/usecases/GetEventsByFazenda";
import { AnimalRepository } from "../../animal/infra/repositories/AnimalRepository";
import { LocalFazendaMemberRepository } from "../../membership/infrastructure/local/LocalFazendaMemberRepository";
import { LocalUserRepository } from "../../auth/infrastructure/repositories/LocalUserRepository";
import { LocalSessionRepository } from "../../auth/infrastructure/repositories/LocalSessionRepository";
import { GetCurrentUser } from "../../auth/application/usecases/GetCurrentUser";
import { makeEnsureAuthenticated } from "../../auth/presentation/middlewares/makeEnsureAuthenticated";
import { makeEnsureFazendaMember } from "../../membership/presentation/middlewares/makeEnsureFazendaMember";
import { makeEnsureRole } from "../../membership/presentation/middlewares/makeEnsureRole";
import { FazendaRepository } from "../../fazenda/infra/repositories/FazendaRepository";
import { LocalAuditRepository } from "../../audit/infrastructure/LocalAuditRepository";
import { CreateAuditLog } from "../../audit/application/usecases/CreateAuditLog";

const eventRoutes = Router();

const eventRepository = new LocalEventRepository();
const animalRepository = new AnimalRepository();
const memberRepository = new LocalFazendaMemberRepository();

const createEvent = new CreateEvent(eventRepository, animalRepository, memberRepository);
const getEventsByAnimal = new GetEventsByAnimal(eventRepository, animalRepository, memberRepository);
const getEventsByFazenda = new GetEventsByFazenda(eventRepository, memberRepository);

const fazendaRepository = new FazendaRepository();
const auditRepository = new LocalAuditRepository();
const createAuditLog = new CreateAuditLog(auditRepository);

const controller = new EventController(
  createEvent,
  getEventsByAnimal,
  getEventsByFazenda,
  fazendaRepository,
  createAuditLog
);

const userRepository = new LocalUserRepository();
const sessionRepository = new LocalSessionRepository();
const getCurrentUser = new GetCurrentUser(sessionRepository, userRepository);
const ensureAuthenticated = makeEnsureAuthenticated(getCurrentUser);

const ensureFazendaMemberFromBody = makeEnsureFazendaMember(
  memberRepository,
  (req) => String((req.body as { fazendaId?: unknown } | undefined)?.fazendaId ?? "")
);
const ensureRoleForEvents = makeEnsureRole(["ADMIN", "FUNCIONARIO"]);

eventRoutes.post("/", ensureAuthenticated, ensureFazendaMemberFromBody, ensureRoleForEvents, (req, res) =>
  controller.create(req, res)
);

eventRoutes.get("/", ensureAuthenticated, (req, res) => controller.listByAnimal(req, res));

eventRoutes.get(
  "/fazenda/:id",
  ensureAuthenticated,
  makeEnsureFazendaMember(memberRepository, (req) => String(req.params.id ?? "")),
  (req, res) => controller.listByFazenda(req, res)
);

export { eventRoutes };
