import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class DeletePostDto {
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    id: number;

    @IsUUID()
    authorId: string;
}
