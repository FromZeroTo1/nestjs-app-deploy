import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'

export enum EnumLookSort {
	POPULAR = 'По популярности',
	NEWEST = 'По новинке'
}

export class GetAllLookDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumLookSort)
	sort?: EnumLookSort

	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@IsString()
	category?: string
}
