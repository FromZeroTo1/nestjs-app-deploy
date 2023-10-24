import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'

export enum EnumProductSort {
	POPULAR = 'По популярности',
	NEWEST = 'По новинке',
	LOW_PRICE = 'Дешевле',
	HIGH_PRICE = 'Дороже',
	BY_DISCOUNT = 'По размеру скидки'
}

export class GetAllProductDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumProductSort)
	sort?: EnumProductSort

	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@IsString()
	minPrice?: string

	@IsOptional()
	@IsString()
	maxPrice?: string

	@IsOptional()
	@IsString()
	material?: string

	@IsOptional()
	@IsString()
	season?: string

	@IsOptional()
	@IsString()
	dimension?: string

	@IsOptional()
	@IsString()
	color?: string

	@IsOptional()
	@IsString()
	category?: string
}
