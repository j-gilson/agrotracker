import { MemberRole } from "../types";

export interface FazendaMemberProps {
  id: string;
  fazendaId: string;
  userId: string;
  role: MemberRole;
  active: boolean;
  createdAt: Date;
}

export class FazendaMember {
  constructor(private props: FazendaMemberProps) {
    this.validate();
  }

  private validate(): void {
    if (!this.props.id) throw new Error("ID do membro e obrigatorio");
    if (!this.props.fazendaId) throw new Error("ID da fazenda e obrigatorio");
    if (!this.props.userId) throw new Error("ID do usuario e obrigatorio");
    if (!this.props.role) throw new Error("Papel do membro e obrigatorio");
  }

  get id(): string {
    return this.props.id;
  }

  get fazendaId(): string {
    return this.props.fazendaId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get role(): MemberRole {
    return this.props.role;
  }

  get active(): boolean {
    return this.props.active;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  withRole(role: MemberRole): FazendaMember {
    return new FazendaMember({
      ...this.props,
      role,
    });
  }

  withActive(active: boolean): FazendaMember {
    return new FazendaMember({
      ...this.props,
      active,
    });
  }
}
