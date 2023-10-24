import { IsNumber, IsString } from 'class-validator'

export class PostDto {
	@IsString()
	name: string

	@IsString()
	author: string

	@IsString()
	poster: string

	@IsNumber()
	categoryId: number
}
