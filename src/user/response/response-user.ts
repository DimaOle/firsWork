import { Post, ProviderEnum, RoleEnum, Token, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ResponseUser implements User {
    constructor(user: User) {
        Object.assign(this, user);
    }

    id: string;
    email: string;

    @Exclude()
    password: string;

    role: RoleEnum[];
    provider: ProviderEnum;

    @Exclude()
    createdAt: Date;

    updatedAt: Date;
    Post: Post[];
    Token: Token[];
}
