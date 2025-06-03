import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @Length(6, 12)
    @IsString()
    password: string;
}
