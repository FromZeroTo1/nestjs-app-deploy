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
import { AddressService } from './address.service'
import { AddressDto } from './dto/address.dto'
import { CurrentUser } from 'src/auth/decorators/user.decorator'

@Controller('addresses')
export class AddressController {
	constructor(private readonly addressService: AddressService) {}

	@Get()
	async getAll() {
		return this.addressService.getAll()
	}

	@Get(':id')
	@Auth()
	async getById(@Param('id') id: string) {
		return this.addressService.byId(+id)
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: AddressDto) {
		return this.addressService.update(+id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	@Post('create')
	async create(@CurrentUser('id') userId: string, @Body() dto: AddressDto) {
		return this.addressService.create(+userId, dto)
	}

	@Auth()
	@HttpCode(200)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.addressService.delete(+id)
	}
}
