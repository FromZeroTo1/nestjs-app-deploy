import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'

export enum EnumPostSort {
	POPULAR = 'По популярности',
	NEWEST = 'По новинке'
}

export class GetAllPostDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumPostSort)
	sort?: EnumPostSort

	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@IsString()
	category?: string
}
