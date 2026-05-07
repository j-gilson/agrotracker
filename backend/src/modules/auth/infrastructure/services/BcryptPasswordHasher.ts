import bcrypt from "bcryptjs";
import { IPasswordHasher } from "../../application/ports/IPasswordHasher";

export class BcryptPasswordHasher implements IPasswordHasher {
  constructor(private readonly saltRounds: number = 10) {}

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
