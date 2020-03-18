export class HttpException extends Error {
  private response: Response;
  constructor(response: Response) {
    super(response.statusText);
    this.name = 'HttpException';
    this.response = response;
  }
}