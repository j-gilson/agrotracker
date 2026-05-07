import { IAuthRepository } from '../../repositories/IAuthRepository';
import { AuthUser } from '../../entities/AuthUser';

export class GetCurrentUser {
  constructor(private authRepository: IAuthRepository) {}

  async execute(token: string): Promise<AuthUser> {
    if (!token?.trim()) throw new Error('Sessao invalida.');
    return this.authRepository.me(token);
  }
}
