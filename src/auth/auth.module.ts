import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { option } from './config';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [JwtModule.registerAsync(option())],
})
export class AuthModule {}
