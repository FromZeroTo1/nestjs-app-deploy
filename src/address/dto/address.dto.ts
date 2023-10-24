import { IsOptional, IsString } from 'class-validator'

export class AddressDto {
	@IsString()
	city: string

	@IsString()
	street: string

	@IsString()
	house: string

	@IsOptional()
	@IsString()
	houseBody?: string

	@IsString()
	apartment: string

	@IsOptional()
	@IsString()
	information?: string
}
