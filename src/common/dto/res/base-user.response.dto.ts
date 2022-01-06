export class BaseUserResponse {
  readonly id: number;

  constructor(data: { id: number }) {
    this.id = data.id;
  }
}
