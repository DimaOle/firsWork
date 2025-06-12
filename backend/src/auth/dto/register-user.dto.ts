import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterUserDto {
    @IsEmail()
    email: string;

    @Length(6, 12)
    @IsString()
    password: string;
}
