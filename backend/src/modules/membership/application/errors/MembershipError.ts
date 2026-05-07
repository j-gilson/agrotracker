export class MembershipError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "MembershipError";
    this.statusCode = statusCode;
  }
}
