import { User } from '$/db/entities/user.entity';

import { BaseUserResponse } from './base-user.response.dto';

export class BaseUserProfileResponse extends BaseUserResponse {
  readonly email: Email;

  constructor(data: User) {
    super({ id: data.id });
    this.email = data.email;
  }
}
