import { IsEnum, IsUUID } from 'class-validator';
import { RoleEnum } from 'generated/prisma';

export class RoleDto {
    @IsUUID()
    id: string;

    @IsEnum(RoleEnum, { message: 'Invalid role value' })
    role: RoleEnum;
}
