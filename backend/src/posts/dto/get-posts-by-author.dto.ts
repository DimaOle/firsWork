import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class GetPostsByAuthor {
    @IsUUID()
    authorId: string;

    @IsOptional()
    @Min(1)
    @Type(() => Number)
    @IsInt()
    page: number;
}
