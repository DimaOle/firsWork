import {
    Body,
    Controller,
    Post,
    Headers,
    Res,
    Get,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { Public } from 'libs/common/src/decorators/public.decorator';
import { Request, Response } from 'express';
import { VerifiedRefreshToken } from './guards';
import { AuthCookie } from './auth-cookie.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly authCookie: AuthCookie,
    ) {}

    @Post('login')
    @Public()
    async login(
        @Body() dto: LoginUserDto,
        @Headers('user-agent') userAgent: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken } = await this.authService.login(
            dto,
            userAgent,
        );
        this.authCookie.setRefreshToken(res, refreshToken);
        return { accessToken };
    }

    @Post('register')
    @Public()
    async register(
        @Body() dto: RegisterUserDto,
        @Headers('user-agent') userAgent: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const userToken = await this.authService.register(dto, userAgent);
        this.authCookie.setRefreshToken(res, userToken.refreshToken);
        return { accessToken: userToken.accessToken };
    }

    @Get('refresh-token')
    @Public()
    @UseGuards(VerifiedRefreshToken)
    async refresh(
        @Req() req: Request,
        @Headers('user-agent') userAgent: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken } =
            await this.authService.refreshToken(
                req.cookies.refreshToken,
                userAgent,
            );

        this.authCookie.setRefreshToken(res, refreshToken);
        return { accessToken };
    }

    @Get('logout')
    @UseGuards(VerifiedRefreshToken)
    async logout(
        @Headers('user-agent') userAgent: string,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request,
    ) {
        await this.authService.logout(req.cookies.refreshToken, userAgent);
        return this.authCookie.clearRefreshToken(res);
    }
}
