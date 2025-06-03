import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthorCheckGuard implements CanActivate {
    constructor() {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id;
        const roles = request.user?.roles ?? [];
        const isAdmin = roles.includes('ADMIN');
        if (isAdmin) return true;

        const authorId =
            request.body?.authorId ??
            request.params?.authorId ??
            request.query?.authorId;
        if (!userId || !authorId) {
            throw new UnauthorizedException(
                'User is not authorized or authorId not passed in request parameters.',
            );
        }

        if (String(userId) !== String(authorId)) {
            throw new ForbiddenException(
                'You are not the author of this post.',
            );
        }

        return true;
    }
}
