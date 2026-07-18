import { v4 as uuidv4 } from "uuid";
import { AuthError } from "../errors/AuthError";
import { IPasswordHasher } from "../ports/IPasswordHasher";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export interface RegisterUserInput {
  nome: string;
  email: string;
  senha: string;
}

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const nome = input.nome?.trim() ?? "";
    const email = input.email?.trim().toLowerCase() ?? "";
    const senha = input.senha ?? "";

    if (!nome) {
      throw new AuthError("Nome obrigatorio.", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AuthError("Email invalido.", 400);
    }

    if (senha.length < 8) {
      throw new AuthError("A senha deve ter ao menos 8 caracteres.", 400);
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AuthError("Email ja cadastrado.", 409);
    }

    const passwordHash = await this.passwordHasher.hash(senha);
    const now = new Date();

    const user = new User({
      id: uuidv4(),
      nome,
      email,
      passwordHash,
      ativo: true,
      roles: ["FUNCIONARIO"],
      createdAt: now,
      updatedAt: now,
    });

    return this.userRepository.save(user);
  }
}
