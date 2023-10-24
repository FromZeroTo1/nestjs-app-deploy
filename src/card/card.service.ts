import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnCardObject } from './object/return-card.object'
import { CardDto } from './dto/card.dto'

@Injectable()
export class CardService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.card.findMany({
			select: returnCardObject
		})
	}

	async byId(id: number) {
		const card = await this.prisma.card.findUnique({
			where: {
				id
			},
			select: returnCardObject
		})

		if (!card) throw new NotFoundException('Card not found')

		return card
	}

	async create(userId: number, dto: CardDto) {
		return this.prisma.card.create({
			data: {
				bankName: dto.bankName,
				cardNumber: dto.cardNumber,
				expirationDate: dto.expirationDate,
				holderName: dto.holderName,
				cvv: dto.cvv,
				isDefault: dto.isDefault,
				userId: userId
			}
		})
	}

	async update(id: number, dto: CardDto) {
		return this.prisma.card.update({
			where: {
				id
			},
			data: {
				cardNumber: dto.cardNumber,
				expirationDate: dto.expirationDate,
				holderName: dto.holderName,
				cvv: dto.cvv,
				isDefault: dto.isDefault,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.card.delete({
			where: {
				id
			}
		})
	}
}
