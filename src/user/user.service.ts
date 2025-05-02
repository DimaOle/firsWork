import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleDto, CreateUserDto } from './dto';
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

    async addRole(addRoleDto: RoleDto): Promise<User> {
        const { id, role } = addRoleDto;
        const user = await this.prismaService.user.findFirst({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found by id');
        }
        const matchRole = user.role.includes(role);

        if (matchRole) {
            throw new ConflictException('The role has already been added');
        }

        return await this.prismaService.user.update({
            where: { id },
            data: {
                role: [...user.role, role],
            },
        });
    }

    async deleteRole(addRoleDto: RoleDto): Promise<User> {
        const { id, role } = addRoleDto;
        const user = await this.prismaService.user.findFirst({ where: { id } });

        if (!user) {
            throw new NotFoundException('User not found by id');
        }

        const matchRole = user.role.includes(role);

        if (!matchRole) {
            throw new ConflictException('The role not found');
        }
        const index = user.role.indexOf(role);
        user.role.splice(index, 1);

        return await this.prismaService.user.update({
            where: { id },
            data: { role: user.role },
        });
    }
}
