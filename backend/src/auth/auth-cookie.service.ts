import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RefreshTokenPayload } from './interfaces';

@Injectable()
export class AuthCookie {
    constructor(private readonly configService: ConfigService) {}

    setRefreshToken(res: Response, refreshToken: RefreshTokenPayload) {
        const expNumber =
            typeof refreshToken.exp === 'bigint'
                ? Number(refreshToken.exp)
                : refreshToken.exp;
        const maxAgeMs = (expNumber - Math.floor(Date.now() / 1000)) * 1000;

        res.cookie('refreshToken', refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: maxAgeMs,
            secure: this.configService.get('NODE_ENV') === 'production',
            path: '/',
        });
    }

    clearRefreshToken(res: Response) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'lax',
            secure: this.configService.get('NODE_ENV') === 'production',
            path: '/',
        });

        return { message: 'Logged out successfully' };
    }
}
