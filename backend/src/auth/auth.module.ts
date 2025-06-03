import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { option } from './config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards';
import { AuthCookie } from './auth-cookie.service';
import { TokenCleanupService } from './token-cleanup.service';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthCookie,
        TokenCleanupService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
    imports: [JwtModule.registerAsync(option())],
})
export class AuthModule {}
