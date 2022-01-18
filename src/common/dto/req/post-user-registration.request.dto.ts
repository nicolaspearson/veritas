import { IsEmail, IsNotEmpty } from 'class-validator';

export class PostUserRegistrationRequest {
  @IsEmail()
  @IsNotEmpty()
  readonly email!: Email;
}
