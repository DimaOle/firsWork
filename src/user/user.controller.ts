import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/index.dto';
import { ResponseUser } from './response';

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

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':idOrEmail')
    async findUser(@Param('idOrEmail') idOrEmail: string) {
        const user = await this.userService.findUser(idOrEmail);
        return new ResponseUser(user);
    }
}
