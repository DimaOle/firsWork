import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GUARDS } from 'libs/common/src/guards';

@Module({
    providers: [UserService, ...GUARDS],
    controllers: [UserController],
})
export class UserModule {}
