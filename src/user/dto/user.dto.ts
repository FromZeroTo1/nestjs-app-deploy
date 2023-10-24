import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'

export class Address {
	@IsNumber()
	id: number

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

	@IsString()
	information: string
}

export class Card {
	@IsNumber()
	id: number

	@IsOptional()
	@IsString()
	bankName?: string

	@IsString()
	cardNumber: string

	@IsString()
  expirationDate: string

	@IsString()
  holderName: string

	@IsString()
  cvv: string
}

export class UserDto {
	@IsEmail()
	email: string

	@IsOptional()
	@IsString()
	password?: string

	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	avatarPath?: string

	@IsOptional()
	@IsString()
	bornAt?: string

	@IsOptional()
	@IsString()
	phone?: string

	@IsOptional()
	@IsBoolean()
	smsNotification?: boolean

	@IsOptional()
	@IsBoolean()
	emailNotification?: boolean

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => Address)
	addresses?: Address[]

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => Card)
	cards?: Card[]
}

export class NotificationDto {
	@IsOptional()
	@IsBoolean()
	smsNotification?: boolean

	@IsOptional()
	@IsBoolean()
	emailNotification?: boolean
}
