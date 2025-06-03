import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

const jwtModuleOption = (configService: ConfigService): JwtModuleOptions => ({
    secret: configService.get<string>('SECRET_KEY'),
    signOptions: {
        expiresIn: configService.get<string>('JWT_EXP') || '1d',
    },
});

export const option = (): JwtModuleAsyncOptions => ({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
        jwtModuleOption(configService),
});
