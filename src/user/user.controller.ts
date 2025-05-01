import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/index.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('created')
    created(@Body() dto: CreateUserDto) {
        return this.userService.creat(dto);
    }
}
