import { IAuthRepository, LoginInput } from '../../repositories/IAuthRepository';
import { AuthSession } from '../../entities/AuthSession';

export class LoginUser {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: LoginInput): Promise<AuthSession> {
    const email = input.email?.trim().toLowerCase() ?? '';
    const senha = input.senha ?? '';

    if (!email || !senha) throw new Error('Dados invalidos.');

    return this.authRepository.login({ email, senha });
  }
}
