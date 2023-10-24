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
import { PostCategoryDto } from './dto/post-category.dto'
import { PostCategoryService } from './post-category.service'

@Controller('post-categories')
export class PostCategoryController {
	constructor(private readonly postCategoryService: PostCategoryService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.postCategoryService.getAll(searchTerm)
	}

	@Get(':id')
	@Auth()
	async getById(@Param('id') id: string) {
		return this.postCategoryService.byId(+id)
	}

	@Auth('admin')
	@HttpCode(200)
	@Post()
	async create() {
		return this.postCategoryService.create()
	}

	@UsePipes(new ValidationPipe())
	@Auth('admin')
	@HttpCode(200)
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: PostCategoryDto) {
		return this.postCategoryService.update(+id, dto)
	}

	@Auth('admin')
	@HttpCode(200)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.postCategoryService.delete(+id)
	}
}
