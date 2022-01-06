export class JwtResponse {
  readonly token: string;

  constructor(data: { token: string }) {
    this.token = data.token;
  }
}
