import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  readonly email!: Email;

  @IsString()
  @Length(6, 50)
  @IsNotEmpty()
  readonly password!: string;
}
