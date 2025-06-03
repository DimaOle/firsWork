import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { extractTokenFromHeader, isPublicCheck } from 'libs/common/src/utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private configService: ConfigService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = isPublicCheck(this.reflector, context);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('No token found in request');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('SECRET_KEY'),
            });
            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException(error);
        }
        return true;
    }
}
