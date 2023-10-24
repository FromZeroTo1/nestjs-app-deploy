import { Type } from 'class-transformer'
import {
	ArrayMinSize,
	IsArray,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator'

class ProductColor {
	@IsString()
	name: string

	@IsString()
	hex: string

	@IsOptional()
	@IsString({ each: true })
	images: string[]

	@IsNumber()
	left: number

	@IsNumber()
	productId: number
}

class ProductDimension {
	@IsString()
	dimension: string

	@IsOptional()
	@IsString({ each: true })
	images: string[]

	@IsNumber()
	left: number

	@IsNumber()
	productId: number
}

class ProductCharacteristic {
	@IsString()
	material: string

	@IsString()
	season: string

	@IsString()
	color: string

	@IsString()
	style: string

	@IsString()
	sleeve: string

	@IsString()
	country: string

	@IsNumber()
	productId: number
}

export class ProductDto {
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	description: string

	@IsOptional()
	@IsNumber()
	salePrice: number

	@IsNumber()
	price: number

	@IsOptional()
	@IsString()
	sku: string

	@IsNumber()
	quantity: number

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductColor)
	colors: ProductColor[]

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductDimension)
	dimensions: ProductDimension[]

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductCharacteristic)
	characteristics: ProductCharacteristic

	@IsOptional()
	@IsString({ each: true })
	tags: string[]

	@IsString({ each: true })
	@ArrayMinSize(1)
	images: string[]

	@IsNumber()
	categoryId: number

	@IsNumber()
	lookId: number
}
