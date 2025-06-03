import { PostTag } from '@prisma/client';
import {
    IsArray,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsArray()
    @IsEnum(PostTag, { each: true, message: 'Invalid tags value' })
    tags?: PostTag[];

    @IsUUID()
    @IsNotEmpty()
    authorId: string;

    @IsInt()
    @IsNotEmpty()
    id: number;
}
