import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { ProviderEnum, RoleEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import moment from 'moment';
import { v4 } from 'uuid';
import { RefreshTokenPayload, TokensInterface } from './interfaces';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        readonly prismaService: PrismaService,
        private configService: ConfigService,
    ) {}

    async register(dto: RegisterUserDto, userAgent: string) {
        const user = await this.prismaService.user.findUnique({
            where: { email: dto.password },
        });
        if (user) {
            throw new BadRequestException('try to another email');
        }
        const hashPassword = await bcrypt.hash(dto.password, 10);

        const userCreate = await this.prismaService.user.create({
            data: {
                email: dto.email,
                password: hashPassword,
                role: [RoleEnum.USER],
                provider: ProviderEnum.LOCAL,
            },
        });

        if (!userCreate) {
            throw new InternalServerErrorException('Try again later');
        }

        const jwtToken = await this.createJwtToken(
            userCreate.id,
            userCreate.email,
            userCreate.role,
        );
        const refreshToken = await this.createRefreshToken(
            userCreate.id,
            userAgent,
        );
        return {
            accessToken: 'Bearer ' + jwtToken,
            refreshToken: refreshToken,
        };
    }

    async login(
        dto: LoginUserDto,
        userAgent: string,
    ): Promise<TokensInterface> {
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

        const jwtToken = await this.createJwtToken(
            user.id,
            user.email,
            user.role,
        );
        const refreshToken = await this.createRefreshToken(user.id, userAgent);
        return {
            accessToken: 'Bearer ' + jwtToken,
            refreshToken: refreshToken,
        };
    }

    async refreshToken(
        token: string,
        userAgent: string,
    ): Promise<TokensInterface> {
        const userSelection = {
            id: true,
            email: true,
            role: true,
        };
        const tokenWithUser = await this.prismaService.token.findUnique({
            where: { token },
            select: {
                user: {
                    select: userSelection,
                },
            },
        });

        if (!tokenWithUser) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const jwtToken = await this.createJwtToken(
            tokenWithUser.user.id,
            tokenWithUser.user.email,
            tokenWithUser.user.role,
        );
        const refreshToken = await this.createRefreshToken(
            tokenWithUser.user.id,
            userAgent,
        );

        return {
            accessToken: 'Bearer ' + jwtToken,
            refreshToken: refreshToken,
        };
    }

    async logout(refreshToken: string, userAgent: string) {
        return await this.prismaService.token.deleteMany({
            where: { token: refreshToken, userAgent },
        });
    }

    private async createJwtToken(
        id: string,
        email: string,
        role: RoleEnum[],
    ): Promise<string> {
        const accessToken = await this.jwtService.signAsync({
            id,
            email,
            role,
        });

        return accessToken;
    }

    private async createRefreshToken(
        userId: string,
        userAgent: string,
    ): Promise<RefreshTokenPayload> {
        const exp = Math.floor(
            moment().unix() +
                ms(this.configService.get<string>('REFRESH_EXP')) / 1000,
        );

        const refreshToken = v4();

        await this.prismaService.token.upsert({
            where: { userId_userAgent: { userId, userAgent } },
            update: { token: refreshToken, exp },
            create: { token: refreshToken, exp, userAgent, userId },
        });

        return { token: refreshToken, exp: exp };
    }
}
