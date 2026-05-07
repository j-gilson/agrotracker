import { AuthSession } from '../entities/AuthSession';
import { AuthUser } from '../entities/AuthUser';

export interface RegisterInput {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginInput {
  email: string;
  senha: string;
}

export interface IAuthRepository {
  register(input: RegisterInput): Promise<AuthUser>;
  login(input: LoginInput): Promise<AuthSession>;
  me(token: string): Promise<AuthUser>;
}
