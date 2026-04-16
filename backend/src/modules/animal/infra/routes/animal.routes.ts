import { Router } from "express";
import { AnimalController } from "../controllers/AnimalController";
import { GetAnimals } from "../../domain/usecases/GetAnimals";
import { CreateAnimal } from "../../domain/usecases/CreateAnimal";
import { AnimalRepository } from "../repositories/AnimalRepository";

const animalRoutes = Router();

// Injeção de dependências manual seguindo Clean Arch
const animalRepository = new AnimalRepository();
const getAnimalsUseCase = new GetAnimals(animalRepository);
const createAnimalUseCase = new CreateAnimal(animalRepository);
const animalController = new AnimalController(getAnimalsUseCase, createAnimalUseCase);

// Rotas
animalRoutes.get("/", (req, res) => animalController.index(req, res));
animalRoutes.post("/", (req, res) => animalController.store(req, res));

export { animalRoutes };
