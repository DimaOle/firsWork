import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/index.dto';
import { RoleEnum, ProviderEnum, User } from 'generated/prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async creat(dto: CreateUserDto): Promise<User> {
        const findUser = await this.prismaService.user.findUnique({
            where: { email: dto.email },
        });

        if (findUser) {
            throw new BadRequestException('try to another email');
        }
        const hashPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prismaService.user.create({
            data: {
                email: dto.email,
                password: hashPassword,
                role: [RoleEnum.USER],
                provider: ProviderEnum.LOCAL,
            },
        });
        if (!user) {
            throw new InternalServerErrorException('Try again later');
        }

        return user;
    }

    async findUser(idOrEmail: string): Promise<User> {
        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [{ id: idOrEmail }, { email: idOrEmail }],
            },
            include: {
                Post: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findAllUsesrs(): Promise<User[]> {
        return await this.prismaService.user.findMany();
    }
}
