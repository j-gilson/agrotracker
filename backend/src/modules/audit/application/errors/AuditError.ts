export class AuditError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AuditError";
    this.statusCode = statusCode;
  }
}
