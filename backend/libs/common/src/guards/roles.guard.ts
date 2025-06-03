import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '@prisma/client';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const hasAccess = this.matchRoles(roles, user.role);
        if (!hasAccess) {
            throw new ForbiddenException(
                `Access denied: required roles [${roles.join(', ')}], but user has [${user.roles.join(', ')}]`,
            );
        }
        return true;
    }

    private matchRoles(roles: RoleEnum[], userRoles: RoleEnum[]): boolean {
        let result = false;
        for (let i = 0; i < roles.length; i++) {
            const match = userRoles.some((el) => roles[i] === el);
            if (match) {
                result = true;
                break;
            }
        }

        return result;
    }
}
