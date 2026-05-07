import { AuthError } from "../errors/AuthError";
import { ISessionRepository } from "../../domain/repositories/ISessionRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export class GetCurrentUser {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(token: string): Promise<User> {
    if (!token?.trim()) {
      throw new AuthError("Token ausente.", 401);
    }

    const session = await this.sessionRepository.findByToken(token);
    if (!session) {
      throw new AuthError("Sessao expirada. Faca login novamente.", 401);
    }

    const user = await this.userRepository.findById(session.userId);
    if (!user) {
      throw new AuthError("Sessao invalida. Faca login novamente.", 401);
    }

    if (!user.ativo) {
      throw new AuthError("Usuario inativo.", 403);
    }

    return user;
  }
}
