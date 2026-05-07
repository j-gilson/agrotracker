import { authApi } from '../api/authApi';
import { AuthSession } from '../../domain/entities/AuthSession';
import { AuthUser } from '../../domain/entities/AuthUser';
import { IAuthRepository, LoginInput, RegisterInput } from '../../domain/repositories/IAuthRepository';

export class AuthRepositoryImpl implements IAuthRepository {
  async register(input: RegisterInput): Promise<AuthUser> {
    const response = await authApi.register({
      nome: input.nome,
      email: input.email,
      senha: input.senha,
    });

    return new AuthUser({
      id: response.user.id,
      nome: response.user.nome,
      email: response.user.email,
    });
  }

  async login(input: LoginInput): Promise<AuthSession> {
    const response = await authApi.login({
      email: input.email,
      senha: input.senha,
    });

    const user = new AuthUser({
      id: response.user.id,
      nome: response.user.nome,
      email: response.user.email,
    });

    return new AuthSession({
      token: response.token,
      user,
    });
  }

  async me(token: string): Promise<AuthUser> {
    const response = await authApi.me(token);

    return new AuthUser({
      id: response.user.id,
      nome: response.user.nome,
      email: response.user.email,
    });
  }
}
