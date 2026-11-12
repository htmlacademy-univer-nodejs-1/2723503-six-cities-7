export class HttpError extends Error {
  constructor(
    public readonly httpStatusCode: number,
    message: string,
    public readonly detail?: string,
  ) {
    super(message);
  }
}
