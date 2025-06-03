import { PostTag } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsArray()
    @IsNotEmpty()
    @IsEnum(PostTag, { each: true, message: 'Invalid tags value' })
    tags: PostTag[];

    @IsUUID()
    @IsNotEmpty()
    authorId: string;
}
