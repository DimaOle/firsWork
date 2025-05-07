import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    register(
        @Body() dto: LoginUserDto,
        @Headers('user-agent') userAgent: string,
    ) {
        return this.authService.login(dto, userAgent);
    }
}
