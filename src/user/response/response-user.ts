import { Exclude } from 'class-transformer';
import { Post, ProviderEnum, RoleEnum, Token, User } from 'generated/prisma';

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
