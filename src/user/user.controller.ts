import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RoleDto, CreateUserDto } from './dto';
import { ResponseUser } from './response';
import { Roles } from 'libs/common/src/decorators';
import { RolesGuard } from 'libs/common/src/guards/roles.guard';
import { RoleEnum } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('created')
    async created(@Body() dto: CreateUserDto) {
        const user = await this.userService.creat(dto);
        return {
            result: 'ok',
            data: new ResponseUser(user),
        };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('allUsers')
    async findAllUsers() {
        const users = await this.userService.findAllUsesrs();
        return users.map((el) => new ResponseUser(el));
    }
    @UseGuards(RolesGuard)
    @Roles(RoleEnum.USER, RoleEnum.ADMIN)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':idOrEmail')
    async findUser(@Param('idOrEmail') idOrEmail: string) {
        const user = await this.userService.findUser(idOrEmail);
        return new ResponseUser(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Put('addRole')
    async addRole(@Body() addRoleDto: RoleDto) {
        const user = await this.userService.addRole(addRoleDto);
        return new ResponseUser(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Put('deleteRole')
    async deleteRole(@Body() addRoleDto: RoleDto) {
        const user = await this.userService.deleteRole(addRoleDto);
        return new ResponseUser(user);
    }
}
