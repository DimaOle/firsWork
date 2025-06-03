import { Type } from 'class-transformer';
import { IsInt, IsUUID, Min } from 'class-validator';

export class GetOnePostDto {
    @IsInt()
    @Min(1)
    @Type(() => Number)
    id: number;

    @IsUUID()
    authorId: string;
}
