import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.enableCors({
    //     origin: 'http://localhost:5173', // адрес твоего фронтенда
    //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    //     credentials: true, // если нужны куки или авторизация
    // });
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    await app.listen(PORT);
}
bootstrap();
