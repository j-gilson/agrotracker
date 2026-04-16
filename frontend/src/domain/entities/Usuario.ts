export interface UsuarioProps {
  id?: string;
  nome: string;
  email: string;
  fazendaIds: string[];
}

export class Usuario {
  constructor(private props: UsuarioProps) {
    this.validate();
  }

  private validate() {
    if (!this.props.email.includes("@")) throw new Error("Email inválido");
    if (!this.props.nome) throw new Error("Nome é obrigatório");
  }

  get id() { return this.props.id; }
  get nome() { return this.props.nome; }
  get email() { return this.props.email; }
  get fazendaIds() { return [...this.props.fazendaIds]; }
}
