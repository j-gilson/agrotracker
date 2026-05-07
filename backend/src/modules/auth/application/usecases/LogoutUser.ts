import { ISessionRepository } from "../../domain/repositories/ISessionRepository";
import { AuthError } from "../errors/AuthError";

export class LogoutUser {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(token: string): Promise<void> {
    const value = token?.trim() ?? "";
    if (!value) {
      throw new AuthError("Token ausente.", 401);
    }
    await this.sessionRepository.deleteByToken(value);
  }
}

