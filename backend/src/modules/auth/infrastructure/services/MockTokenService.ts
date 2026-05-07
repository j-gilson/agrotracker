import { randomBytes } from "crypto";
import { ITokenService } from "../../application/ports/ITokenService";

export class MockTokenService implements ITokenService {
  async issueToken(userId: string): Promise<string> {
    const nonce = randomBytes(16).toString("hex");
    return `mock.${userId}.${nonce}`;
  }
}
