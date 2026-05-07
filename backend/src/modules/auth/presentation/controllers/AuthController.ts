import { Request, Response } from "express";
import { AuthError } from "../../application/errors/AuthError";
import { GetCurrentUser } from "../../application/usecases/GetCurrentUser";
import { LoginUser } from "../../application/usecases/LoginUser";
import { LogoutUser } from "../../application/usecases/LogoutUser";
import { RegisterUser } from "../../application/usecases/RegisterUser";
import { CreateAuditLog } from "../../../audit/application/usecases/CreateAuditLog";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser,
    private readonly getCurrentUser: GetCurrentUser,
    private readonly logoutUser: LogoutUser,
    private readonly createAuditLog: CreateAuditLog
  ) {}

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, email, senha } = req.body as {
        nome?: string;
        email?: string;
        senha?: string;
      };

      const user = await this.registerUser.execute({
        nome: nome ?? "",
        email: email ?? "",
        senha: senha ?? "",
      });

      await this.createAuditLog.execute({
        userId: user.id,
        userName: user.nome,
        userEmail: user.email,
        fazendaId: null,
        fazendaNome: null,
        entityType: "auth",
        entityId: user.id,
        action: "CREATE",
        description: `${user.nome} criou uma conta.`,
        before: null,
        after: { id: user.id, nome: user.nome, email: user.email },
      });

      return res.status(201).json({
        success: true,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
        },
      });
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erro inesperado ao criar conta.",
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha } = req.body as {
        email?: string;
        senha?: string;
      };

      const result = await this.loginUser.execute({
        email: email ?? "",
        senha: senha ?? "",
      });

      await this.createAuditLog.execute({
        userId: result.user.id,
        userName: result.user.nome,
        userEmail: result.user.email,
        fazendaId: null,
        fazendaNome: null,
        entityType: "auth",
        entityId: result.user.id,
        action: "LOGIN",
        description: `${result.user.nome} realizou login.`,
        before: null,
        after: { userId: result.user.id },
      });

      return res.status(200).json({
        success: true,
        token: result.token,
        user: {
          id: result.user.id,
          nome: result.user.nome,
          email: result.user.email,
        },
      });
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erro inesperado ao realizar login.",
      });
    }
  }

  async me(req: Request, res: Response): Promise<Response> {
    try {
      const token = res.locals.token as string | undefined;
      const user = await this.getCurrentUser.execute(token ?? "");

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
        },
      });
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erro inesperado ao carregar sessao.",
      });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const token = res.locals.token as string | undefined;
      const currentUser = res.locals.currentUser as { id: string; nome: string; email: string } | undefined;

      await this.logoutUser.execute(token ?? "");

      if (currentUser) {
        await this.createAuditLog.execute({
          userId: currentUser.id,
          userName: currentUser.nome,
          userEmail: currentUser.email,
          fazendaId: null,
          fazendaNome: null,
          entityType: "auth",
          entityId: currentUser.id,
          action: "LOGOUT",
          description: `${currentUser.nome} realizou logout.`,
          before: null,
          after: null,
        });
      }

      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao realizar logout." });
    }
  }
}
