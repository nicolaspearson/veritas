export class BaseUserResponse {
  readonly id: Uuid;

  constructor(data: { id: Uuid }) {
    this.id = data.id;
  }
}
