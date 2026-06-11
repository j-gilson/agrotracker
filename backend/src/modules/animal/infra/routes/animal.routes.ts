import { NextFunction, Request, Response, Router } from "express";
import {
  AnimalController,
  toAnimalDTO,
} from "../controllers/AnimalController";
import { GetAnimals } from "../../domain/usecases/GetAnimals";
import { CreateAnimal } from "../../domain/usecases/CreateAnimal";
import { UpdateAnimal } from "../../domain/usecases/UpdateAnimal";
import { AnimalRepository } from "../repositories/AnimalRepository";
import { LocalUserRepository } from "../../../auth/infrastructure/repositories/LocalUserRepository";
import { LocalSessionRepository } from "../../../auth/infrastructure/repositories/LocalSessionRepository";
import { GetCurrentUser } from "../../../auth/application/usecases/GetCurrentUser";
import { makeEnsureAuthenticated } from "../../../auth/presentation/middlewares/makeEnsureAuthenticated";
import { LocalFazendaMemberRepository } from "../../../membership/infrastructure/local/LocalFazendaMemberRepository";
import { makeEnsureFazendaMember } from "../../../membership/presentation/middlewares/makeEnsureFazendaMember";
import { makeEnsureRole } from "../../../membership/presentation/middlewares/makeEnsureRole";

const animalRoutes = Router();

const animalRepository = new AnimalRepository();
const getAnimalsUseCase = new GetAnimals(animalRepository);
const createAnimalUseCase = new CreateAnimal(animalRepository);
const updateAnimalUseCase = new UpdateAnimal(animalRepository);
const animalController = new AnimalController(
  animalRepository,
  createAnimalUseCase,
  updateAnimalUseCase
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
const ensureFazendaMemberFromQuery = makeEnsureFazendaMember(
  memberRepository,
  (req) => String(req.query.fazendaId ?? "")
);

const ensureAnimalAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const currentUser = res.locals.currentUser as { id: string } | undefined;
  const animal = await animalRepository.findById(String(req.params.id ?? ""));

  if (!animal) {
    return res.status(404).json({ success: false, message: "Animal nao encontrado." });
  }

  const member = await memberRepository.findByFazendaAndUser(
    animal.fazendaId,
    currentUser?.id ?? ""
  );
  if (!member || !member.active) {
    return res.status(403).json({
      success: false,
      message: "Voce nao possui acesso a fazenda deste animal.",
    });
  }

  res.locals.currentMember = member;
  res.locals.currentAnimal = animal;
  return next();
};

animalRoutes.get("/", ensureAuthenticated, async (req, res) => {
  const currentUser = res.locals.currentUser as { id: string } | undefined;
  const memberships = await memberRepository.findAllByUser(currentUser?.id ?? "");
  const allowedFazendaIds = new Set(
    memberships.filter((member) => member.active).map((member) => member.fazendaId)
  );
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 50, 100));
  const fazendaId =
    typeof req.query.fazendaId === "string" ? req.query.fazendaId.trim() : "";

  if (fazendaId && !allowedFazendaIds.has(fazendaId)) {
    return res.status(403).json({ success: false, message: "Acesso negado." });
  }

  const animals = await getAnimalsUseCase.execute();
  const filtered = animals.filter(
    (animal) =>
      allowedFazendaIds.has(animal.fazendaId) &&
      (!fazendaId || animal.fazendaId === fazendaId)
  );

  return res.status(200).json(filtered.slice(0, limit).map(toAnimalDTO));
});

animalRoutes.get(
  "/by-code",
  ensureAuthenticated,
  ensureFazendaMemberFromQuery,
  (req, res) => animalController.findByCode(req, res)
);

animalRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAnimalAccess,
  (req, res) => animalController.show(req, res)
);

animalRoutes.post(
  "/",
  ensureAuthenticated,
  ensureFazendaMemberFromBody,
  ensureRoleForAnimals,
  (req, res) => animalController.store(req, res)
);

animalRoutes.put(
  "/:id",
  ensureAuthenticated,
  ensureAnimalAccess,
  ensureRoleForAnimals,
  (req, res) => animalController.update(req, res)
);

export { animalRoutes };
