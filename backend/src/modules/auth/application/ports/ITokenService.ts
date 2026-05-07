export interface ITokenService {
  issueToken(userId: string): Promise<string>;
}
