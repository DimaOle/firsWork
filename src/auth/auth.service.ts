import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dto';
import { User } from '@prisma/client';
import { Tokens } from './interfaces';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import moment from 'moment';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        readonly prismaService: PrismaService,
        private configService: ConfigService,
    ) {}

    async login(dto: LoginUserDto, userAgent: string) {
        const user = await this.prismaService.user.findFirst({
            where: { email: dto.email },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.password) {
            const matchPassword = await bcrypt.compare(
                dto.password,
                user.password,
            );

            if (!matchPassword) {
                throw new UnauthorizedException('Invalid credentials');
            }
        }

        const userToken = await this.createToken(user);
        await this.refreshToken(userToken.accessToken, user.id, userAgent);
        return { accessToken: 'Bearer ' + userToken.accessToken };
    }

    async createToken(user: User): Promise<Tokens> {
        const accessToken =
            'Bearer ' +
            (await this.jwtService.signAsync({
                id: user.id,
                email: user.email,
                roles: user.role,
            }));

        return { accessToken };
    }

    private async refreshToken(
        token: string,
        userId: string,
        userAgent: string,
    ) {
        const exp = Math.floor(
            moment().unix() +
                ms(this.configService.get<string>('JWT_EXP')) / 1000,
        );
        const tokenWithOutBearer = token.replace('Bearer ', '');

        await this.prismaService.token.upsert({
            where: { token: tokenWithOutBearer, userAgent },
            update: { userId, userAgent, exp },
            create: { token: tokenWithOutBearer, userId, userAgent, exp },
        });
        return;
    }
}
