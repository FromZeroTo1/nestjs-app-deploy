import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CardService } from './card.service'
import { CardDto } from './dto/card.dto'
import { CurrentUser } from 'src/auth/decorators/user.decorator'

@Controller('cards')
export class CardController {
	constructor(private readonly cardService: CardService) {}

	@Get()
	async getAll() {
		return this.cardService.getAll()
	}

	@Get(':id')
	@Auth()
	async getById(@Param('id') id: string) {
		return this.cardService.byId(+id)
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	@Put('update/:id')
	async update(@Param('id') id: string, @Body() dto: CardDto) {
		return this.cardService.update(+id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	@Post('create')
	async create(@CurrentUser('id') userId: string, @Body() dto: CardDto) {
		return this.cardService.create(+userId, dto)
	}

	@Auth()
	@HttpCode(200)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.cardService.delete(+id)
	}
}
