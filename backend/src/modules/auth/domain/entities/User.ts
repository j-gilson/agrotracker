export interface UserProps {
  id: string;
  nome: string;
  email: string;
  passwordHash: string;
  ativo: boolean;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(private props: UserProps) {
    this.validate();
  }

  private validate(): void {
    if (!this.props.id) throw new Error("ID do usuario e obrigatorio");
    if (!this.props.nome?.trim()) throw new Error("Nome e obrigatorio");
    if (!this.props.email?.trim()) throw new Error("Email e obrigatorio");
    if (!this.props.passwordHash?.trim()) throw new Error("Senha invalida");
    if (!Array.isArray(this.props.roles)) throw new Error("Roles invalidas");
  }

  get id(): string {
    return this.props.id;
  }

  get nome(): string {
    return this.props.nome;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get ativo(): boolean {
    return this.props.ativo;
  }

  get roles(): string[] {
    return [...this.props.roles];
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  withUpdatedAt(updatedAt: Date): User {
    return new User({
      ...this.props,
      updatedAt,
    });
  }
}
