import { Router } from "express";
import { FazendaController } from "../controllers/FazendaController";
import { CreateFazenda } from "../../domain/usecases/CreateFazenda";
import { GetFazendas } from "../../domain/usecases/GetFazendas";
import { FazendaRepository } from "../repositories/FazendaRepository";

const fazendaRoutes = Router();

// Injeção de dependências manual seguindo Clean Arch
const fazendaRepository = new FazendaRepository();
const getFazendasUseCase = new GetFazendas(fazendaRepository);
const createFazendaUseCase = new CreateFazenda(fazendaRepository);
const fazendaController = new FazendaController(getFazendasUseCase, createFazendaUseCase);

// Rotas
fazendaRoutes.get("/", (req, res) => fazendaController.index(req, res));
fazendaRoutes.post("/", (req, res) => fazendaController.store(req, res));

export { fazendaRoutes };
