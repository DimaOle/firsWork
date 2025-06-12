import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
    @IsEmail()
    email: string;

    @Length(6, 12)
    @IsString()
    password: string;

    @Length(2, 30, {
        message: 'First name must be between 2 and 50 characters',
    })
    @IsNotEmpty({ message: 'First name is required' })
    firstName: string;

    @Length(2, 30, {
        message: 'Last name must be between 2 and 50 characters',
    })
    @IsNotEmpty({ message: 'Lest name is required' })
    lastName: string;
}
