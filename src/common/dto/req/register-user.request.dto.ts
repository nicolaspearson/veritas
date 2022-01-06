import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserRequest {
  @IsEmail()
  @IsNotEmpty()
  readonly email!: Email;

  @IsString()
  @Length(6, 50)
  @IsNotEmpty()
  readonly password!: string;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;
}
