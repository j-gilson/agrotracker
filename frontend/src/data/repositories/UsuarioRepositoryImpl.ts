import { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository";
import { Usuario } from "../../domain/entities/Usuario";

export class UsuarioRepositoryImpl implements IUsuarioRepository {
  async findById(id: string): Promise<Usuario | undefined> {
    // Mock implementation
    return new Usuario({
      id,
      nome: "Usuário Mock",
      email: "mock@agrotracker.com",
      fazendaIds: ["f1", "f2"]
    });
  }

  async findByEmail(email: string): Promise<Usuario | undefined> {
    // Mock implementation
    return new Usuario({
      id: "u1",
      nome: "Usuário Mock",
      email,
      fazendaIds: ["f1", "f2"]
    });
  }

  async save(usuario: Usuario): Promise<Usuario> {
    // Mock implementation
    return usuario;
  }
}
