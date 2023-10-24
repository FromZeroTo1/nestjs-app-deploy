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
import { GetAllLookDto } from './dto/get-all.look.dto'
import { LookService } from './look.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { LookDto } from './dto/look.dto'

@Controller('looks')
export class LookController {
	constructor(private readonly lookService: LookService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: GetAllLookDto) {
		return this.lookService.getAll(queryDto)
	}

	@Get(':id')
	@Auth('admin')
	async getLook(@Param('id') id: string) {
		return this.lookService.byId(+id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async createLook() {
		return this.lookService.create()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	async updateLook(@Param('id') id: string, @Body() dto: LookDto) {
		return this.lookService.update(+id, dto)
	}

	@Auth('admin')
	@HttpCode(200)
	@Delete(':id')
	async deleteLook(@Param('id') id: string) {
		return this.lookService.delete(+id)
	}
}
