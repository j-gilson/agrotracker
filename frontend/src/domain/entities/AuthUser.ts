export interface AuthUserProps {
  id: string;
  nome: string;
  email: string;
}

export class AuthUser {
  constructor(private props: AuthUserProps) {
    this.validate();
  }

  private validate(): void {
    if (!this.props.id) throw new Error('ID do usuario e obrigatorio');
    if (!this.props.nome?.trim()) throw new Error('Nome e obrigatorio');
    if (!this.props.email?.trim()) throw new Error('Email e obrigatorio');
    if (!this.props.email.includes('@')) throw new Error('Email invalido');
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
}
