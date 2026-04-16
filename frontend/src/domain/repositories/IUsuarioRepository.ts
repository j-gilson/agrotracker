import { Usuario } from "../entities/Usuario";

export interface IUsuarioRepository {
  findById(id: string): Promise<Usuario | undefined>;
  findByEmail(email: string): Promise<Usuario | undefined>;
  save(usuario: Usuario): Promise<Usuario>;
}
