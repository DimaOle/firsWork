import { Exclude } from 'class-transformer';

export class PostEntity {
    constructor(partial: Partial<PostEntity>) {
        Object.assign(this, partial);
    }

    id: number;
    title: string;
    content: string;
    authorId: string;
    tags: string[];

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;
}
