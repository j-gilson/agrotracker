import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { RegisterUser } from "../../application/usecases/RegisterUser";
import { LoginUser } from "../../application/usecases/LoginUser";
import { GetCurrentUser } from "../../application/usecases/GetCurrentUser";
import { LogoutUser } from "../../application/usecases/LogoutUser";
import { LocalUserRepository } from "../../infrastructure/repositories/LocalUserRepository";
import { LocalSessionRepository } from "../../infrastructure/repositories/LocalSessionRepository";
import { BcryptPasswordHasher } from "../../infrastructure/services/BcryptPasswordHasher";
import { MockTokenService } from "../../infrastructure/services/MockTokenService";
import { makeEnsureAuthenticated } from "../middlewares/makeEnsureAuthenticated";
import { LocalAuditRepository } from "../../../audit/infrastructure/LocalAuditRepository";
import { CreateAuditLog } from "../../../audit/application/usecases/CreateAuditLog";

const authRoutes = Router();

const userRepository = new LocalUserRepository();
const sessionRepository = new LocalSessionRepository();
const passwordHasher = new BcryptPasswordHasher(10);
const tokenService = new MockTokenService();

const registerUser = new RegisterUser(userRepository, passwordHasher);
const loginUser = new LoginUser(
  userRepository,
  sessionRepository,
  passwordHasher,
  tokenService
);
const getCurrentUser = new GetCurrentUser(sessionRepository, userRepository);
const logoutUser = new LogoutUser(sessionRepository);

const auditRepository = new LocalAuditRepository();
const createAuditLog = new CreateAuditLog(auditRepository);

const ensureAuthenticated = makeEnsureAuthenticated(getCurrentUser);

const authController = new AuthController(
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  createAuditLog
);

authRoutes.post("/register", (req, res) => authController.register(req, res));
authRoutes.post("/login", (req, res) => authController.login(req, res));
authRoutes.get("/me", ensureAuthenticated, (req, res) => authController.me(req, res));
authRoutes.post("/logout", ensureAuthenticated, (req, res) => authController.logout(req, res));

export { authRoutes };
