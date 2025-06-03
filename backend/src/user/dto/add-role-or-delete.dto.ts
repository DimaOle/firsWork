import { RoleEnum } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';
export class RoleDto {
    @IsUUID()
    id: string;

    @IsEnum(RoleEnum, { message: 'Invalid role value' })
    role: RoleEnum;
}
