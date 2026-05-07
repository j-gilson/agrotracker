export class EventError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "EventError";
    this.statusCode = statusCode;
  }
}
