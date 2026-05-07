import { User } from "../entities/User";

export interface CreateUserInput {
  id: string;
  nome: string;
  email: string;
  passwordHash: string;
  ativo: boolean;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
}
