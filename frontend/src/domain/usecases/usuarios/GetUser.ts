import { IUsuarioRepository } from "../../repositories/IUsuarioRepository";
import { Usuario } from "../../entities/Usuario";

export class GetUser {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(id: string): Promise<Usuario | undefined> {
    if (!id) throw new Error("ID do usuário é obrigatório");
    return await this.usuarioRepository.findById(id);
  }
}
