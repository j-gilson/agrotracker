import { Router } from "express";
import { AnimalController } from "../controllers/AnimalController";
import { GetAnimals } from "../../domain/usecases/GetAnimals";
import { CreateAnimal } from "../../domain/usecases/CreateAnimal";
import { UpdateAnimal } from "../../domain/usecases/UpdateAnimal";
import { DeleteAnimal } from "../../domain/usecases/DeleteAnimal";
import { AnimalRepository } from "../repositories/AnimalRepository";
import { LocalUserRepository } from "../../../auth/infrastructure/repositories/LocalUserRepository";
import { LocalSessionRepository } from "../../../auth/infrastructure/repositories/LocalSessionRepository";
import { GetCurrentUser } from "../../../auth/application/usecases/GetCurrentUser";
import { makeEnsureAuthenticated } from "../../../auth/presentation/middlewares/makeEnsureAuthenticated";
import { LocalFazendaMemberRepository } from "../../../membership/infrastructure/local/LocalFazendaMemberRepository";
import { makeEnsureFazendaMember } from "../../../membership/presentation/middlewares/makeEnsureFazendaMember";
import { makeEnsureRole } from "../../../membership/presentation/middlewares/makeEnsureRole";
import { FazendaRepository } from "../../../fazenda/infra/repositories/FazendaRepository";
import { LocalAuditRepository } from "../../../audit/infrastructure/LocalAuditRepository";
import { CreateAuditLog } from "../../../audit/application/usecases/CreateAuditLog";

const animalRoutes = Router();

// Injeção de dependências manual seguindo Clean Arch
const animalRepository = new AnimalRepository();
const getAnimalsUseCase = new GetAnimals(animalRepository);
const createAnimalUseCase = new CreateAnimal(animalRepository);
const updateAnimalUseCase = new UpdateAnimal(animalRepository);
const deleteAnimalUseCase = new DeleteAnimal(animalRepository);
const fazendaRepository = new FazendaRepository();
const auditRepository = new LocalAuditRepository();
const createAuditLog = new CreateAuditLog(auditRepository);
const animalController = new AnimalController(
  getAnimalsUseCase,
  createAnimalUseCase,
  updateAnimalUseCase,
  deleteAnimalUseCase,
  fazendaRepository,
  createAuditLog
);

const userRepository = new LocalUserRepository();
const sessionRepository = new LocalSessionRepository();
const getCurrentUser = new GetCurrentUser(sessionRepository, userRepository);
const ensureAuthenticated = makeEnsureAuthenticated(getCurrentUser);

const memberRepository = new LocalFazendaMemberRepository();
const ensureRoleForAnimals = makeEnsureRole(["ADMIN", "FUNCIONARIO"]);
const ensureFazendaMemberFromBody = makeEnsureFazendaMember(
  memberRepository,
  (req) => String((req.body as { fazendaId?: unknown } | undefined)?.fazendaId ?? "")
);

const ensureAnimalAccess = async (req: any, res: any, next: any) => {
  const currentUser = res.locals.currentUser as { id: string } | undefined;
  const userId = currentUser?.id ?? "";
  const animalId = String(req.params.id ?? "").trim();

  if (!userId) {
    return res.status(401).json({ success: false, message: "Nao autenticado." });
  }
  if (!animalId) {
    return res.status(400).json({ success: false, message: "Animal invalido." });
  }

  const animal = await animalRepository.findById(animalId);
  if (!animal || !animal.id) {
    return res.status(404).json({ success: false, message: "Animal nao encontrado." });
  }

  const member = await memberRepository.findByFazendaAndUser(animal.fazendaId, userId);
  if (!member) {
    return res.status(403).json({ success: false, message: "Voce nao pertence a esta fazenda." });
  }
  if (!member.active) {
    return res.status(403).json({ success: false, message: "Seu acesso a fazenda esta desativado." });
  }

  return next();
};

animalRoutes.get("/", ensureAuthenticated, async (req, res) => {
  const currentUser = res.locals.currentUser as { id: string } | undefined;
  const memberships = await memberRepository.findAllByUser(currentUser?.id ?? "");
  const allowedFazendaIds = new Set(memberships.filter((m) => m.active).map((m) => m.fazendaId));
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 10, 50));

  if (allowedFazendaIds.size === 0) {
    return res.status(200).json([]);
  }

  const fazendaIdQuery = typeof req.query.fazendaId === "string" ? req.query.fazendaId.trim() : "";
  if (fazendaIdQuery && !allowedFazendaIds.has(fazendaIdQuery)) {
    return res.status(403).json({ success: false, message: "Voce nao pertence a esta fazenda." });
  }

  const animals = await getAnimalsUseCase.execute();
  const filtered = animals.filter((a) => allowedFazendaIds.has(a.fazendaId));
  const list = fazendaIdQuery ? filtered.filter((a) => a.fazendaId === fazendaIdQuery) : filtered;
  const limitedList = list.slice(0, limit);

  return res.status(200).json(
    limitedList.map((animal) => ({
      id: animal.id,
      nome: animal.nome,
      raca: animal.raca,
      idade: animal.idade,
      peso: animal.peso,
      fazendaId: animal.fazendaId,
      dataNascimento: animal.dataNascimento ?? null,
    }))
  );
});

animalRoutes.post("/", ensureAuthenticated, ensureFazendaMemberFromBody, ensureRoleForAnimals, (req, res) =>
  animalController.store(req, res)
);

animalRoutes.put("/:id", ensureAuthenticated, ensureRoleForAnimals, ensureAnimalAccess, (req, res) =>
  animalController.update(req, res)
);

animalRoutes.delete("/:id", ensureAuthenticated, ensureRoleForAnimals, ensureAnimalAccess, (req, res) =>
  animalController.delete(req, res)
);

export { animalRoutes };
