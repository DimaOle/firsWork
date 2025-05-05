import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '@prisma/client';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<RoleEnum>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log(roles);
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        console.log(request.user);
        return true;
    }
}
