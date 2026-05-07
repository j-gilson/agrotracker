import { AuthError } from "../errors/AuthError";
import { IPasswordHasher } from "../ports/IPasswordHasher";
import { ITokenService } from "../ports/ITokenService";
import { ISessionRepository } from "../../domain/repositories/ISessionRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export interface LoginUserInput {
  email: string;
  senha: string;
}

export interface LoginUserResult {
  token: string;
  user: User;
}

export class LoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserResult> {
    const email = input.email?.trim().toLowerCase() ?? "";
    const senha = input.senha ?? "";

    if (!email || !senha) {
      throw new AuthError("Dados invalidos.", 400);
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthError("Usuario nao encontrado.", 404);
    }

    if (!user.ativo) {
      throw new AuthError("Usuario inativo.", 403);
    }

    const ok = await this.passwordHasher.compare(senha, user.passwordHash);
    if (!ok) {
      throw new AuthError("Senha invalida.", 401);
    }

    const token = await this.tokenService.issueToken(user.id);
    await this.sessionRepository.save({
      token,
      userId: user.id,
      createdAt: new Date(),
    });

    return { token, user };
  }
}
