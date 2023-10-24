import { ArrayMinSize, IsNumber, IsString } from 'class-validator'

export class LookDto {
	@IsString()
	name: string

	@IsString({ each: true })
	@ArrayMinSize(1)
	images: string[]

	@IsNumber()
	categoryId: number
}
