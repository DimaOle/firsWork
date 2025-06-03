import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post, PostTag, Prisma } from '@prisma/client';
import { PostEntity } from './response';

@Injectable()
export class PostsService {
    constructor(private readonly prismaService: PrismaService) {}

    async createPost(dto: CreatePostDto): Promise<Post> {
        const tegsRecord = await this.prismaService.tag.findMany({
            where: {
                name: { in: dto.tags },
            },
        });

        return await this.prismaService.post.create({
            data: {
                title: dto.title,
                content: dto.content,
                authorId: dto.authorId,
                tags: {
                    connect: tegsRecord.map((el) => ({ id: el.id })),
                },
            },
        });
    }

    async updatePost(dto: UpdatePostDto): Promise<Post> {
        const post = await this.prismaService.post.findUnique({
            where: {
                id: dto.id,
                authorId: dto.authorId,
            },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const data: Prisma.PostUpdateInput = {};

        for (const key in dto) {
            if (dto[key] === undefined) continue;

            if (key === 'tags') {
                data.tags = {
                    set: [],
                    connect: dto[key].map((tag) => ({ name: tag })),
                };
            } else if (key !== 'tags' && key !== 'id') {
                data[key] = dto[key];
            }
        }

        return await this.prismaService.post.update({
            where: { id: dto.id },
            data,
        });
    }

    async deletePost(id: number, authorId: string): Promise<Post> {
        const post = await this.prismaService.post.findUnique({
            where: { id, authorId },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }
        console.log(post);
        return await this.prismaService.post.delete({
            where: { id: post.id, authorId: post.authorId },
        });
    }

    async getPost(id: number, authorId: string) {
        const post = await this.prismaService.post.findUnique({
            where: { id, authorId },
            include: {
                tags: true,
            },
        });

        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }

        return {
            ...post,
            tags: post.tags.map((el) => el.name),
        };
    }

    async getPostByTags(page: number, tags: string) {
        const pageStart = Number(page) || 1;
        const limit = 2;
        const skip = (pageStart - 1) * limit;
        const arrTags = tags
            .split(',')
            .map((el) => el.trim().toUpperCase())
            .filter((tag): tag is PostTag =>
                Object.values(PostTag).includes(tag as PostTag),
            );
        const posts = await this.prismaService.post.findMany({
            skip,
            take: limit,
            where: {
                tags: {
                    some: {
                        name: {
                            in: arrTags,
                        },
                    },
                },
            },
            include: {
                tags: true,
            },
        });

        return posts.map(
            (el) =>
                new PostEntity({ ...el, tags: el.tags.map((tag) => tag.name) }),
        );
    }

    async getPostByAuthor(authorId: string, page: number) {
        const pageStart = Number(page) || 1;
        const limit = 2;
        const skip = (pageStart - 1) * limit;

        const posts = await this.prismaService.post.findMany({
            skip,
            take: limit,
            where: {
                authorId,
            },
            include: {
                tags: true,
            },
        });

        return posts.map(
            (el) =>
                new PostEntity({
                    ...el,
                    tags: el.tags.map((tag) => tag.name),
                }),
        );
    }
}
