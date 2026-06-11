import express from "express";
import cors from "cors";
import { animalRoutes } from "./modules/animal/infra/routes/animal.routes";
import { fazendaRoutes } from "./modules/fazenda/infra/routes/fazenda.routes";
import { authRoutes } from "./modules/auth/presentation/routes/authRoutes";
import { membershipRoutes } from "./modules/membership/presentation/routes/membershipRoutes";
import { eventRoutes } from "./modules/event/presentation/eventRoutes";

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(express.json());
    this.express.use(cors());
  }

  private routes(): void {
    this.express.use("/animals", animalRoutes);
    this.express.use("/fazendas", fazendaRoutes);
    this.express.use("/auth", authRoutes);
    this.express.use("/", membershipRoutes);
    this.express.use("/events", eventRoutes);
  }
}

export default new App().express;
