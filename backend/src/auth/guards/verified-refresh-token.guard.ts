import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import moment from 'moment';
import { Request } from 'express';

@Injectable()
export class VerifiedRefreshToken implements CanActivate {
    constructor(private prismaService: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const refreshTokenFromCookies = request.cookies.refreshToken;

        if (!refreshTokenFromCookies) {
            throw new UnauthorizedException(
                'Refresh token not found in cookies',
            );
        }

        const refreshToken = await this.prismaService.token.findUnique({
            where: { token: refreshTokenFromCookies },
        });

        if (!refreshToken) {
            throw new UnauthorizedException(
                'Refresh token not found in database',
            );
        }
        const dateNowUnix = moment().unix();

        if (refreshToken.exp < dateNowUnix) {
            throw new UnauthorizedException('Refresh token expired');
        }
        return true;
    }
}
