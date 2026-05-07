export interface Session {
  token: string;
  userId: string;
  createdAt: Date;
}

export interface ISessionRepository {
  save(session: Session): Promise<void>;
  findByToken(token: string): Promise<Session | undefined>;
  deleteByToken(token: string): Promise<void>;
}
