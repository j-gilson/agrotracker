import { IUsuarioRepository } from "../../repositories/IUsuarioRepository";
import { Usuario, UsuarioProps } from "../../entities/Usuario";

export class CreateUser {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(data: UsuarioProps): Promise<Usuario> {
    const existingUser = await this.usuarioRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Usuário já cadastrado com este e-mail");
    }

    const usuario = new Usuario(data);
    return await this.usuarioRepository.save(usuario);
  }
}
