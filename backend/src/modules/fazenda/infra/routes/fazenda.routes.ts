import { Router } from "express";
import { CreateFazenda } from "../../domain/usecases/CreateFazenda";
import { GetFazendas } from "../../domain/usecases/GetFazendas";
import { UpdateFazenda } from "../../domain/usecases/UpdateFazenda";
import { FazendaRepository } from "../repositories/FazendaRepository";
import { LocalUserRepository } from "../../../auth/infrastructure/repositories/LocalUserRepository";
import { LocalSessionRepository } from "../../../auth/infrastructure/repositories/LocalSessionRepository";
import { GetCurrentUser } from "../../../auth/application/usecases/GetCurrentUser";
import { makeEnsureAuthenticated } from "../../../auth/presentation/middlewares/makeEnsureAuthenticated";
import { LocalFazendaMemberRepository } from "../../../membership/infrastructure/local/LocalFazendaMemberRepository";
import { makeEnsureFazendaMember } from "../../../membership/presentation/middlewares/makeEnsureFazendaMember";
import { makeEnsureRole } from "../../../membership/presentation/middlewares/makeEnsureRole";
import { AddMemberToFazenda } from "../../../membership/application/usecases/AddMemberToFazenda";

const fazendaRoutes = Router();

// Injeção de dependências manual seguindo Clean Arch
const fazendaRepository = new FazendaRepository();
const getFazendasUseCase = new GetFazendas(fazendaRepository);
const createFazendaUseCase = new CreateFazenda(fazendaRepository);
const updateFazendaUseCase = new UpdateFazenda(fazendaRepository);

const userRepository = new LocalUserRepository();
const sessionRepository = new LocalSessionRepository();
const getCurrentUser = new GetCurrentUser(sessionRepository, userRepository);
const ensureAuthenticated = makeEnsureAuthenticated(getCurrentUser);

const memberRepository = new LocalFazendaMemberRepository();
const ensureFazendaMemberFromParam = makeEnsureFazendaMember(memberRepository, (req) => String(req.params.id ?? ""));
const ensureAdmin = makeEnsureRole(["ADMIN"]);
const addMemberToFazenda = new AddMemberToFazenda(memberRepository);

fazendaRoutes.get("/", ensureAuthenticated, async (req, res) => {
  const currentUser = res.locals.currentUser as { id: string } | undefined;
  const memberships = await memberRepository.findAllByUser(currentUser?.id ?? "");
  const allowedFazendaIds = new Set(memberships.filter((m) => m.active).map((m) => m.fazendaId));

  const fazendas = await getFazendasUseCase.execute();
  const filtered = fazendas.filter((f) => f.id && allowedFazendaIds.has(f.id));

  return res.status(200).json(
    filtered.map((fazenda) => ({
      id: fazenda.id,
      nome: fazenda.nome,
      localizacao: fazenda.localizacao,
    }))
  );
});

fazendaRoutes.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const currentUser = res.locals.currentUser as { id: string; nome: string; email: string } | undefined;
    const nome = typeof req.body?.nome === "string" ? req.body.nome.trim() : "";
    const localizacao = typeof req.body?.localizacao === "string" ? req.body.localizacao.trim() : "";

    if (!nome || !localizacao) {
      return res.status(400).json({ error: "Dados inválidos: nome e localizacao são obrigatórios" });
    }

    const fazenda = await createFazendaUseCase.execute({ nome, localizacao });

    if (fazenda.id && currentUser?.id) {
      await addMemberToFazenda.execute({
        fazendaId: fazenda.id,
        userId: currentUser.id,
        role: "ADMIN",
      });
    }

    return res.status(201).json({
      id: fazenda.id,
      nome: fazenda.nome,
      localizacao: fazenda.localizacao,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return res.status(400).json({ error: message });
  }
});

fazendaRoutes.put("/:id", ensureAuthenticated, ensureFazendaMemberFromParam, ensureAdmin, async (req, res) => {
  try {
    const id = String(req.params.id ?? "");
    const nome = typeof req.body?.nome === "string" ? req.body.nome.trim() : undefined;
    const localizacao = typeof req.body?.localizacao === "string" ? req.body.localizacao.trim() : undefined;

    const { after } = await updateFazendaUseCase.execute({ id, nome, localizacao });

    return res.status(200).json({
      id: after.id,
      nome: after.nome,
      localizacao: after.localizacao,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return res.status(400).json({ error: message });
  }
});

export { fazendaRoutes };
