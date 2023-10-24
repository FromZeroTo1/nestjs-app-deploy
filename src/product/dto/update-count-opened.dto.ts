import { IsString } from 'class-validator'

export class ProductUpdateCountOpenedDto {
	@IsString()
	slug: string
}
