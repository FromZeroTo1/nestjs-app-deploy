import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { GetAllPostDto } from './dto/get-all.post.dto'
import { PostDto } from './dto/post.dto'
import { PostService } from './post.service'

@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: GetAllPostDto) {
		return this.postService.getAll(queryDto)
	}

	@UsePipes(new ValidationPipe())
	@Get('popular')
	async getPopular(@Query('limit') limit?: string) {
		return this.postService.getPopular(+limit)
	}

	@Get('by-slug/:slug')
	async getPostBySlug(@Param('slug') slug: string) {
		return this.postService.bySlug(slug)
	}

	@Get(':id')
	@Auth('admin')
	async getPost(@Param('id') id: string) {
		return this.postService.byId(+id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createPost() {
		return this.postService.create()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updatePost(@Param('id') id: string, @Body() dto: PostDto) {
		return this.postService.update(+id, dto)
	}

	@Auth('admin')
	@HttpCode(200)
	@Delete(':id')
	async deletePost(@Param('id') id: string) {
		return this.postService.delete(+id)
	}
}
