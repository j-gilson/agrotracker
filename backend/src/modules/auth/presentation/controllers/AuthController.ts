import { Request, Response } from "express";
import { AuthError } from "../../application/errors/AuthError";
import { GetCurrentUser } from "../../application/usecases/GetCurrentUser";
import { LoginUser } from "../../application/usecases/LoginUser";
import { LogoutUser } from "../../application/usecases/LogoutUser";
import { RegisterUser } from "../../application/usecases/RegisterUser";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser,
    private readonly getCurrentUser: GetCurrentUser,
    private readonly logoutUser: LogoutUser
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

      await this.logoutUser.execute(token ?? "");

      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao realizar logout." });
    }
  }
}
