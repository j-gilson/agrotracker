import { InviteStatus, MemberRole } from '../types';

export interface InviteProps {
  id: string;
  fazendaId: string;
  fazendaNome?: string;
  email: string;
  role: MemberRole;
  token: string;
  status: InviteStatus;
  createdAt: Date;
}

export class Invite {
  constructor(private props: InviteProps) {
    this.validate();
  }

  private validate(): void {
    if (!this.props.id) throw new Error('ID do convite e obrigatorio');
    if (!this.props.fazendaId) throw new Error('ID da fazenda e obrigatorio');
    if (!this.props.email?.trim()) throw new Error('Email e obrigatorio');
    if (!this.props.email.includes('@')) throw new Error('Email invalido');
    if (!this.props.token?.trim()) throw new Error('Token invalido');
  }

  get id(): string {
    return this.props.id;
  }

  get fazendaId(): string {
    return this.props.fazendaId;
  }

  get fazendaNome(): string | undefined {
    return this.props.fazendaNome;
  }

  get email(): string {
    return this.props.email;
  }

  get role(): MemberRole {
    return this.props.role;
  }

  get token(): string {
    return this.props.token;
  }

  get status(): InviteStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
