import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CardDto {
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

	@IsBoolean()
	isDefault: boolean
}