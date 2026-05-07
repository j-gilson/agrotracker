import { IAuthRepository, RegisterInput } from '../../repositories/IAuthRepository';
import { AuthUser } from '../../entities/AuthUser';

export class RegisterUser {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: RegisterInput): Promise<AuthUser> {
    if (!input.nome?.trim()) throw new Error('Nome obrigatorio.');
    if (!input.email?.trim()) throw new Error('Email obrigatorio.');
    if (!input.email.includes('@')) throw new Error('Email invalido.');
    if (!input.senha || input.senha.length < 6)
      throw new Error('A senha deve ter ao menos 6 caracteres.');

    return this.authRepository.register({
      nome: input.nome.trim(),
      email: input.email.trim().toLowerCase(),
      senha: input.senha,
    });
  }
}
