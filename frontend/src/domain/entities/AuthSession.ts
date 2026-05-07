import { AuthUser } from './AuthUser';

export interface AuthSessionProps {
  token: string;
  user: AuthUser;
}

export class AuthSession {
  constructor(private props: AuthSessionProps) {
    this.validate();
  }

  private validate(): void {
    if (!this.props.token?.trim()) throw new Error('Token invalido');
    if (!this.props.user) throw new Error('Usuario invalido');
  }

  get token(): string {
    return this.props.token;
  }

  get user(): AuthUser {
    return this.props.user;
  }
}
