import { IsString } from 'class-validator'

export class PostCategoryDto {
	@IsString()
	name: string
}