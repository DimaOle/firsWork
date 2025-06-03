import { Reflector } from '@nestjs/core';

import { PUBLIC_KEY } from '../decorators/public.decorator';
import { ExecutionContext } from '@nestjs/common';

export function isPublicCheck(
    reflector: Reflector,
    context: ExecutionContext,
): boolean {
    const isPublic = reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
        context.getClass(),
        context.getHandler(),
    ]);

    if (isPublic) {
        return true;
    }

    return false;
}
