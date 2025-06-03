import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class GetPostsByTags {
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    page: number;

    @IsString()
    @IsNotEmpty()
    tags: string;
}
