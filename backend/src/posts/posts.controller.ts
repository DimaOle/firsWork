import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
    CreatePostDto,
    DeletePostDto,
    GetOnePostDto,
    GetPostsByAuthor,
    GetPostsByTags,
    UpdatePostDto,
} from './dto';
import { AuthorCheckGuard } from './guards';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post('create')
    createPost(@Body() dto: CreatePostDto) {
        return this.postsService.createPost(dto);
    }

    @Post('update')
    @UseGuards(AuthorCheckGuard)
    updatePost(@Body() dto: UpdatePostDto) {
        return this.postsService.updatePost(dto);
    }

    @Delete('delete')
    detetePost(@Query() dto: DeletePostDto) {
        return this.postsService.deletePost(dto.id, dto.authorId);
    }

    @Get('postByAuthor')
    getPost(@Query() dto: GetOnePostDto) {
        return this.postsService.getPost(dto.id, dto.authorId);
    }

    @Get('postsByTags')
    @UseInterceptors(ClassSerializerInterceptor)
    getPostsByTags(@Query() dto: GetPostsByTags) {
        const page = dto.page ?? 1;
        return this.postsService.getPostByTags(page, dto.tags);
    }

    @Get('postsByAuthor')
    @UseInterceptors(ClassSerializerInterceptor)
    getPostsByAuthor(@Query() dto: GetPostsByAuthor) {
        const page = dto.page ?? 1;
        return this.postsService.getPostByAuthor(dto.authorId, page);
    }
}
