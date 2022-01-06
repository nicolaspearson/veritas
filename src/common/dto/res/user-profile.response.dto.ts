import { User } from '$/db/entities/user.entity';

import { BaseUserProfileResponse } from './base-user-profile.response.dto';

export class UserProfileResponse extends BaseUserProfileResponse {
  constructor(data: User) {
    super(data);
  }
}
